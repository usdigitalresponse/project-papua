import { expect } from 'chai'
import { validateAnswers } from './validate'

import validUserInput from './fixtures/valid.json'
import invalidUserInput from './fixtures/invalid.json'

describe('validate', () => {
  it('input is valid', () => {
    const result = validateAnswers(validUserInput.questions)
    expect(result)
  })

  it('input is invalid', () => {
    const result = validateAnswers(invalidUserInput.questions)
    expect(result)
  })
})
