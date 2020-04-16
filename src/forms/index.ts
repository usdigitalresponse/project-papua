import validator from 'validator'
import form from '../form.json'
import { FormSchema, Form, Question, QuestionType, Copy } from './types';
import DatePicker from '../components/form-components/DatePicker'
import TextInput from '../components/form-components/TextInput'
import Select from '../components/form-components/Select'
import SingleSelect from '../components/form-components/SingleSelect'
import Boolean from '../components/form-components/Boolean'
import Multiselect from '../components/form-components/Multiselect'
import PhoneNumber from '../components/form-components/PhoneNumber'
import TextArea from '../components/form-components/TextArea'


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

export function isValid(question: Question, answer: string | undefined, secondAnswer?: string): { valid: boolean, reason?: string } {
  // TODO: translate these validation warningss
  if (question.required && !answer) {
    return { valid: false, reason: `"${question.name.en}" is a required field.` }
  }

  if (question.validate === 're-enter' && answer !== secondAnswer) {
    return { valid: false, reason: `The two values for "${question.name.en}" must match.` }
  }

  if (question.validate && question.type === 'email' && (!answer || !validator.isEmail(answer))) {
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
