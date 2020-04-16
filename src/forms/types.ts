export interface Form {
  instructions: Record<string, Copy>
  state: string
  pages: Page[]
  seal: string
}

export interface Page {
  title: Copy
  heading: Copy
  questions: Question[]
}

export interface Question {
  name: Copy
  instructions?: Copy
  required?: boolean
  type: QuestionType
  validation?: QuestionValidation
  id?: string
  options?: Option[]
  switch?: Switch
}

export interface Option {
  name: Copy
  id: string
  value?: string
}
interface Switch {
  [option: string]: Question[] | null
}

export interface Copy {
  [languageCode: string]: string
}

export type QuestionType = 'shorttext' | 'datepicker' | 'dropdown' | 'singleselect' | 'address_picker' | 'boolean' | 'phone' | 'ssn' | 'address' | 'integer' | 'dollar-amount' | 'longtext' | 'multiselect' | 'email' | string

type QuestionValidation = boolean | 're-enter'
