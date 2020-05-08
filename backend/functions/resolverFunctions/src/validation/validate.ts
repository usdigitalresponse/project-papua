import fs from 'fs'
import yaml from 'js-yaml'
import { Page, Form, Values, Copy, Question } from '../client/lib/types'
import { transformInlineDefinitions } from '../client/lib/inline'
import { isQuestionValid } from '../client/lib/validation'

// Maps from [question ID] -> list of errors
export type ValidationResponse = Record<string, Copy[]>

export function validateAnswers(answers: Values): ValidationResponse {
  return isFormValid(answers, getForm())
}

export function getForm(): Form {
  const form = fs.readFileSync(__dirname + '/form.yml', { encoding: 'utf-8' })
  const sampleForm = fs.readFileSync(__dirname + '/form.sample.yml', { encoding: 'utf-8' })

  const contents = yaml.safeLoad(form)
  const sampleContents = yaml.safeLoad(sampleForm)

  const useSample = contents === null
  const rawForm = useSample ? sampleContents : contents

  return transformInlineDefinitions(rawForm)
}

// Parse the form data, creating a hashmap of question objects by questionId.
export function isFormValid(values: Values, form: Form): ValidationResponse {
  let errors: ValidationResponse = {}

  const { pages } = form as Form
  for (const page of pages) {
    errors = {
      ...errors,
      ...isPageValid(page, values, form),
    }
  }
  return errors
}

// A form is made up of multiple pages containing multiple primary and secondary questions.
// Our form will 'switch' between a subset of questions depending on answers to prior questions.
// Most switch 'options' are 'true'/'false', but there is no restriction on the number or type of options.
// Each switch can contain two or more options, and each option can contain one or more additional questions.
// We'll traverse the form to build a validation schema containing all questions.
function isPageValid(page: Page, values: Values, form: Form): ValidationResponse {
  let errors: ValidationResponse = {}
  for (const question of page.questions) {
    if (question.switch && question.switch[values[question.id] as any]) {
      // NOTE: we inline definitions in transformInlineDefinitions above, so it'll always be Question[].
      const subQuestions = question.switch[values[question.id] as any] as Question[]
      for (const subquestion of subQuestions) {
        // Check the validity of this subquestion:
        const e = isQuestionValid(subquestion, values[subquestion.id], values, form).errors
        if (e.length > 0) {
          errors = {
            ...errors,
            [subquestion.id]: [...(errors[subquestion.id] || []), ...e],
          }
        }
      }
    }

    // Check the validity of this question:
    const e = isQuestionValid(question, values[question.id], values, form).errors
    if (e.length > 0) {
      errors = {
        ...errors,
        [question.id]: [...(errors[question.id] || []), ...e],
      }
    }
  }

  return errors
}
