import { Question, QuestionType, Copy, Page } from './types'
import DatePicker from '../components/form-components/DatePicker'
import TextInput from '../components/form-components/TextInput'
import Select from '../components/form-components/Select'
import SingleSelect from '../components/form-components/SingleSelect'
import Boolean from '../components/form-components/Boolean'
import Multiselect from '../components/form-components/Multiselect'
import TextArea from '../components/form-components/TextArea'
import StateSelect from '../components/form-components/StateSelect'
import { Number as NumberComponent } from '../components/form-components/Number'

import { Box } from 'grommet'
import validator from 'email-validator'
import { Values, Errors, Value } from '../contexts/form'
import { Form } from './types'
import Joi from '@hapi/joi'
import moment from 'moment'

export function isValid(
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
        const d = moment(value, moment.ISO_8601)
        if (validationValue.startsWith('id:')) {
          // Compare this date to the corresponding date based on the supplied id.
          const id = validationValue.slice(3)
          const other = values[id]
          if (other === undefined) {
            // If we haven't specified the other date yet, don't consider that an error.
            isValid = true
          } else {
            const od = moment(other, moment.ISO_8601)
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

/**
 * Determines if a user can proceed to the next form, if they have:
 * 1) Finished all required questions
 * 2) There are no validation errors
 * @param page
 * @param values
 * @param errors
 */
export function canContinue(page: Page, values: Values, errors: Errors): boolean {
  if (!page) {
    return true
  }

  const questions = getFlattenedQuestions(page.questions, values)
  const questionIds = questions.map((q) => q.id)
  const requiredQuestions = questions.filter((q) => q.required).map((q) => q.id)
  return requiredQuestions.every((id) => values[id]) && !questionIds.some((id) => errors[id])
}

/**
 * Given a set of questions, generates a flattened list of 'relevant' questions, including subquestions from switches.
 * @param questions
 * @param values
 */
export function getFlattenedQuestions(questions: Question[], values: Values): Question[] {
  let flattenedQuestions: Question[] = []

  questions.forEach((question) => {
    flattenedQuestions.push(question)
    const { id } = question

    const value = values[id] as string
    const hasSubQuestions = value && question.switch && typeof value === 'string' && question.switch[value]

    if (hasSubQuestions) {
      const subQuestions = question.switch![value]
      flattenedQuestions = subQuestions
        ? flattenedQuestions.concat(getFlattenedQuestions(subQuestions, values))
        : flattenedQuestions
    }
  })

  return flattenedQuestions
}

const typeComponentMappings: { [type: string]: React.FC } = {
  shorttext: TextInput as React.FC,
  date: DatePicker as React.FC,
  dropdown: Select as React.FC,
  singleselect: SingleSelect as React.FC,
  boolean: Boolean as React.FC,
  multiselect: Multiselect as React.FC,
  longtext: TextArea as React.FC,
  'instructions-only': Box,
  'state-picker': StateSelect as React.FC,
  decimal: NumberComponent as React.FC,
  integer: NumberComponent as React.FC,
  'dollar-amount': NumberComponent as React.FC,
}

export function getComponent(type: QuestionType): React.FC {
  return typeComponentMappings[type] || TextInput
}
