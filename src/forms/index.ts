import validator from 'validator'

import form from '../form.json'
import { Form, Question } from './types'

export function initializeForm(): Form {
  const baseForm: Form = form
  return baseForm
}

export function isValid(question: Question, answer: string | undefined, secondAnswer?: string): { valid: boolean, reason?: string } {
  if (question.required && !answer) {
    return { valid: false, reason: `"${question.name}" is a required field.` }
  }

  if (question.validation === 're-enter' && answer !== secondAnswer) {
    return { valid: false, reason: `The two values for "${question.name}" must match.` }
  }

  if (question.validation && question.type === 'email' && (!answer || !validator.isEmail(answer))) {
    return { valid: false, reason: `Please enter a valid email.` }
  }

  return { valid: true }
}
