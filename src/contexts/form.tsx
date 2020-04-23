import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import formSchema from '../form.schema.json'
import { Form, Question, Copy } from '../forms/types'
import { isValid, canContinue } from '../forms'
import { Box } from 'grommet'
import { omit } from 'lodash'
import { Spinner, Markdown, Card } from '../components/helper-components'
import { LanguageContext } from './language'
import ky from 'ky'
import yaml from 'js-yaml'
import Ajv from 'ajv'

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

type FormError = {
  message: string
  error?: any
}

export const FormProvider: React.FC = (props) => {
  const [form, setForm] = useState<Form | undefined>(initialState.form)
  const [values, setValues] = useState<Values>(initialState.values)
  const [errors, setErrors] = useState<Errors>(initialState.errors)
  const [completion, setCompletion] = useState<Record<string, boolean>>({})
  const [pageIndex, setPageIndex] = useState<number>(0)
  const [formValidationError, setFormValidationError] = useState<FormError | undefined>()
  const { language } = useContext(LanguageContext)

  useEffect(() => {
    const effect = async () => {
      // Load the form.yaml
      //
      // TODO: experiment with nextjs to see if we can embed this file instead
      // of fetching it. This'll speed up page load. Next would allow us to
      // get the benefits of ejecting CRA without ejecting.
      const [form, formSample] = await Promise.all([ky.get('/form.yml').text(), ky.get('/form.sample.yml').text()])

      let contents, sampleContents
      try {
        // Parse the YAML -> JSON
        contents = yaml.safeLoad(form, {
          json: true,
        })
        sampleContents = yaml.safeLoad(formSample, {
          json: true,
        })
      } catch (err) {
        setFormValidationError({
          message: 'Failed to parse YAML form',
          error: err,
        })
        return
      }

      // States will build their own form in `form.yml` from the example in `form.sample.yml`.
      // By default, we'll use the sample version until a state starts building their form in
      // `form.yml`.
      const useSample = contents === null
      const rawForm = useSample ? sampleContents : contents

      // During local development, we validate the form structure against
      // our JSON Schema and render any errors.
      if (process.env.NODE_ENV === 'development') {
        const ajv = new Ajv({
          allErrors: true,
        })
        const validator = ajv.compile(formSchema)
        validator(rawForm)
        if (validator.errors) {
          console.error(validator.errors)
          setFormValidationError({
            message: `${useSample ? 'form.sample.yml' : 'form.yml'} failed validation\n${validator.errors.map(
              (d) => `\n  - ${d.dataPath} ${d.message}`
            )}`,
          })
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

  if (formValidationError) {
    const content = `
## ⚠️ Form Parsing Error

${formValidationError.message}

${formValidationError.error ? '```' + JSON.stringify(formValidationError.error, null, 2) + '```' : ''}`

    return (
      <Card
        margin={{ vertical: 'medium', horizontal: 'auto' }}
        pad={{ horizontal: 'medium', vertical: 'small' }}
        background="white"
        width={{ max: '800px' }}
      >
        <Box pad="medium">
          <Markdown>{content}</Markdown>
        </Box>
      </Card>
    )
  }

  if (!form) {
    return (
      <Box pad="medium">
        <Spinner />
      </Box>
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
