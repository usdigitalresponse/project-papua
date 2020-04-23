import React, { useContext } from 'react'
import { Question as QuestionInterface } from '../forms/types'
import { getComponent } from '../forms'
import { Box, Heading, Text, Paragraph } from 'grommet'
import { LanguageContext } from '../contexts/language'
import { translate } from '../forms/index'
import { FormContext } from '../contexts/form'

interface Props {
  question: QuestionInterface
}

const Question: React.FC<Props> = (props) => {
  const { question } = props
  const Component: React.FC<{ [key: string]: any }> = getComponent(question.type)

  const { language } = useContext(LanguageContext)
  const { values, errors } = useContext(FormContext)

  const value = values[question.id]
  const error = errors[question.id]

  console.log('ERROR ', error)
  return (
    <Box direction="column" margin={{ bottom: 'small' }}>
      <Box fill={true} margin={{ bottom: 'small' }}>
        <Box direction="row" align="start">
          <Heading
            style={{
              maxWidth: 'none',
            }}
            color="black"
            level={4}
            margin="none"
          >
            {translate(question.name, language)}
          </Heading>
          {question.required && (
            <Heading level={4} margin="none" color="#FF4040">
              *
            </Heading>
          )}
        </Box>
        {question.instructions && (
          <Paragraph
            fill={true}
            style={{ whiteSpace: 'pre-wrap' }}
            size="small"
            color="black"
            margin={{ top: 'xsmall' }}
          >
            {translate(question.instructions, language)}
          </Paragraph>
        )}
      </Box>
      <Component width="100%" question={question} />
      {error && (
        <Box>
          {error.map((e) => (
            <Text key={String(e)} margin={{ top: 'xsmall' }} color="#FF4040">
              {translate(e, language)}
            </Text>
          ))}
        </Box>
      )}
      <Box margin={{ top: 'medium' }}>
        {question.switch && question.switch[value as string]?.map((q) => <Question question={q} key={q.id} />)}
      </Box>
    </Box>
  )
}

export default Question
