import { validateAnswers, getForm } from './validate'
import validUserInput from './fixtures/valid.json'
import invalidUserInput from './fixtures/invalid.json'
process.env.FILE = 'validation/fixtures/form.sample.fixture.yml'

describe('input validation', () => {
  test('input should be valid', () => {
    const errors = validateAnswers(validUserInput.questions)
    expect(errors.length).toBe(0)
  })

  test('input should be invalid', () => {
    const errors = validateAnswers(invalidUserInput.questions)
    expect(errors.length).toBeGreaterThan(0)
  })
})

describe('schema creation', () => {
  test('should convert form from yml to json', () => {
    expect(() => {
      getForm()
    }).not.toThrow()
  })
})
