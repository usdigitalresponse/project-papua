import { isQuestionValid } from './validation'
import { Form, Copy, Question } from '../forms/types'
import { Value, Values } from '../contexts/form'
import { merge } from './merge'

function toForm(question: Question, instructions: Record<string, Copy>): Form {
  const predefinedErrors = ['field-is-required', 'invalid-boolean']
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
  const tests: Array<{
    name: string
    question: Question
    value?: Value
    values?: Values
    instructions?: Record<string, Copy>
    expectedErrors?: Copy[]
    dependencies?: string[]
  }> = [
    {
      name: 'required fields that are undefined error',
      question: {
        id: 'foobar',
        name: { en: 'A required question' },
        type: 'boolean',
        required: true,
      },
      value: undefined,
      expectedErrors: [{ en: 'field-is-required' }],
    },
    {
      name: 'required fields that are defined do not error',
      question: {
        id: 'foobar',
        name: { en: 'A required question' },
        type: 'boolean',
        required: true,
      },
      value: true,
    },
  ]

  for (const t of tests) {
    test(t.name, () => {
      const { errors, dependencies } = isQuestionValid(
        t.question,
        t.value,
        t.values || {},
        toForm(t.question, t.instructions || {})
      )
      expect(errors).toEqual(t.expectedErrors || [])
      expect(dependencies).toEqual(t.dependencies || [])
    })
  }
})
