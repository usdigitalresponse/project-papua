import React, { createContext, useContext, useState, useEffect } from 'react'
import { FormSchema, Form, Question, Copy } from '../forms/types'
import { isValid } from '../forms'
import { Box } from 'grommet'
import { omit } from 'lodash'
import { Spinner } from '../components/helper-components/Spinner'
import { LanguageContext } from './language'
import ky from 'ky'
import yaml from 'js-yaml'

interface FormState {
  form: Form
  setValue: (question: Question, value: Value) => void
  setError: (id: string, value: Copy[]) => void
  values: Values
  errors: Errors
  translateCopy: (copy: Copy) => string
  translateByID: (id: string) => string
}

export interface Values {
  [key: string]: Value
}

export interface Errors {
  [key: string]: Copy[]
}

export type Value = string | string[] | Date

const initialState = {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  /* eslint-disable @typescript-eslint/no-empty-function */
  form: undefined,
  values: {},
  errors: {},
  setValue: (question: Question, value: Value) => {},
  setError: (id: string, value: Copy[]) => {},
}

export const FormContext = createContext<FormState>(initialState as any)

export const FormProvider: React.FC = (props) => {
  const [form, setForm] = useState<Form | undefined>(initialState.form)
  const [values, setValues] = useState<Values>(initialState.values)
  const [errors, setErrors] = useState<Errors>(initialState.errors)
  const { language } = useContext(LanguageContext)

  useEffect(() => {
    const effect = async () => {
      // Load the form.yaml
      //
      // TODO: experiment with nextjs to see if we can embed this file instead
      // of fetching it. This'll speed up page load. Next would allow us to
      // get the benefits of ejecting CRA without ejecting.
      const [form, formSample] = await Promise.all([ky.get('/form.yml').text(), ky.get('/form.sample.yml').text()])

      // Parse the YAML -> JSON
      const contents = yaml.safeLoad(form, {
        json: true,
      })
      const sampleContents = yaml.safeLoad(formSample, {
        json: true,
      })

      // States will build their own form in `form.json` from the example in `form.sample.json`.
      // By default, we'll use the sample version until a state starts building their form in
      // `form.json`.
      const useSample = contents === null
      const rawForm = useSample ? sampleContents : contents

      // Validate the schema against our Joi schema
      // which makes it easier to identify issues in the form
      // than standard TS type validation (which just prints the error
      // without metadata like array index or object path).
      if (process.env.NODE_ENV === 'development') {
        const result = FormSchema.validate(rawForm, {
          abortEarly: false,
          allowUnknown: false,
          presence: 'required',
        })
        if (result.error) {
          console.error(
            `${useSample ? 'form.sample.yml' : 'form.yml'} does not match the expected schema`,
            result.error
          )
        }
      }

      setForm(rawForm)
    }

    effect().catch((err) => {
      console.error(err)
    })
  }, [])

  const setError = (key: string, value: Copy[]) => setErrors({ ...errors, [key]: value })
  const setValue = (question: Question, value: Value) => {
    const validationErrors = isValid(question, value, values)
    setValues({ ...values, [question.id]: value })
    if (validationErrors.length > 0) {
      setError(question.id, validationErrors)
    } else {
      setErrors(omit(errors, question.id))
    }
  }

  if (!form) {
    // The value we pass here doesn't matter, since we don't render the children.
    return (
      <FormContext.Provider value={{} as any}>
        <Box pad="medium">
          <Spinner />
        </Box>
      </FormContext.Provider>
    )
  }

  const translateCopy = (copy: Copy) => {
    let text = copy[language]

    // Apply templating variables by looking for `{{VARIABLE_NAME}}` fields:
    text = text.replace(/\{\{([A-Z_]+)\}\}/g, (m, key) => {
      // `key` is the regex-captured value inside the curly braces:
      const value = form.variables[key]
      // If we don't recognize this variable, then default to rendering
      // all of `{{VARIABLE_NAME}}` since that'll make the issue clearest.
      return value ? value : m
    })

    return text
  }

  const translateByID = (id: string): string => {
    return translateCopy(form.instructions[id])
  }

  const value: FormState = {
    form,
    values,
    setValue,
    errors,
    setError,
    translateCopy,
    translateByID,
  }

  return <FormContext.Provider value={value}>{props.children}</FormContext.Provider>
}
