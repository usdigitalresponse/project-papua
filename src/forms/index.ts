import { Question, QuestionType, Page, Values, Errors, Form, Section } from '../lib/types'
import DatePicker from '../components/form-components/DatePicker'
import TextInput from '../components/form-components/TextInput'
import Select from '../components/form-components/Select'
import SingleSelect from '../components/form-components/SingleSelect'
import Boolean from '../components/form-components/Boolean'
import Multiselect from '../components/form-components/Multiselect'
import TextArea from '../components/form-components/TextArea'
import StateSelect from '../components/form-components/StateSelect'
import Sections from '../components/form-components/Section'
import { Number as NumberComponent } from '../components/form-components/Number'
import File from '../components/form-components/File'
import { Checkbox } from '../components/form-components/Checkbox'
import { Box } from 'grommet'

/**
 * Determines if a user can proceed to the next form, if they have:
 * 1) Finished all required questions
 * 2) There are no validation errors
 * @param page
 * @param values
 * @param errors
 */
export function canContinue(page: Page, values: Values, errors: Errors): boolean {
  if (!page) {
    return true
  }

  const questions = getFlattenedQuestions(page.questions, values)
  const questionIds = questions.map((q) => q.id)
  const requiredQuestions = questions.filter((q) => q.required).map((q) => q.id)
  return requiredQuestions.every((id) => values[id]) && !questionIds.some((id) => errors[id])
}

/**
 * Given a set of questions, generates a flattened list of 'relevant' questions, including subquestions from switches.
 * @param questions
 * @param values
 */
export function getFlattenedQuestions(questions: Question[], values: Values): Question[] {
  let flattenedQuestions: Question[] = []

  questions.forEach((question) => {
    flattenedQuestions.push(question)
    const { id } = question

    const value = values[id] as string
    const hasSubQuestions = value && question.switch && typeof value === 'string' && question.switch[value]

    if (hasSubQuestions) {
      const subQuestions = question.switch![value]
      flattenedQuestions = subQuestions
        ? flattenedQuestions.concat(getFlattenedQuestions(subQuestions, values))
        : flattenedQuestions
    }
  })

  return flattenedQuestions
}

const typeComponentMappings: Partial<Record<QuestionType, React.FC>> = {
  shorttext: TextInput as React.FC,
  date: DatePicker as React.FC,
  dropdown: Select as React.FC,
  'single-select': SingleSelect as React.FC,
  boolean: Boolean as React.FC,
  multiselect: Multiselect as React.FC,
  longtext: TextArea as React.FC,
  'instructions-only': Box,
  'state-picker': StateSelect as React.FC,
  decimal: NumberComponent as React.FC,
  integer: NumberComponent as React.FC,
  'dollar-amount': NumberComponent as React.FC,
  phone: NumberComponent as React.FC,
  ssn: NumberComponent as React.FC,
  file: File as React.FC,
  checkbox: Checkbox as React.FC,
  sections: Sections as React.FC,
}

export function getComponent(type: QuestionType): React.FC<{ question: Question }> {
  return typeComponentMappings[type] || TextInput
}

export function getSwitch(questionSwitch: Question['switch'], value: string | string[]): Question[] {
  if (!questionSwitch || !value) {
    return []
  }
  const switchKey = Object.keys(questionSwitch).find((key) => {
    return (
      key.split(',').includes(value.toString()) ||
      (typeof value !== 'string' && (value as string[]).some((val) => key.split(',').includes(val)))
    )
  })
  if (!switchKey) {
    return []
  }

  return questionSwitch[switchKey]
}

export function getSections(sectionIds: Question['sections'], form: Form, values: Values): Section[] {
  if (!form.sections) {
    return []
  }

  const sections: Section[] = []
  if (sectionIds?.includes('id:')) {
    const ids = values[sectionIds.slice(3)]
    if (!ids || typeof ids !== 'string') {
      return []
    }

    ids.split(',').forEach((id) => {
      const section = form.sections![id]
      if (section) {
        sections.push(section)
      }
    })

    return sections
  }

  sectionIds?.split(',').forEach((id) => {
    const section = form.sections![id]
    if (section) {
      sections.push(section)
    }
  })

  return sections
}
