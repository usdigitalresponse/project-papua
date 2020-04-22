import { Page, Question, Form, AnswerSchema, Values } from './types'
import Joi from '@hapi/joi'
import formSample from '../form.sample.json'
import form from '../form.json'

const questionSchema = initializeQuestions()
const fullSchema = Joi.object().keys(questionSchema)

export function validateAnswers(answers: Values) {
  const validate = fullSchema.validate(answers)
  console.log(validate.error)
}

// Parse the form data, creating a hashmap of question objects by questionId.
function initializeQuestions() {
  const rawForm = Object.keys(form).length === 0 ? formSample : (form as Form)
  const schemas = []

  // Form data is organized by "pages" which is not useful here.
  const { pages } = rawForm as Form
  for (const p in pages) {
    const { questions } = pages[p] as Page
    schemas.push(buildSchema(questions))
  }
  return (Object as any).assign(...schemas)
}

// build validation dynamically
function buildSchema(questions: Question[]): AnswerSchema {
  const answerSchema = {} as AnswerSchema

  for (const question of questions) {
    // Questions can be conditional. Most 'options' are 'true'/'false', but there is no restriction on the number or type of options.
    for (const option in question.switch) {
      const moreQuestions = question.switch[option] as Question[]
      for (const conditionalQuestion of moreQuestions) {
        answerSchema[question.id] = generateValidation(conditionalQuestion)
      }
    }
    answerSchema[question.id] = generateValidation(question)
  }
  return answerSchema
}

// We provide a set list of predictable types that can be used on form fields
function generateValidation(question: Question) {
  let validation = ''
  let pattern, length
  const { validate, type } = question

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
      validation = 'Joi.string()'
      break
    case 'boolean':
      validation = 'Joi.boolean()'
      break
    case 'datepicker':
      validation = 'Joi.date()'
      break
    case 'decimal':
      validation = 'Joi.number()'
      break
    case 'dollar-amount':
      validation = 'Joi.string()'
      break
    case 'email':
      validation = 'Joi.string().email()'
      break
    case 'integer':
      validation = 'Joi.number()'
      break
    case 'longtext':
      validation = `Joi.string()`
      break
    case 'phone':
      validation = 'Joi.string()'
      break
    case 'shorttext':
      validation = `Joi.string()`
      break
    case 'ssn':
      validation = `Joi.string().length(9)`
      break
    case 'state-picker':
    case 'instructions-only':
      // todo: determine type
      validation = 'Joi.string()'
      break
    // these types represent form actions, types are nested as parameters
    case 'dropdown':
    case 'multiselect':
    case 'singleselect':
      validation = 'Joi.any()'
      break
    default:
      console.log(`unknown type: ${question.type}`)
      return 'unknown'
  }

  if (pattern) validation += `.pattern(/${pattern}/)`
  if (length) validation += `.length(${length})`

  return eval(validation)
}
