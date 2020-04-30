import { Question, Copy, Form, Values, Value } from './types'
import validator from 'email-validator'
import Joi from '@hapi/joi'
import moment from 'moment'
import { states } from './states'

function getInstructions(form: Form, id: string): Copy {
  const c = form.instructions[id]
  if (!c) {
    throw new Error(`Unknown instructions id: ${id}`)
  }
  return c
}

export function isQuestionValid(
  question: Question,
  value: Value,
  values: Values,
  form: Form
): { errors: Copy[]; dependencies: string[] } {
  const errors: Copy[] = []

  // Handle required-field checks.
  if (value === undefined) {
    if (question.required) {
      errors.push(getInstructions(form, 'field-is-required'))
    } else {
      // If the question is not required and not set,
      // go ahead and exit early so we don't surface unnecessary errors.
      return { errors: [], dependencies: [] }
    }
  }

  function validate<T>(schema: Joi.Schema, value: any, copyID: string): value is T {
    const { error } = schema.strict().validate(value)
    if (error) {
      errors.push(getInstructions(form, copyID!))
      if (process.env.NODE_ENV === 'development') {
        console.error(error)
      }
    }
    return !error
  }

  // Handle type-specified validation, which is generic
  // to the question itself.
  switch (question.type) {
    case 'email':
      if (validate<string>(Joi.string(), value, 'invalid-email')) {
        if (!validator.validate(value)) {
          errors.push(getInstructions(form, 'invalid-email'))
        }
      }
      break
    case 'decimal':
      validate(Joi.number().precision(2).min(0).max(2147483647), value, 'invalid-decimal')
      break
    case 'integer':
      validate(Joi.number().precision(0).min(0).max(2147483647), value, 'invalid-integer')
      break
    case 'dollar-amount':
      validate(Joi.number().precision(2).min(0).max(2147483647), value, 'invalid-dollar')
      break
    case 'shorttext':
    case 'longtext':
      validate(
        Joi.string()
          .allow(...(question.required ? [] : ['']))
          .max(question.type === 'shorttext' ? 200 : 10000),
        value,
        'invalid-text'
      )
      break
    case 'date':
      // We should be able to replicate this with joi-date, but I didn't have much
      // luck with that. Kept hitting undocumented issues with the format function.
      validate(
        Joi.string().custom((v: string, helpers) => {
          const strict = true
          return moment(v, 'YYYY-MM-DDTHH:mm:ssZ', strict).isValid() ? v : helpers.error('any.invalid')
        }),
        value,
        'invalid-date'
      )
      break
    case 'dropdown':
    case 'single-select':
    case 'state-picker':
      if (validate<string>(Joi.string(), value, 'invalid-select')) {
        const options = question.type === 'state-picker' ? states : question.options
        // Check if we selected a pre-defined option id:
        if (!options?.find((o) => o.id === value)) {
          errors.push(getInstructions(form, 'invalid-select'))
        }
      }
      break
    case 'multiselect':
      if (validate<string[]>(Joi.array().items(Joi.string()), value, 'invalid-select')) {
        const invalid = value.some((v) => {
          return !question.options?.find((o) => o.id === v)
        })
        if (invalid) {
          errors.push(getInstructions(form, 'invalid-select'))
        }
      }
      break
    case 'boolean':
      validate(Joi.boolean(), value, 'invalid-boolean')
      break
    case 'phone':
      validate(Joi.number().precision(0).min(1000000000).max(9999999999), value, 'invalid-phone')
      break
    case 'ssn':
      validate(Joi.number().precision(0).min(100000000).max(999999999), value, 'invalid-ssn')
      break
    case 'arn':
      validate(Joi.string().regex(/^A[0-9]{7,9}$/), value, 'invalid-arn')
      break
    case 'address':
      // TODO: we should do more validation than this for address, but this depends on the new
      // UI for entering addresses.
      validate(Joi.string(), value, 'invalid-address')
      break
    case 'instructions-only':
      // There should not be an answer for this question.
      errors.push(getInstructions(form, 'invalid-instructions-only'))
      break
    case 'file':
      validate(
        Joi.array()
          .min(question.required ? 1 : 0)
          .max(10)
          .items(
            Joi.object({
              name: Joi.string().optional(),
              type: Joi.string().valid('image/png', 'image/jpeg', 'image/jpg', 'application/pdf'),
              size: Joi.number().min(0),
              contents: Joi.string().min(1),
            })
          ),
        value,
        'invalid-file'
      )
      break
    case 'checkbox':
      if (value !== true) {
        errors.push(getInstructions(form, 'invalid-checkbox'))
      }
  }

  // Handle question-specific validation, as specified in the form.
  const dependencies: string[] = []
  question.validate?.forEach((validation) => {
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
