import { Question, QuestionType, Copy, Page } from './types'
import DatePicker from '../components/form-components/DatePicker'
import TextInput from '../components/form-components/TextInput'
import Select from '../components/form-components/Select'
import SingleSelect from '../components/form-components/SingleSelect'
import Boolean from '../components/form-components/Boolean'
import Multiselect from '../components/form-components/Multiselect'
import TextArea from '../components/form-components/TextArea'
import StateSelect from '../components/form-components/StateSelect'

import { Box } from 'grommet'
import validator from 'email-validator'
import { Values, Errors, Value } from '../contexts/form'
import { Form } from './types'

export function isValid(question: Question, value: Value, values: Values, form: Form): Copy[] {
  const { validate } = question
  const errors: Copy[] = []

  if (question.type === 'email') {
    if (!validator.validate(value as string)) {
      errors.push(form.instructions['invalid-email'])
    }
  }

  validate?.forEach((validation) => {
    const { type, value: validationValue, error } = validation
    let isValid
    if (type === 'regex') {
      const regex = new RegExp(validationValue)
      isValid = typeof value === 'string' && regex.test(value)
    }

    if (type === 'matches_field') {
      isValid = value === values[validationValue]
    }

    if (!isValid) {
      errors.push(error)
    }
  })

  return errors
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
  datepicker: DatePicker as React.FC,
  dropdown: Select as React.FC,
  singleselect: SingleSelect as React.FC,
  boolean: Boolean as React.FC,
  multiselect: Multiselect as React.FC,
  longtext: TextArea as React.FC,
  'instructions-only': Box,
  'state-picker': StateSelect as React.FC,
}

//   'address_picker' | 'phone' | 'ssn' | 'address' | 'integer' | 'dollar-amount'

export function getComponent(type: QuestionType): React.FC {
  return typeComponentMappings[type] || TextInput
}
