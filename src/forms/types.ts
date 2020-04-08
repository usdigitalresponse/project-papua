export interface Form {
  pages: Page[]
}

interface Page {
  questions: Question[]
}

export interface Question {
  name: string
  description?: string
  required?: boolean
  type?: QuestionType
  validation?: QuestionValidation
}

type QuestionType = 'text' | 'date' | 'email'

type QuestionValidation = boolean | 're-enter'