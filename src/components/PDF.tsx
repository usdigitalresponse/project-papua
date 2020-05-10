import React, { ReactNode } from 'react'
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer'
import { Form, Values, Question } from '../lib/types'
import { getSections, getFlattenedQuestions } from '../forms'
import { FormState } from '../contexts/form'

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  pageContent: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: 500,
    marginBottom: 16,
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: 500,
    marginBottom: 8,
  },
  questionAnswer: {
    fontSize: 12,
  },
  section: {
    padding: 12,
    border: '1px solid black',
    backgroundColor: '#F8F8F8',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    marginBottom: 8,
  },
  sectionContent: { fontSize: 10 },
  questionSection: {
    paddingTop: 12,
    borderTop: '1px solid black',
  },
})

interface Props {
  form: Form
  values: Values
  translateCopy: FormState['translateCopy']
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
          return `${val}\n• ${translateCopy(option.name)}`
        }
        return val
      }, '')
      return <Text style={styles.questionAnswer}>{multiselectAnswers}</Text>
    }
    if (question.type === 'single-select') {
      const option = question.options!.find((o) => o.id === values[question.id])
      if (option) {
        return <Text style={styles.questionAnswer}>{translateCopy(option.name)}</Text>
      }
    }
    if (question.type === 'checkbox') {
      return <Text style={styles.questionAnswer}>{translateCopy(question.options![0].name)}</Text>
    }
    if (question.type === 'sections') {
      return (
        <View>
          {getSections(question.sections, form, values).map((section, i) => (
            <View style={styles.section} key={`${translateCopy(section.title)}_${i}`}>
              <Text style={styles.sectionTitle}>{translateCopy(section.title)}</Text>
              <Text style={styles.sectionContent}>{translateCopy(section.content)}</Text>
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
        <View style={styles.pageContent}>
          <Text style={styles.heading}>{translateCopy(form.title)}</Text>
          {questions.map((q, i) => {
            if (q.type === 'sections' && getSections(q.sections, form, values).length === 0) {
              return <View />
            }
            return (
              <View style={styles.questionSection} key={`${q.id}_${i}`}>
                <Text style={styles.questionTitle}>
                  {q.type === 'sections' ? translateCopy(q.instructions!) : `${i + 1}. ${translateCopy(q.name)}`}
                </Text>
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
