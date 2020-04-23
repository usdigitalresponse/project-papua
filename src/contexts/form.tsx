import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { FormSchema, Form, Question, Copy } from '../forms/types'
import { isValid, canContinue } from '../forms'
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
  completion: Record<string, boolean>
  pageIndex: number
  setPage: (index: number) => void
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
  const [completion, setCompletion] = useState<Record<string, boolean>>({})
  const [pageIndex, setPageIndex] = useState<number>(0)
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

      // States will build their own form in `form.yml` from the example in `form.sample.yml`.
      // By default, we'll use the sample version until a state starts building their form in
      // `form.yml`.
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
    const newValues = { ...values, [question.id]: value }
    setValues(newValues)

    const validationErrors = isValid(question, value, values)
    const newErrors =
      validationErrors.length > 0 ? { ...errors, [question.id]: validationErrors } : omit(errors, question.id)
    setErrors(newErrors)

    const canContinueFromPage = canContinue(form!.pages[pageIndex - 1], newValues, newErrors)
    setCompletion({
      ...completion,
      [pageIndex]: canContinueFromPage,
    })
  }

  const translateCopy = useCallback(
    (copy: Copy) => {
      let text = copy[language]

      // Apply templating variables by looking for `{{VARIABLE_NAME}}` fields:
      text = text.replace(/\{\{([A-Z_]+)\}\}/g, (m, key) => {
        // `key` is the regex-captured value inside the curly braces:
        const value = form!.variables[key]
        // If we don't recognize this variable, then default to rendering
        // all of `{{VARIABLE_NAME}}` since that'll make the issue clearest.
        return value ? value : m
      })

      return text
    },
    [form, language]
  )

  const translateByID = (id: string): string => {
    return translateCopy(form!.instructions[id])
  }

  const setPage = (index: number) => {
    setPageIndex(index)
    window.scrollTo(0, 0)
  }

  useEffect(() => {
    if (form) {
      // Update the page title
      document.title = translateCopy(form.title)

      // Upsert the page description
      let description = document.querySelector('meta[name="description"]')
      if (!description) {
        description = document.createElement('meta')
        description.setAttribute('name', 'description')
        document.head.appendChild(description)
      }
      description.setAttribute('content', translateCopy(form.description))
    }
  }, [form, translateCopy])

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

  const value: FormState = {
    form,
    values,
    setValue,
    errors,
    setError,
    translateCopy,
    translateByID,
    completion,
    pageIndex,
    setPage,
  }

  return <FormContext.Provider value={value}>{props.children}</FormContext.Provider>
}
