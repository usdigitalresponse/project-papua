import fs from 'fs'
import yaml from 'js-yaml'
import { Page, Form, Values, Copy } from '../client/lib/types'
import { isQuestionValid } from '../client/lib/validation'

export function validateAnswers(answers: Values): Copy[] {
  return isFormValid(answers, getForm())
}

export function getForm(): Form {
  const form = fs.readFileSync(__dirname + '/form.yml', { encoding: 'utf-8' })
  const sampleForm = fs.readFileSync(__dirname + '/form.sample.yml', { encoding: 'utf-8' })

  const contents = yaml.safeLoad(form)
  const sampleContents = yaml.safeLoad(sampleForm)

  const useSample = contents === null
  const rawForm = useSample ? sampleContents : contents

  return rawForm
}

// Parse the form data, creating a hashmap of question objects by questionId.
export function isFormValid(values: Values, form: Form): Copy[] {
  const errors: Copy[] = []

  const { pages } = form as Form
  for (const page of pages) {
    errors.push(...isPageValid(page, values, form))
  }
  return errors
}

// A form is made up of multiple pages containing multiple primary and secondary questions.
// Our form will 'switch' between a subset of questions depending on answers to prior questions.
// Most switch 'options' are 'true'/'false', but there is no restriction on the number or type of options.
// Each switch can contain two or more options, and each option can contain one or more additional questions.
// We'll traverse the form to build a validation schema containing all questions.
function isPageValid(page: Page, values: Values, form: Form): Copy[] {
  const errors: Copy[] = []
  for (const question of page.questions) {
    if (question.switch) {
      for (const [, subQuestions] of Object.entries(question.switch)) {
        for (const subquestion of subQuestions) {
          errors.push(...isQuestionValid(subquestion, values[subquestion.id], values, form).errors)
        }
      }
    }
    errors.push(...isQuestionValid(question, values[question.id], values, form).errors)
  }

  return errors
}
