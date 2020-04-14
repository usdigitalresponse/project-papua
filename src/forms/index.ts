import validator from 'validator'
import form from '../form.json'
import { Form, Question, QuestionType } from './types'
import DatePicker from '../components/form-components/DatePicker'
import TextInput from '../components/form-components/TextInput'
import Select from '../components/form-components/Select'
import SingleSelect from '../components/form-components/SingleSelect'
import Boolean from '../components/form-components/Boolean'
import Multiselect from '../components/form-components/Multiselect'
import PhoneNumber from '../components/form-components/PhoneNumber'
import TextArea from '../components/form-components/TextArea'


export function initializeForm(): Form {
  const baseForm: Form = form
  return baseForm
}

export function isValid(question: Question, answer: string | undefined, secondAnswer?: string): { valid: boolean, reason?: string } {
  if (question.required && !answer) {
    return { valid: false, reason: `"${question.name}" is a required field.` }
  }

  if (question.validation === 're-enter' && answer !== secondAnswer) {
    return { valid: false, reason: `The two values for "${question.name}" must match.` }
  }

  if (question.validation && question.type === 'email' && (!answer || !validator.isEmail(answer))) {
    return { valid: false, reason: `Please enter a valid email.` }
  }

  return { valid: true }
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
  'longtext': TextArea as React.FC
}

//   'address_picker' | 'phone' | 'ssn' | 'address' | 'integer' | 'dollar-amount'

export function getComponent(type: QuestionType): React.FC {
  return typeComponentMappings[type] || TextInput
}