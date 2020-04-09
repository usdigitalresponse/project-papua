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
}

interface Option {
  name: string
  id: string
}

export type QuestionType = 'text' | 'datepicker' | 'email' | 'select' | 'ssn' | 'address_picker' | 'phone' | 'boolean' | string

type QuestionValidation = boolean | 're-enter'