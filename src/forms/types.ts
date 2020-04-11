export interface Form {
  state: string
  pages: Page[]
  seal: string
}

export interface Page {
  title: string
  heading: string
  questions: Question[]
}

export interface Question {
  name: string
  instructions?: string
  required?: boolean
  type: QuestionType
  validation?: QuestionValidation
  id?: string
  options?: Option[]
  switch?: Switch
}

interface Option {
  name: string
  id: string
}
interface Switch {
  [option: string]: Question[] | null
}

export type QuestionType = 'shorttext' | 'datepicker' | 'dropdown' | 'singleselect' | 'address_picker' | 'boolean' | 'phone' | 'ssn' | 'address' | 'integer' | 'dollar-amount' | 'longtext' | 'multiselect' | 'email' | string

type QuestionValidation = boolean | 're-enter'
