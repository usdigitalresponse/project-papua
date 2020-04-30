import { isQuestionValid } from './validation'
import { Form, Copy, Question, Value, Values } from './types'
import { merge } from './merge'
import moment from 'moment'

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
    'invalid-phone',
    'invalid-ssn',
    'invalid-address',
    'invalid-instructions-only',
    'invalid-arn',
    'invalid-file',
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
      expectedErrors: [{ en: 'invalid-text' }],
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

    // Dropdown
    {
      name: 'dropdown: invalid option errors',
      question: {
        type: 'dropdown',
        options: [{ id: 'hello', name: { en: 'Hello' } }],
      },
      value: 'goodbye',
      expectedErrors: [{ en: 'invalid-select' }],
    },
    {
      name: 'dropdown: invalid type errors (array)',
      question: {
        type: 'dropdown',
        options: [{ id: 'hello', name: { en: 'Hello' } }],
      },
      value: ['hello'],
      expectedErrors: [{ en: 'invalid-select' }],
    },
    {
      name: 'dropdown: invalid type errors (number)',
      question: {
        type: 'dropdown',
        options: [{ id: 'hello', name: { en: 'Hello' } }],
      },
      value: 1,
      expectedErrors: [{ en: 'invalid-select' }],
    },
    {
      name: 'dropdown: valid option passes',
      question: {
        type: 'dropdown',
        options: [{ id: 'hello', name: { en: 'Hello' } }],
      },
      value: 'hello',
    },

    // Single Select
    {
      name: 'single-select: invalid option errors',
      question: {
        type: 'single-select',
        options: [{ id: 'hello', name: { en: 'Hello' } }],
      },
      value: 'goodbye',
      expectedErrors: [{ en: 'invalid-select' }],
    },
    {
      name: 'single-select: invalid type errors (array)',
      question: {
        type: 'single-select',
        options: [{ id: 'hello', name: { en: 'Hello' } }],
      },
      value: ['hello'],
      expectedErrors: [{ en: 'invalid-select' }],
    },
    {
      name: 'single-select: invalid type errors (number)',
      question: {
        type: 'single-select',
        options: [{ id: 'hello', name: { en: 'Hello' } }],
      },
      value: 1,
      expectedErrors: [{ en: 'invalid-select' }],
    },
    {
      name: 'single-select: valid option passes',
      question: {
        type: 'single-select',
        options: [{ id: 'hello', name: { en: 'Hello' } }],
      },
      value: 'hello',
    },

    // Single Select
    {
      name: 'state-picker: invalid option errors',
      question: {
        type: 'state-picker',
      },
      value: 'East Virginia',
      expectedErrors: [{ en: 'invalid-select' }],
    },
    {
      name: 'state-picker: invalid type errors (array)',
      question: {
        type: 'state-picker',
      },
      value: ['wy'],
      expectedErrors: [{ en: 'invalid-select' }],
    },
    {
      name: 'state-picker: invalid type errors (number)',
      question: {
        type: 'state-picker',
      },
      value: 1,
      expectedErrors: [{ en: 'invalid-select' }],
    },
    {
      name: 'state-picker: valid option passes',
      question: {
        type: 'state-picker',
      },
      value: 'ca',
    },

    // Multi select
    {
      name: 'multi-select: invalid option errors',
      question: {
        type: 'multiselect',
        options: [{ id: 'hello', name: { en: 'Hello' } }],
      },
      value: ['goodbye'],
      expectedErrors: [{ en: 'invalid-select' }],
    },
    {
      name: 'multi-select: partially invalid option errors',
      question: {
        type: 'multiselect',
        options: [{ id: 'hello', name: { en: 'Hello' } }],
      },
      value: ['hello', 'goodbye'],
      expectedErrors: [{ en: 'invalid-select' }],
    },
    {
      name: 'multi-select: invalid type errors (string)',
      question: {
        type: 'multiselect',
        options: [{ id: 'hello', name: { en: 'Hello' } }],
      },
      value: 'hello',
      expectedErrors: [{ en: 'invalid-select' }],
    },
    {
      name: 'multi-select: invalid type errors (number)',
      question: {
        type: 'multiselect',
        options: [{ id: 'hello', name: { en: 'Hello' } }],
      },
      value: 1,
      expectedErrors: [{ en: 'invalid-select' }],
    },
    {
      name: 'multi-select: invalid type errors (array of numbers)',
      question: {
        type: 'multiselect',
        options: [{ id: 'hello', name: { en: 'Hello' } }],
      },
      value: [1] as any,
      expectedErrors: [{ en: 'invalid-select' }],
    },
    {
      name: 'multi-select: valid option passes',
      question: {
        type: 'multiselect',
        options: [{ id: 'hello', name: { en: 'Hello' } }],
      },
      value: ['hello'],
    },

    // Boolean
    {
      name: 'boolean: stringified booleans error',
      question: {
        type: 'boolean',
      },
      value: 'true',
      expectedErrors: [{ en: 'invalid-boolean' }],
    },
    {
      name: 'boolean: numeric booleans error',
      question: {
        type: 'boolean',
      },
      value: 1,
      expectedErrors: [{ en: 'invalid-boolean' }],
    },
    {
      name: 'boolean: true passes',
      question: {
        type: 'boolean',
      },
      value: true,
    },
    {
      name: 'boolean: false passes',
      question: {
        type: 'boolean',
      },
      value: false,
    },

    // Phone
    {
      name: 'phone: stringified phone numbers error',
      question: {
        type: 'phone',
      },
      value: '1234567890',
      expectedErrors: [{ en: 'invalid-phone' }],
    },
    {
      name: 'phone: numbers with country code error',
      question: {
        type: 'phone',
      },
      value: 11234567890,
      expectedErrors: [{ en: 'invalid-phone' }],
    },
    {
      name: 'phone: fake numbers error',
      question: {
        type: 'phone',
      },
      value: 200,
      expectedErrors: [{ en: 'invalid-phone' }],
    },
    {
      name: 'phone: real numbers pass',
      question: {
        type: 'phone',
      },
      value: 1234567890,
    },

    // SSN
    {
      name: 'ssn: stringified ssn numbers error',
      question: {
        type: 'ssn',
      },
      value: '123456789',
      expectedErrors: [{ en: 'invalid-ssn' }],
    },
    {
      name: 'ssn: fake numbers error',
      question: {
        type: 'ssn',
      },
      value: 123,
      expectedErrors: [{ en: 'invalid-ssn' }],
    },
    {
      name: 'ssn: real numbers pass',
      question: {
        type: 'ssn',
      },
      value: 123456789,
    },

    // ARN
    {
      name: 'arn: numeric arns error',
      question: {
        type: 'arn',
      },
      value: 123456789,
      expectedErrors: [{ en: 'invalid-arn' }],
    },
    {
      name: 'arn: fake arns error',
      question: {
        type: 'arn',
      },
      value: 'A123',
      expectedErrors: [{ en: 'invalid-arn' }],
    },
    {
      name: 'arn: numbers without A error',
      question: {
        type: 'arn',
      },
      value: '123456789',
      expectedErrors: [{ en: 'invalid-arn' }],
    },
    {
      name: 'arn: real numbers pass',
      question: {
        type: 'arn',
      },
      value: 'A123456789',
    },

    // Address
    {
      name: 'address: invalid types error',
      question: {
        type: 'address',
      },
      value: true,
      expectedErrors: [{ en: 'invalid-address' }],
    },
    {
      name: 'address: empty strings error',
      question: {
        type: 'address',
      },
      value: '',
      expectedErrors: [{ en: 'invalid-address' }],
    },
    {
      name: 'address: real addresses pass',
      question: {
        type: 'address',
      },
      value: '100 California St.',
    },

    // Instructions Only
    {
      name: 'instructions-only: any value should error',
      question: {
        type: 'instructions-only',
      },
      value: 'wasssup',
      expectedErrors: [{ en: 'invalid-instructions-only' }],
    },

    // Files
    {
      name: 'file: invalid type errors',
      question: {
        type: 'file',
      },
      value: true,
      expectedErrors: [{ en: 'invalid-file' }],
    },
    {
      name: 'file: empty array of files fails if required',
      question: {
        type: 'file',
        required: true,
      },
      value: [],
      expectedErrors: [{ en: 'invalid-file' }],
    },
    {
      name: 'file: empty array of files passes if not required ',
      question: {
        type: 'file',
      },
      value: [],
    },
    {
      name: 'file: unknown fields error',
      question: {
        type: 'file',
      },
      value: [
        {
          idk: 'hello world',
        },
      ] as any,
      expectedErrors: [{ en: 'invalid-file' }],
    },
    {
      name: 'file: unacceptable format errors',
      question: {
        type: 'file',
      },
      value: [
        {
          name: 'example.gif',
          type: 'image/gif',
          size: 1001,
          contents: '123==',
        },
      ],
      expectedErrors: [{ en: 'invalid-file' }],
    },
    {
      name: 'file: real file passes',
      question: {
        type: 'file',
      },
      value: [
        {
          name: 'hello-world.png',
          type: 'image/png',
          size: 1001,
          contents: '123==',
        },
      ],
    },

    // Checkbox
    {
      name: 'checkbox: invalid types error',
      question: {
        type: 'checkbox',
      },
      value: 123,
      expectedErrors: [{ en: 'invalid-checkbox' }],
    },
    {
      name: 'checkbox: false errors',
      question: {
        type: 'checkbox',
      },
      value: false,
      expectedErrors: [{ en: 'invalid-checkbox' }],
    },
    {
      name: 'checkbox: true passes',
      question: {
        type: 'checkbox',
      },
      value: true,
    },

    // Custom Validation: Regex
    {
      name: 'regex: strings that do not match error',
      question: {
        type: 'shorttext',
        validate: [
          {
            type: 'regex',
            value: '^(hello|goodbye)$',
            error: { en: 'invalid-regex' },
          },
        ],
      },
      value: 'not valid',
      expectedErrors: [{ en: 'invalid-regex' }],
    },
    {
      name: 'regex: strings that match do not error',
      question: {
        type: 'shorttext',
        validate: [
          {
            type: 'regex',
            value: '^(hello|goodbye)$',
            error: { en: 'invalid-regex' },
          },
        ],
      },
      value: 'hello',
    },

    // Custom Validation: Field Matching
    {
      name: 'matches_field: strings that do not match error',
      question: {
        type: 'shorttext',
        validate: [
          {
            type: 'matches_field',
            value: 'id:other',
            error: { en: 'invalid-matches-field' },
          },
        ],
      },
      value: 'goodbye',
      values: {
        other: 'hello',
      },
      expectedErrors: [{ en: 'invalid-matches-field' }],
      dependencies: ['other'],
    },
    {
      name: 'matches_field: strings that match do not error',
      question: {
        type: 'shorttext',
        validate: [
          {
            type: 'matches_field',
            value: 'id:other',
            error: { en: 'invalid-matches-field' },
          },
        ],
      },
      value: 'hello',
      values: {
        other: 'hello',
      },
      dependencies: ['other'],
    },

    // Custom Validation: Min (Dates)
    {
      name: 'min(date): dates before min in past error',
      question: {
        type: 'date',
        validate: [
          {
            type: 'min',
            value: '-15d',
            error: { en: 'invalid-min' },
          },
        ],
      },
      value: moment().add(-20, 'days').format('YYYY-MM-DDTHH:mm:ssZ'),
      expectedErrors: [{ en: 'invalid-min' }],
    },
    {
      name: 'min(date): dates after min in past pass',
      question: {
        type: 'date',
        validate: [
          {
            type: 'min',
            value: '-15d',
            error: { en: 'invalid-min' },
          },
        ],
      },
      value: moment().add(-5, 'days').format('YYYY-MM-DDTHH:mm:ssZ'),
    },
    {
      name: 'min(date): dates before min in future error',
      question: {
        type: 'date',
        validate: [
          {
            type: 'min',
            value: '+15d',
            error: { en: 'invalid-min' },
          },
        ],
      },
      value: moment().add(5, 'days').format('YYYY-MM-DDTHH:mm:ssZ'),
      expectedErrors: [{ en: 'invalid-min' }],
    },
    {
      name: 'min(date): dates after min in future pass',
      question: {
        type: 'date',
        validate: [
          {
            type: 'min',
            value: '+15d',
            error: { en: 'invalid-min' },
          },
        ],
      },
      value: moment().add(20, 'days').format('YYYY-MM-DDTHH:mm:ssZ'),
    },

    // Custom Validation: Max (Dates)
    {
      name: 'max(date): dates after max in past error',
      question: {
        type: 'date',
        validate: [
          {
            type: 'max',
            value: '-15d',
            error: { en: 'invalid-max' },
          },
        ],
      },
      value: moment().add(-5, 'days').format('YYYY-MM-DDTHH:mm:ssZ'),
      expectedErrors: [{ en: 'invalid-max' }],
    },
    {
      name: 'max(date): dates before max in past pass',
      question: {
        type: 'date',
        validate: [
          {
            type: 'max',
            value: '-2y',
            error: { en: 'invalid-max' },
          },
        ],
      },
      value: moment().add(-3, 'years').format('YYYY-MM-DDTHH:mm:ssZ'),
    },
    {
      name: 'max(date): dates after max in future error',
      question: {
        type: 'date',
        validate: [
          {
            type: 'max',
            value: '+15d',
            error: { en: 'invalid-max' },
          },
        ],
      },
      value: moment().add(20, 'days').format('YYYY-MM-DDTHH:mm:ssZ'),
      expectedErrors: [{ en: 'invalid-max' }],
    },
    {
      name: 'max(date): dates before max in future pass',
      question: {
        type: 'date',
        validate: [
          {
            type: 'max',
            value: '+2y',
            error: { en: 'invalid-max' },
          },
        ],
      },
      value: moment().add(1, 'years').format('YYYY-MM-DDTHH:mm:ssZ'),
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
