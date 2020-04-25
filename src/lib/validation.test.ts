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
      name: 'required fields that are undefined error',
      question: {
        type: 'boolean',
        required: true,
      },
      value: undefined,
      expectedErrors: [{ en: 'field-is-required' }],
    },
    {
      name: 'required fields that are defined do not error',
      question: {
        type: 'boolean',
        required: true,
      },
      value: true,
    },

    // Emails

    {
      name: 'empty emails produce errors',
      question: {
        type: 'email',
      },
      value: '',
      expectedErrors: [{ en: 'invalid-email' }],
    },
    {
      name: 'invalid emails produce errors',
      question: {
        type: 'email',
      },
      value: 123,
      expectedErrors: [{ en: 'invalid-email' }],
    },
    {
      name: 'valid emails do not error',
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
