import fs from 'fs'
import yaml from 'js-yaml'
import Joi, { AnySchema, Err, SchemaMap } from '@hapi/joi'
import { Page, Question, Form, AnswerSchema, Values } from './types'
import path from 'path'

export function validateAnswers(answers: Values): Error {
  const rawForm = getForm()
  let schema = {} as Joi.ObjectSchema

  try {
    schema = initializeValidationSchema(rawForm)
  } catch (e) {
    console.error(e)
  }

  if (!schema) return new Error('there was a problem initializing the validation schema')
  return schema.validate(answers).error as Error
}

// Parse the form data, creating a hashmap of question objects by questionId.
export function initializeValidationSchema(form?: Form): Joi.ObjectSchema {
  const schemas = []

  const { pages } = form as Form
  for (const p in pages) {
    const { questions } = pages[p] as Page
    schemas.push(buildSchema(questions))
  }
  return Joi.object().keys((Object as any).assign(...schemas))
}

export function getForm(): Form {
  let form = {} as Form
  let file = ''
  const filename = process.env.FILE || 'form.yml'

  try {
    file = fs.readFileSync(path.resolve(__dirname, `../${filename}`), {
      encoding: 'utf-8',
    })
  } catch (e) {
    console.error('error reading file: ', e)
  }

  try {
    form = yaml.safeLoad(file)
  } catch (e) {
    console.error(e)
  }
  return form
}

// A form is made up of multiple pages containing multiple primary and secondary questions.
// Our form will 'switch' between a subset of questions depending on answers to prior questions.
// Most switch 'options' are 'true'/'false', but there is no restriction on the number or type of options.
// Each switch can contain two or more options, and each option can contain one or more additional questions.
// We'll traverse the form to build a validation schema containing all questions.
function buildSchema(questions: Question[]): AnswerSchema {
  const answerSchema = {} as AnswerSchema
  for (const question of questions) {
    for (const option in question.switch) {
      const moreQuestions = question.switch[option] as Question[]
      for (const q in moreQuestions) {
        answerSchema[moreQuestions[q].id] = generateValidation(moreQuestions[q]) as AnySchema
      }
    }
    answerSchema[question.id] = generateValidation(question)
  }
  return answerSchema
}

// We provide a set list of predictable types that can be used on form fields. Each questionId has an associated type,
// as well as an optional validation block containing special handling like max-characters or regex patterns.
function generateValidation(question: Question): Joi.AnySchema {
  const { validate, type } = question
  let validation = Joi.any()
  let pattern, length

  // some questions will have an array of specific validations to apply
  if (validate) {
    for (const validation of validate) {
      if (validation.type === 'regex') pattern = validation.value
      if (validation.type === 'max-characters') length = validation.value
    }
  }

  switch (type) {
    // address and address_picker resolve to the same value
    case 'address':
    case 'address_picker':
      validation = Joi.string()
      break
    case 'boolean':
      validation = Joi.boolean()
      break
    case 'datepicker':
      validation = Joi.date()
      break
    case 'decimal':
      validation = Joi.number()
      break
    case 'dollar-amount':
      validation = Joi.string()
      break
    case 'email':
      validation = Joi.string().email()
      break
    case 'integer':
      validation = Joi.number()
      break
    case 'longtext':
      validation = Joi.string()
      break
    case 'phone':
      validation = Joi.string()
      break
    case 'shorttext':
      validation = Joi.string()
      break
    case 'ssn':
      validation = Joi.string().length(9)
      break
    case 'state-picker':
    case 'instructions-only':
      // todo: determine type
      validation = Joi.string()
      break
    // these types represent form actions, types are nested as parameters
    case 'dropdown':
    case 'multiselect':
    case 'singleselect':
      validation = Joi.any()
      break
    default:
      throw new Error(`unknown type: ${question.type}`)
  }

  if (pattern) validation = Joi.string().pattern(/`${pattern}`/)
  if (length) validation = Joi.string().length(Number(length))

  return validation
}
