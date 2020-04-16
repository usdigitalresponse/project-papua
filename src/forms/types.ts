import Joi from "@hapi/joi";

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
  options: Joi.array().items(Joi.object({
    name: CopySchema,
    id: Joi.string(),
    value: Joi.string().optional()
  })).optional(),
  switch: Joi.object().pattern(Joi.string(), [null, Joi.array().items(QuestionSchema)]).optional()
})
export const FormSchema = Joi.object({
  variables: Joi.object().pattern(Joi.string(), Joi.string()),
  instructions: Joi.object().pattern(Joi.string(), CopySchema),
  pages: Joi.array().items(Joi.object({
    title: CopySchema,
    heading: CopySchema,
    instructions: CopySchema.optional(),
    questions: Joi.array().items(QuestionSchema)
  })),
  seal: Joi.string(),
})

export interface Form {
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
  validate?: QuestionValidation
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
  [option: string]: Question[] | null | undefined
}

export interface Copy {
  [languageCode: string]: string
}

export type QuestionType = 'shorttext' | 'datepicker' | 'dropdown' | 'singleselect' | 'address_picker' | 'boolean' | 'phone' | 'ssn' | 'address' | 'integer' | 'dollar-amount' | 'longtext' | 'multiselect' | 'email' | string

type QuestionValidation = boolean | 're-enter'
