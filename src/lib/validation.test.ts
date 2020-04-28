import { isQuestionValid } from './validation'
import { Form, Copy, Question } from '../forms/types'
import { Value, Values } from '../contexts/form'
import { merge } from './merge'

function toForm(question: Question, instructions: Record<string, Copy>): Form {
  const predefinedErrors = [
    'field-is-required',
    'invalid-boolean',
    'invalid-email',
    'invalid-decimal',
    'invalid-select',
    'invalid-text',
    'invalid-integer',
    'invalid-dollar',
    'invalid-date',
  ]
  return {
    title: { en: '' },
    description: { en: '' },
    seal: '',
    instructions: merge(instructions, ...predefinedErrors.map((id) => ({ [id]: { en: id } }))),
    pages: [
      {
        heading: { en: '' },
        title: { en: '' },
        questions: [question],
      },
    ],
  }
}

describe('validation test suite', () => {
  // Extend this `tests` array with other test cases as we support
  // more kinds of validation.
  const tests: Array<{
    name: string
    question: Partial<Question>
    value?: Value
    values?: Values
    instructions?: Record<string, Copy>
    expectedErrors?: Copy[]
    dependencies?: string[]
  }> = [
    // Required Fields

    {
      name: 'required: if not set, error',
      question: {
        type: 'boolean',
        required: true,
      },
      value: undefined,
      expectedErrors: [{ en: 'field-is-required' }],
    },
    {
      name: 'required: if set, pass',
      question: {
        type: 'boolean',
        required: true,
      },
      value: true,
    },

    // Emails

    {
      name: 'email: empty strings error',
      question: {
        type: 'email',
      },
      value: '',
      expectedErrors: [{ en: 'invalid-email' }],
    },
    {
      name: 'email: invalid types error',
      question: {
        type: 'email',
      },
      value: 123,
      expectedErrors: [{ en: 'invalid-email' }],
    },
    {
      name: 'email: valid emails pass',
      question: {
        type: 'email',
      },
      value: 'test+test@example.com',
    },

    // Decimals

    {
      name: 'decimal: invalid types error',
      question: {
        type: 'decimal',
      },
      value: 'a string',
      expectedErrors: [{ en: 'invalid-decimal' }],
    },
    {
      name: 'decimal: stringified numbers error',
      question: {
        type: 'decimal',
      },
      value: '123',
      expectedErrors: [{ en: 'invalid-decimal' }],
    },
    {
      name: 'decimal: too large numbers fail',
      question: {
        type: 'decimal',
      },
      value: 1234567890123456,
      expectedErrors: [{ en: 'invalid-decimal' }],
    },
    {
      name: 'decimal: zero is valid',
      question: {
        type: 'decimal',
      },
      value: 0,
    },
    {
      name: 'decimal: basic decimals succeed',
      question: {
        type: 'decimal',
      },
      value: 123.12,
    },

    // Integers

    {
      name: 'integer: invalid types error',
      question: {
        type: 'integer',
      },
      value: 'a string',
      expectedErrors: [{ en: 'invalid-integer' }],
    },
    {
      name: 'integer: stringified numbers error',
      question: {
        type: 'integer',
      },
      value: '123',
      expectedErrors: [{ en: 'invalid-integer' }],
    },
    {
      name: 'integer: too large numbers fail',
      question: {
        type: 'integer',
      },
      value: 1234567890123456,
      expectedErrors: [{ en: 'invalid-integer' }],
    },
    {
      name: 'integer: negatives fail',
      question: {
        type: 'integer',
      },
      value: -123,
      expectedErrors: [{ en: 'invalid-integer' }],
    },
    {
      name: 'integer: decimals fail',
      question: {
        type: 'integer',
      },
      value: 123.12,
      expectedErrors: [{ en: 'invalid-integer' }],
    },
    {
      name: 'integer: zero is valid',
      question: {
        type: 'integer',
      },
      value: 0,
    },
    {
      name: 'integer: basic integers succeed',
      question: {
        type: 'integer',
      },
      value: 123,
    },

    // Dollar Amounts
    {
      name: 'dollar-amount: invalid types error',
      question: {
        type: 'dollar-amount',
      },
      value: 'a string',
      expectedErrors: [{ en: 'invalid-dollar' }],
    },
    {
      name: 'dollar-amount: stringified numbers error',
      question: {
        type: 'dollar-amount',
      },
      value: '123',
      expectedErrors: [{ en: 'invalid-dollar' }],
    },
    {
      name: 'dollar-amount: too large numbers fail',
      question: {
        type: 'dollar-amount',
      },
      value: 1234567890123456,
      expectedErrors: [{ en: 'invalid-dollar' }],
    },
    {
      name: 'dollar-amount: negatives fail',
      question: {
        type: 'dollar-amount',
      },
      value: -123,
      expectedErrors: [{ en: 'invalid-dollar' }],
    },
    {
      name: 'dollar-amount: zero is valid',
      question: {
        type: 'dollar-amount',
      },
      value: 0,
    },
    {
      name: 'dollar-amount: basic dollars succeed',
      question: {
        type: 'dollar-amount',
      },
      value: 123.12,
    },

    // Text
    {
      name: 'text: invalid types error',
      question: {
        type: 'shorttext',
      },
      value: 123,
      expectedErrors: [{ en: 'invalid-text' }],
    },
    {
      name: 'shorttext: too long fails',
      question: {
        type: 'shorttext',
      },
      value: 'a'.repeat(201),
      expectedErrors: [{ en: 'invalid-text' }],
    },
    {
      name: 'longtext: too long fails',
      question: {
        type: 'longtext',
      },
      value: 'a'.repeat(10001),
      expectedErrors: [{ en: 'invalid-text' }],
    },
    {
      name: 'text: empty string is invalid if required',
      question: {
        type: 'shorttext',
        required: true,
      },
      value: '',
      expectedErrors: [{ en: 'field-is-required' }],
    },
    {
      name: 'text: empty string is valid if not required',
      question: {
        type: 'shorttext',
      },
      value: '',
    },
    {
      name: 'text: generic string is valid',
      question: {
        type: 'shorttext',
      },
      value: 'Hello World!',
    },

    // Date
    {
      name: 'date: invalid types error',
      question: {
        type: 'date',
      },
      value: new Date(),
      expectedErrors: [{ en: 'invalid-date' }],
    },
    {
      name: 'date: invalid date formats error',
      question: {
        type: 'date',
      },
      value: '08/01/2020',
      expectedErrors: [{ en: 'invalid-date' }],
    },
    {
      name: 'date: valid date passes',
      question: {
        type: 'date',
      },
      value: '2020-01-20T10:00:00Z',
    },

    // Multi select

    // Boolean

    // Phone

    // Custom Validation: Regex

    // Custom Validation: Field Matching

    // Custom Validation: Min (Dates)

    // Custom Validation: Max (Dates)
  ]

  for (const t of tests) {
    test(t.name, () => {
      const question: Question = {
        id: 'foobar',
        name: { en: '' },
        type: 'shorttext',
        ...t.question,
      }
      const { errors, dependencies } = isQuestionValid(
        question,
        t.value,
        t.values || {},
        toForm(question, t.instructions || {})
      )
      expect(errors).toEqual(t.expectedErrors || [])
      expect(dependencies).toEqual(t.dependencies || [])
    })
  }
})
