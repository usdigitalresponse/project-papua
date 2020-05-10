import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import formSchema from '../form.schema.json'
import { Question, Copy, Form, Value, Values, Errors } from '../lib/types'
import { canContinue } from '../forms'
import { Box } from 'grommet'
import { omit, get } from 'lodash'
import { Spinner, Markdown, Card } from '../components/helper-components'
import { LanguageContext } from './language'
import ky from 'ky'
import yaml from 'js-yaml'
import Ajv from 'ajv'
import { getFlattenedQuestions } from '../forms/index'
import { isQuestionValid } from '../lib/validation'
import { transformInlineDefinitions } from '../lib/inline'

export interface FormState {
  form: Form
  setValue: (question: Question, value: Value, additionalValues?: Record<string, Value>) => void
  setError: (id: string, value: Copy[]) => void
  values: Values
  errors: Errors
  translateCopy: <C extends Copy | undefined>(
    copy: C,
    variables?: Record<string, string>
  ) => C extends Copy ? string : string | undefined
  translateByID: (id: string, variables?: Record<string, string>) => string
  completion: Record<string, boolean>
  pageIndex: number
  setPage: (index: number) => void
}

const initialState = {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  /* eslint-disable @typescript-eslint/no-empty-function */
  form: undefined,
  values: {},
  errors: {},
  setValue: (question: Question, value: Value, additionalValues?: Record<string, Value>) => {},
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
      const [form, formSample] = await Promise.all([ky.get('form.yml').text(), ky.get('form.sample.yml').text()])

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
      let rawForm = useSample ? sampleContents : contents

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
          const errors = validator.errors.filter(({ dataPath, message }) => {
            // Filter out error messages about the default (empty) form.yml schema.
            return !(
              dataPath === '' &&
              message &&
              ['should be string,null', 'should match exactly one schema in oneOf'].includes(message)
            )
          })
          setFormValidationError({
            message: `${useSample ? 'form.sample.yml' : 'form.yml'} failed validation\n${errors.map(
              (d) => `\n  - ${d.dataPath} ${d.message}`
            )}`,
          })
        }
      }

      // Inline any top-level quesiton set definitions:
      rawForm = transformInlineDefinitions(rawForm)

      setForm(rawForm)
    }

    effect().catch((err) => {
      console.error(err)
    })
  }, [])

  const setError = (key: string, value: Copy[]) => setErrors({ ...errors, [key]: value })
  const setValue = (question: Question, value: Value, additionalValues?: Record<string, Value>) => {
    console.log('[Google Analytics] sending event: Answer Updated')
    gtag('event', 'Answer Updated', {
      id: question.id,
      value,
    })

    const newValues =
      value !== undefined
        ? {
            ...values,
            [question.id]: value,
            ...additionalValues,
          }
        : omit(values, question.id)

    setValues(newValues)

    if (process.env.NODE_ENV === 'development') {
      console.log('Form values: ', newValues)
    }

    const { errors: validationErrors, dependencies } = isQuestionValid(question, value, values, form!)
    let newErrors =
      validationErrors.length > 0 ? { ...errors, [question.id]: validationErrors } : omit(errors, question.id)
    // Note: we only support question references within the same page. That's probably good enough,
    // but we could expand this in the future if needed.
    const page = form!.pages[pageIndex]
    for (const dep of dependencies) {
      if (values[dep] !== undefined) {
        const q = getFlattenedQuestions(page.questions, values).find((q) => q.id === dep)!
        // Note: we ignore deps here. We could recursively traverse them if we want, but we'll need
        // to avoid cycles. So we just handle a single level of depth (which should be good enough) for now.
        const { errors: depErrors } = isQuestionValid(q, values[dep], newValues, form!)
        newErrors = depErrors.length > 0 ? { ...newErrors, [q.id]: depErrors } : omit(newErrors, q.id)
      }
    }
    setErrors(newErrors)

    const canContinueFromPage = canContinue(page, newValues, newErrors)
    setCompletion({
      ...completion,
      [pageIndex]: canContinueFromPage,
    })
  }

  const translateCopy = useCallback(
    (copy, variables) => {
      if (!copy) {
        return undefined
      }

      let text = copy[language]

      // Apply templating variables by looking for `{{VARIABLE_NAME}}` fields.
      // The value is evaluated as the first truthy value of:
      //  1. If the key starts with `id:`, then the remainder of the key is considered a question ID
      //     and the corresponding value from the current set of form values is used.
      //  2. If a matching key is supplied in the `variables` argument to `translateCopy`.
      //  3. If a matching key exists in the form's top-level variables map.
      //  4. If nothing else, then the variable is left as-is (f.e.: {{VARIABLE_NAME}}).
      text = text.replace(/\{\{([a-ziA-Z0-9._:-]+)\}\}/g, (m, key) => {
        // `key` is the regex-captured value inside the curly braces:
        let value = get(variables || form?.variables, key)
        if (key.startsWith('id:')) {
          const questionID = key.slice(3)
          value = values[questionID] ? String(values[questionID]) : value
        }
        // If we don't recognize this variable, then default to rendering
        // all of `{{VARIABLE_NAME}}` since that'll make the issue clearest.
        return value ? value : m
      })

      return text
    },
    [form, language, values]
  ) as FormState['translateCopy']

  const translateByID = (id: string, variables?: Record<string, string>): string => {
    return translateCopy(form!.instructions[id], variables)
  }

  const setPage = (index: number) => {
    setPageIndex(index)
    window.scrollTo(0, 0)
  }

  /**
   * This hook is purely for testing, where it'll prefill form values so we can test
   * functionality later on in the form.
   */
  // const [prefilled, setPrefilled] = useState(false)
  // useEffect(() => {
  //   if (prefilled || !form || process.env.NODE_ENV !== 'development') return

  //   // Initialize form with some starter values for testing.
  //   // Note Number values won't render, but the value is there.
  //   const testValues: Record<string, [Value] | [Value, Record<string, Value>]> = {
  //     /* eslint-disable @typescript-eslint/camelcase */
  //     agreement: [true],
  //     employed_in_new_jersey: ['laid-off-in-new-jersey'],
  //     'relationship-to-employer': ['receiving-partial-unemployment'],
  //     'describe-situation': [
  //       ['situation-2'],
  //       {
  //         benefits: ['UA', 'ESL-NJ', 'FLI-NJ', 'EPSL-FED'],
  //         'job-protections': ['FMLA-FED', 'FLA-NJ'],
  //       },
  //     ],
  //   }
  //   for (const [id, v] of Object.entries(testValues)) {
  //     const [value, additionalValues] = v
  //     const vv = values[id]
  //     if (vv === value || (Array.isArray(value) && Array.isArray(vv) && value.length === vv.length)) {
  //       continue
  //     }

  //     for (const [i, page] of form.pages.entries()) {
  //       for (const question of getFlattenedQuestions(page.questions, values)) {
  //         if (question.id === id) {
  //           if (i !== pageIndex) {
  //             setPageIndex(i)
  //             // 1337 hacks
  //             return
  //           }

  //           setValue(question, value, additionalValues)
  //           // 1337 hacks
  //           return
  //         }
  //       }
  //     }
  //   }

  //   // now that we've prefilled the values, stop overwriting them with the initial values.
  //   setPrefilled(true)
  // })

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
