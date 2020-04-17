import form from '../form.json'
import { FormSchema, Form, Question, QuestionType, Copy, Page, ErrorMessage } from './types';
import DatePicker from '../components/form-components/DatePicker'
import TextInput from '../components/form-components/TextInput'
import Select from '../components/form-components/Select'
import SingleSelect from '../components/form-components/SingleSelect'
import Boolean from '../components/form-components/Boolean'
import Multiselect from '../components/form-components/Multiselect'
import PhoneNumber from '../components/form-components/PhoneNumber'
import TextArea from '../components/form-components/TextArea'
import StateSelect from '../components/form-components/StateSelect'
import { Box } from 'grommet'
import { Values, Errors } from '../contexts/form';


export function initializeForm(): Form {
  const rawForm = form

  // Validate the schema against our Joi schema
  // which makes it easier to identify issues in the form
  // than standard TS type validation (which just prints the error
  // without metadata like array index or object path).
  if (process.env.NODE_ENV === "development") {
    const result = FormSchema.validate(rawForm, {
      abortEarly: false,
      allowUnknown: false,
      presence: "required",
    });
    if (result.error) {
      console.error(
        "form.json does not match the expected schema",
        result.error
      );
    }
  }

  return rawForm as Form;
}

export const getCopy = (id: string) => {
  return initializeForm().instructions[id]
}

export function translate(copy: Copy, language: string): string {
  let text = copy[language]

  // Apply templating variables by looking for `{{VARIABLE_NAME}}` fields:
  text = text.replace(/\{\{([A-Z_]+)\}\}/g, (m, key) => {
    // `key` is the regex-captured value inside the curly braces:
    const value = initializeForm().variables[key]
    // If we don't recognize this variable, then default to rendering
    // all of `{{VARIABLE_NAME}}` since that'll make the issue clearest.
    return value ? value : m
  })

  return text
}

export function isValid(question: Question, values: Values, language: string): ErrorMessage[] {
  const { validate } = question
  const errors: ErrorMessage[] = []

  const value = values[question.id]

  validate?.forEach(validation => {
    const { type, value: validationValue, error } = validation
    if (type === 'regex') {
      const regex = new RegExp(validationValue)
      const isValid = typeof value === 'string' && regex.test(value)

      if (!isValid) {
        errors.push({ message: translate(error, language) })
      }
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
  const questionIds = questions.map(q => q.id)
  const requiredQuestions = questions.filter(q => q.required).map(q => q.id)
  return requiredQuestions.every(id => values[id]) && !questionIds.some(id => errors[id])
}

/**
 * Given a set of questions, generates a flattened list of 'relevant' questions, including subquestions from switches.
 * @param questions 
 * @param values 
 */
export function getFlattenedQuestions(questions: Question[], values: Values): Question[] {
  let flattenedQuestions: Question[] = []

  questions.forEach(question => {
    flattenedQuestions.push(question)
    const { id } = question

    const value = values[id] as string
    const hasSubQuestions = value && question.switch && typeof value === 'string' && question.switch[value]

    if (hasSubQuestions) {
      const subQuestions = question.switch![value]
      flattenedQuestions = subQuestions ? flattenedQuestions.concat(getFlattenedQuestions(subQuestions, values)) : flattenedQuestions
    }
  })

  return flattenedQuestions
}

const typeComponentMappings: { [type: string]: React.FC } = {
  'shorttext': TextInput as React.FC,
  'datepicker': DatePicker as React.FC,
  'dropdown': Select as React.FC,
  'singleselect': SingleSelect as React.FC,
  'boolean': Boolean as React.FC,
  'multiselect': Multiselect as React.FC,
  'email': TextInput as React.FC,
  'phone': PhoneNumber as React.FC,
  'longtext': TextArea as React.FC,
  'instructions-only': Box,
  'state-picker': StateSelect as React.FC
}

//   'address_picker' | 'phone' | 'ssn' | 'address' | 'integer' | 'dollar-amount'

export function getComponent(type: QuestionType): React.FC {
  return typeComponentMappings[type] || TextInput
}
