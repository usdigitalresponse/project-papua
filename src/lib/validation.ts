import { Question, Copy, Form } from '../forms/types'

import validator from 'email-validator'
import { Values, Value } from '../contexts/form'
import Joi from '@hapi/joi'
import moment from 'moment'

export function isQuestionValid(
  question: Question,
  value: Value,
  values: Values,
  form: Form
): { errors: Copy[]; dependencies: string[] } {
  const { validate } = question
  const errors: Copy[] = []

  // Handle required-field checks.
  if (!!question.required && value === undefined) {
    errors.push(form.instructions['field-is-required'])
  }

  // Handle type-specified validation, which is generic
  // to the question itself.
  let schema: Joi.Schema | undefined = undefined
  let copyID: string | undefined = undefined
  if (question.type === 'email') {
    if (!validator.validate(value as string)) {
      errors.push(form.instructions['invalid-email'])
    }
  } else if (question.type === 'decimal') {
    schema = Joi.number().precision(2).min(0).max(2147483647)
    copyID = 'invalid-decimal'
  } else if (question.type === 'integer') {
    schema = Joi.number().precision(0).min(0).max(2147483647)
    copyID = 'invalid-integer'
  } else if (question.type === 'dollar-amount') {
    schema = Joi.number().precision(2).min(0).max(2147483647)
    copyID = 'invalid-dollar'
  } else if (question.type === 'shorttext' || question.type === 'longtext') {
    if (value === '') {
      errors.push(form.instructions['field-is-required'])
    } else {
      schema = Joi.string()
        .min(1)
        .max(question.type === 'shorttext' ? 200 : 10000)
      copyID = 'invalid-text'
    }
  } else if (question.type === 'date') {
    schema = Joi.date().iso()
    copyID = 'invalid-date'
  } else if (['dropdown', 'singleselect'].includes(question.type)) {
    const option = question.options?.find((o) => o.id === value)
    if (!option) {
      errors.push(form.instructions['invalid-select'])
    }
  } else if (question.type === 'multiselect') {
    if (value) {
      const invalid = (value as string[]).some((v) => {
        return !question.options?.find((o) => o.id === v)
      })
      if (invalid) {
        errors.push(form.instructions['invalid-select'])
      }
    }
  } else if (question.type === 'boolean') {
    schema = Joi.boolean().strict()
    copyID = 'invalid-boolean'
  }
  if (schema && !!schema.validate(value).error) {
    errors.push(form.instructions[copyID!])
  }

  // Handle question-specific validation, as specified in the form.
  const dependencies: string[] = []
  validate?.forEach((validation) => {
    const { type, value: validationValue, error } = validation

    if (typeof validationValue === 'string' && validationValue.startsWith('id:')) {
      // If this validation depends on another question, then we'll need to
      // reevaluate the error state of that field. We track that with dependencies
      // and the caller of this function is responsible for handling that.
      dependencies.push(validationValue.slice(3))
    }

    let isValid
    if (type === 'regex') {
      const regex = new RegExp(validationValue as string)
      isValid = typeof value === 'string' && regex.test(value)
    } else if (type === 'matches_field') {
      const id = validationValue.slice(3)
      isValid = value === values[id]
    } else if (type === 'min' || type === 'max') {
      if (question.type === 'date') {
        const d = moment(value as string, moment.ISO_8601)
        if (validationValue.startsWith('id:')) {
          // Compare this date to the corresponding date based on the supplied id.
          const id = validationValue.slice(3)
          const other = values[id]
          if (other === undefined) {
            // If we haven't specified the other date yet, don't consider that an error.
            isValid = true
          } else {
            const od = moment(other as string, moment.ISO_8601)
            isValid = type === 'min' ? d.isSameOrAfter(od) : d.isSameOrBefore(od)
          }
        } else {
          // Compare this date to the relative date specified (f.e. "-14y").
          const unit = validationValue[validationValue.length - 1] as 'y' | 'd'
          const n = Number(validationValue.slice(0, validationValue.length - 1))
          const p = moment().add(n, unit)
          isValid = type === 'min' ? d >= p : d <= p
        }
      }
    }

    if (!isValid) {
      errors.push(error)
    }
  })

  return { errors, dependencies }
}
