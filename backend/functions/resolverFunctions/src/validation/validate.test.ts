import { expect } from 'chai'
import { validateAnswers } from './validate'

import validUserInput from './fixtures/valid.json'
import invalidUserInput from './fixtures/invalid.json'

describe('validate', () => {
  it('input should be valid', () => {
    const result = validateAnswers(validUserInput.questions)
    expect(result)
  })

  it('input should be invalid', () => {
    const result = validateAnswers(invalidUserInput.questions)
    expect(result.error).to.exist
  })
})
