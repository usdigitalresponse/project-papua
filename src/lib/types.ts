// Make sure to keep the TS types below up-to-date with the Form JSON Schema
// that we use for form validation and IDE intellisense.
//
// The Form's JSON Schema is stored in `public/form.schema.json`
export interface Form {
  title: Copy
  description: Copy
  variables?: Record<string, string>
  instructions: Record<string, Copy>
  pages: Page[]
  seal: string
}

export interface Page {
  title: Copy
  heading: Copy
  instructions?: Copy
  questions: Question[]
}

export interface Question {
  name: Copy
  instructions?: Copy
  required?: boolean
  type: QuestionType
  validate?: QuestionValidation[]
  id: string
  options?: Option[]
  switch?: Switch
}

export interface Option {
  name: Copy
  id: string
  value?: string
}
interface Switch {
  [option: string]: Question[] | undefined
}

export interface Copy {
  [languageCode: string]: string
}

export type QuestionType =
  | 'shorttext'
  | 'date'
  | 'dropdown'
  | 'single-select'
  | 'boolean'
  | 'phone'
  | 'ssn'
  | 'arn'
  | 'address'
  | 'integer'
  | 'decimal'
  | 'dollar-amount'
  | 'longtext'
  | 'multiselect'
  | 'state-picker'
  | 'instructions-only'
  | 'email'

export interface QuestionValidation {
  type: 'matches_field' | 'regex' | 'min' | 'max'
  value: string
  error: Copy
}

export interface ErrorMessage {
  message: string
}

export interface Values {
  [key: string]: Value
}

export interface Errors {
  [key: string]: Copy[]
}

export type Value = string | string[] | Date | number | boolean | undefined
