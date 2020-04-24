import Joi from '@hapi/joi'

// NOTE: make sure to keep this Joi schema aligned
// with any changes to the TS Form type below.
const CopySchema = Joi.object({
  en: Joi.string(),
  es: Joi.string(),
  zh: Joi.string(),
})
let QuestionSchema = Joi.object()
QuestionSchema = Joi.object({
  name: CopySchema,
  instructions: CopySchema.optional(),
  required: Joi.boolean().optional(),
  type: Joi.string(),
  // TODO: fix validation, it's not currently
  // used in the UI.
  validate: Joi.any().optional(),
  id: Joi.string(),
  options: Joi.array()
    .items(
      Joi.object({
        name: CopySchema,
        id: Joi.string(),
        value: Joi.string().optional(),
      })
    )
    .optional(),
  switch: Joi.object()
    .pattern(Joi.string(), [null, Joi.array().items(QuestionSchema)])
    .optional(),
})

const AnswerSchema = Joi.object()

export const FormSchema = Joi.object({
  title: CopySchema,
  description: CopySchema,
  seal: Joi.string(),
  variables: Joi.object().pattern(Joi.string(), Joi.string()),
  instructions: Joi.object().pattern(Joi.string(), CopySchema),
  pages: Joi.array().items(
    Joi.object({
      title: CopySchema,
      heading: CopySchema,
      instructions: CopySchema.optional(),
      questions: Joi.array().items(QuestionSchema),
    })
  ),
})

export interface Form {
  title: Copy
  description: Copy
  variables: Record<string, string>
  instructions: Record<string, Copy>
  pages: Page[]
  seal: string
}

export interface Page {
  title: Copy
  heading: Copy
  // TODO: we don't render this currently
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

export interface Questions {
  [key: string]: Question
}

export interface Option {
  name: Copy
  id: string
  value?: string
}
interface Switch {
  [option: string]: Question[] | null | undefined
}

export interface Copy {
  [languageCode: string]: string
}

export type QuestionType =
  | 'shorttext'
  | 'datepicker'
  | 'dropdown'
  | 'singleselect'
  | 'address'
  | 'boolean'
  | 'phone'
  | 'ssn'
  | 'integer'
  | 'dollar-amount'
  | 'longtext'
  | 'multiselect'
  | 'email'
  | 'state-picker'
  | 'instructions-only'
  | 'decimal'
  | string

export interface QuestionValidation {
  type: string
  value: string
  error: Copy
}

export interface ErrorMessage {
  message: string
}

export type Value = string | string[] | Date

export interface Values {
  [key: string]: Value
}

export interface AnswerSchema {
  [key: string]: Joi.AnySchema
}

export interface Payload {
  metadata: object
  questions: {
    [key: string]: string
  }
}
