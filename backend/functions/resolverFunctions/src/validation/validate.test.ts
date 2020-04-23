import { validateAnswers } from './validate'

import validUserInput from './fixtures/valid.json'
import invalidUserInput from './fixtures/invalid.json'

test('input should be valid', () => {
  const v = validateAnswers(validUserInput.questions)
  expect(v.error).toBeUndefined()
})

test('input should be invalid', () => {
  const v = validateAnswers(invalidUserInput.questions)
  expect(v.error).toBeDefined()
})
