import React, { ReactNode } from 'react'
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer'
import { Form, Values, Question, Option } from '../lib/types'
import { getSections, getFlattenedQuestions } from '../forms'
import { FormState } from '../contexts/form'
import removeMarkdown from 'remove-markdown'
import moment from 'moment'

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
    fontSize: 20,
    fontWeight: 500,
    marginBottom: 8,
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
    fontWeight: 'bold'
  },
  sectionContent: { fontSize: 10 },
  questionSection: {
    paddingTop: 12,
    borderTop: '1px solid black',
  },
})

const linkRegex = /\[([^\[]+)\](\(.*\))/gm
function processLinks(content: string) {
  if (!content) {
    return content
  }

  return content.replace(linkRegex, (match, p1, p2) => {
    return `${p1}: ${p2.replace(/[{()}]/g, '')}`
  })
}

interface Props {
  form: Form
  values: Values
  translateCopy: FormState['translateCopy']
}

const Icon: React.FC<{ option: Option }> = ({ option }) => {
  return (
    <View key={option.id} style={{ marginRight: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: option.icon ? option.icon.color : 'grey', height: 20, width: 20, borderRadius: 10 }}><Text style={{ fontSize: 12 }}>{option.icon?.label}</Text></View>
  )
}

const PDF: React.FC<Props> = (props) => {
  const { translateCopy, form, values } = props
  let questions: Question[] = []

  form.pages.forEach((p) => {
    questions = questions.concat(getFlattenedQuestions(p.questions, values))
  })

  function getValue(question: Question, values: Values): string | ReactNode {
    if (question.type === 'multiselect' && values[question.id]) {
      const multiselectAnswers = (values[question.id] as string[]).map((optionId) => {
        const option = question.options!.find((o) => o.id === optionId)
        if (!option) {
          return <View />
        }
        if (!option.icon) {
          return `\n• ${removeMarkdown(translateCopy(option.name))}`
        }
        return (
          <View style={{ alignItems: 'flex-start', marginBottom: 8, display: 'flex', flexDirection: 'row' }}><Icon option={option} /><Text style={{ fontSize: 12, width: '90%' }}>{removeMarkdown(translateCopy(option.name))}</Text>
          </View>
        )
      })
      return <View>{multiselectAnswers}</View>
    }
    if (question.type === 'single-select') {
      const option = question.options!.find((o) => o.id === values[question.id])
      if (option) {
        return <Text style={styles.questionAnswer}>{removeMarkdown(translateCopy(option.name))}</Text>
      }
    }
    if (question.type === 'checkbox') {
      return <Text style={styles.questionAnswer}>{removeMarkdown(translateCopy(question.options![0].name))}</Text>
    }
    if (question.type === 'sections') {
      return (
        <View>
          {getSections(question.sections, form, values).map(({ section, options }, i) => (
            <View style={styles.section} key={`${translateCopy(section.title)}_${i}`}>
              <View style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 12
              }}>
                <Text style={{
                  fontSize: 12,
                  marginBottom: 8,
                  fontWeight: 'bold'
                }}>{translateCopy(section.title)}</Text>
                <View style={{ display: "flex", flexDirection: 'row' }}>
                  {options.map(o => <Icon key={o.id} option={o} />)}
                </View>
              </View>
              <Text style={styles.sectionContent}>{removeMarkdown(processLinks(translateCopy(section.content)))}</Text>
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
          <Text style={{ fontSize: 12, marginBottom: 20 }}>Completed {moment().format('MMMM DD, YYYY')}</Text>
          {questions.map((q, i) => {
            const value = getValue(q, values)
            const name = translateCopy(q.name)
            const isPresentationalQuestion = q.type === 'sections' || q.type === 'instructions-only'
            if (!value || (q.type === 'sections' && getSections(q.sections, form, values).length === 0)) {
              return <View />
            }
            return (
              <View style={{ marginBottom: 20 }} key={`${q.id}_${i}`}>
                <Text style={styles.questionTitle}>
                  {isPresentationalQuestion ? removeMarkdown(processLinks(translateCopy(q.instructions!))) : `${i + 1}. ${name}`}
                </Text>

                {value}
              </View>
            )
          })}
        </View>
      </Page>
    </Document>
  )
}

export default PDF
