import React, { useContext } from 'react'
import { Question as QuestionInterface } from '../forms/types'
import { getComponent } from '../forms'
import { Box, Heading, Text } from 'grommet'
import { FormContext } from '../contexts/form'
import { Markdown } from './helper-components'

interface Props {
  question: QuestionInterface
}

const Question: React.FC<Props> = (props) => {
  const { question } = props
  const Component: React.FC<{ [key: string]: any }> = getComponent(question.type)

  const { values, errors, translateCopy } = useContext(FormContext)

  const value = values[question.id]
  const error = errors[question.id]

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
            {translateCopy(question.name)}
          </Heading>
          {question.required && (
            <Heading level={4} margin="none" color="#FF4040">
              *
            </Heading>
          )}
        </Box>
        {question.instructions && (
          <Markdown margin={{ vertical: 'xsmall' }} size="small">
            {translateCopy(question.instructions)}
          </Markdown>
        )}
      </Box>
      <Component width="100%" question={question} />
      {error && (
        <Box>
          {error.map((e) => (
            <Text key={e.en} margin={{ top: 'xsmall' }} color="#FF4040">
              {translateCopy(e)}
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
