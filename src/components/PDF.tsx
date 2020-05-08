import React, { useContext, ReactNode } from 'react'
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer'
import { Form, Values, Question, Copy } from '../lib/types'
import { getSections, getFlattenedQuestions } from '../forms'
import { FormContext } from '../contexts/form'
import { getByDisplayValue } from '@testing-library/react'

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: 500,
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: 500,
  },
})

interface Props {
  form: Form
  values: Values
  translateCopy: (copy: Copy) => string
}

const PDF: React.FC<Props> = (props) => {
  const { translateCopy, form, values } = props
  let questions: Question[] = []

  form.pages.forEach((p) => {
    questions = questions.concat(getFlattenedQuestions(p.questions, values))
  })

  function getValue(question: Question, values: Values): string | ReactNode {
    if (question.type === 'multiselect' && values[question.id]) {
      const multiselectAnswers = (values[question.id] as string[]).reduce((val, optionId) => {
        const option = question.options!.find((o) => o.id === optionId)
        if (option) {
          return `${val}\n${translateCopy(option.name)}`
        }
        return val
      }, '')
      return <Text>{multiselectAnswers}</Text>
    }
    if (question.type === 'single-select') {
      const option = question.options!.find((o) => o.id === values[question.id])
      if (option) {
        return <Text>{translateCopy(option.name)}</Text>
      }
    }
    if (question.type === 'sections') {
      return (
        <View>
          {getSections(question.sections, form, values).map((section) => (
            <View key={translateCopy(section.title)}>
              <Text>{translateCopy(section.title)}</Text>
              <Text>{translateCopy(section.content)}</Text>
            </View>
          ))}
        </View>
      )
    }

    return <View />
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.heading}>{translateCopy(form.title)}</Text>
          {questions.map((q) => {
            return (
              <View key={q.id}>
                <Text style={styles.questionTitle}>{translateCopy(q.name)}</Text>
                {getValue(q, values)}
              </View>
            )
          })}
        </View>
      </Page>
    </Document>
  )
}

export default PDF
