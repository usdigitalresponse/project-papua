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

interface FormState {
  form: Form
  setValue: (question: Question, value: Value, additionalValues?: Record<string, Value>) => void
  setError: (id: string, value: Copy[]) => void
  values: Values
  errors: Errors
  translateCopy: (copy: Copy, variables?: Record<string, string>) => string
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
    (copy: Copy, variables?: Record<string, string>) => {
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
  )

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
  //   const testValues: Record<string, Value> = {
  //     /* eslint-disable @typescript-eslint/camelcase */
  //     agreement: true,
  //     first_name: 'Colin',
  //     last_name: 'King',
  //     dob: '2001-01-02T00:00:00+00:00',
  //     gender: 'male',
  //     race: 'white',
  //     ethnicity: 'hispanic',
  //     home_address: '123 Home St.',
  //     telephone: 1234567890,
  //     preferred_language: 'en',
  //     mailing_home_address_same: true,
  //     ssn: 123456789,
  //     ssn_confirm: 123456789,
  //     has_dl_or_state_id: false,
  //     is_us_citizen: true,
  //     'military-veteran': true,
  //     'active-duty-start': '2020-05-06T00:00:00+00:00',
  //     'active-duty-end': '2020-05-22T00:00:00+00:00',
  //     'military-disability': 'disability-more-than-30',
  //     'military-active-last-two-years': true,
  //     'military-last-pay-grade': '12345',
  //     'military-accured-paid-leave': 12345,
  //     'military-reason-for-separation': '123',
  //     'military-branch': 'army',
  //     'military-work-end': '2020-04-29T00:00:00+00:00',
  //     'military-character-of-service': 'Test',
  //     'military-net-service': '123',
  //     'last-week-paid': 12345,
  //     'employment-current-status': true,
  //     'last-week-hours': 1234,
  //     'employment-able-to-work': true,
  //     'employment-option-to-telework': true,
  //     'employment-available-to-work': true,
  //     'employment-last-12-months': true,
  //     'employment-employers-in-last-18-months': '5-or-more',
  //     'employment-federal-employee': true,
  //     'employment-federal-employee-last-date': '2020-05-27T00:00:00+00:00',
  //     'employment-in-trade-union': true,
  //     'employment-trade-union': '1033',
  //     'employer-name': 'Another One',
  //     'employer-address': '123456 Test',
  //     'employer-phone-number': 1234567890,
  //     'employer-id-number': 1234567890,
  //     'employer-job-title': 'Testing Engineer',
  //     'employer-first-day-of-work': '2020-05-19T00:00:00+00:00',
  //     'employer-last-day-of-work': '2020-04-29T00:00:00+00:00',
  //     'employer-type': 'fulltime',
  //     'employer-pay-rate': 12345678,
  //     'employer-pay-unit': 'per-hour',
  //     'employer-reason-for-separation': true,
  //     'covid-19-reason': 'household_diagnosed',
  //     'employer-current-benefits': true,
  //     'employer-current-teleworking': true,
  //     'tax-info-have-tax-return': true,
  //     'tax-info-married': 'married-jointly',
  //     'tax-info-agi': 12345678,
  //     'tax-info-dependents': '2',
  //     'unemployment-in-another-state': true,
  //     'unemployment-in-another-state-state': 'ak',
  //     'unemployment-in-another-state-date': '2020-05-20T00:00:00+00:00',
  //     'unemployment-in-another-state-employment-since': true,
  //     'other-income-public-assistance': true,
  //     'other-income-dhs-work': false,
  //     'other-income-snap': false,
  //     'other-income-temp-disability-insurance': false,
  //     'other-income-workers-comp': false,
  //     'other-income-disability-payments': false,
  //     'other-income-retirement-pension': true,
  //     'other-income-retirement annuity': true,
  //     'other-income-social-security': false,
  //     'payment-income-withheld': 'state-and-fed',
  //     'payment-option': 'direct-deposit',
  //     'payment-bank-name': 'Yees',
  //     'payment-account-type': 'savings',
  //     'payment-account-number': 1234567890,
  //     'payment-account-number-confirm': 1234567890,
  //     'payment-routing-number': 23456789,
  //     'payment-routing-number-confirm': 23456789,
  //   }
  //   for (const [id, v] of Object.entries(testValues)) {
  //     if (values[id] === v) {
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

  //           setValue(question, v)
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
