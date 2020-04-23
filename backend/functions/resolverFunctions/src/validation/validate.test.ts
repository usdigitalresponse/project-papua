import { validateAnswers, initializeValidationSchema } from './validate'

import validUserInput from './fixtures/valid.json'
import invalidUserInput from './fixtures/invalid.json'
import sampleFormFixture from './fixtures/form.sample.fixture.json'

describe('input validation', () => {
  test('input should be valid', () => {
    const error = validateAnswers(validUserInput.questions)
    expect(error).toBeUndefined()
  })

  test('input should be invalid', () => {
    const error = validateAnswers(invalidUserInput.questions)
    expect(error).toBeDefined()
  })
})

describe('schema creation', () => {
  test('schema should fail to init unknown types', () => {
    sampleFormFixture.pages[0].questions[0].type = 'fake'
    expect(() => {
      initializeValidationSchema(sampleFormFixture)
    }).toThrow()
  })
})
