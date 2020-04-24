import { validateAnswers, initializeValidationSchema, getForm } from './validate'
import validUserInput from './fixtures/valid.json'
import invalidUserInput from './fixtures/invalid.json'
process.env.FILE = 'validation/fixtures/form.sample.fixture.yml'

describe('input validation', () => {
  test('input should be valid', () => {
    const result = validateAnswers(validUserInput.questions)
    expect(result).toHaveProperty('value.covid-19-reason')
  })

  test('input should be invalid', () => {
    const result = validateAnswers(invalidUserInput.questions)
    expect(result).toHaveProperty('error')
  })
})

describe('schema creation', () => {
  const form = getForm()

  test('should convert form from yml to json', () => {
    expect(() => {
      getForm()
    }).not.toThrow()
  })

  test('schema should fail to init unknown types', () => {
    form.pages[0].questions[0].type = 'fake'
    expect(() => {
      initializeValidationSchema(form)
    }).toThrow()
  })

  test('YML schema should fail to init unknown types', () => {
    form.pages[0].questions[0].type = 'fake'
    expect(() => {
      initializeValidationSchema(form)
    }).toThrow()
  })
})
