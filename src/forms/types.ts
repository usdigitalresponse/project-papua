export interface Form {
  state: string
  pages: Page[]
}

export interface Page {
  title: string
  questions: Question[]
}

export interface Question {
  name: string
  instructions?: string
  required?: boolean
  type?: QuestionType
  validation?: QuestionValidation
  id?: string
  options?: Option[]
}

interface Option {
  name: string
  id: string
}

type QuestionType = 'text' | 'date_picker' | 'email' | 'select' | 'ssn' | 'address_picker' | 'phone' | 'boolean' | string

type QuestionValidation = boolean | 're-enter'