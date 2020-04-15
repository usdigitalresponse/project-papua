import React, { useState } from 'react'
import { Question as QuestionInterface } from '../forms/types'
import { getComponent } from '../forms'
import { Box, Heading, Text } from 'grommet'

interface Props {
  question: QuestionInterface
}

type Value = string | string[] | undefined

const Question: React.FC<Props> = (props) => {
  const { question } = props
  const Component: React.FC<{ [key: string]: any }> = getComponent(question.type)

  const [value, setValue] = useState<Value>(undefined)

  const hasSwitch = question.switch && value && typeof value === 'string'

  return (
    <Box direction="column" margin={{ bottom: 'small' }}>
      <Box fill={true} margin={{ bottom: 'small' }}>
        <Heading style={{
          maxWidth: 'none'
        }} color="black" level={4} margin="none">{question.name}</Heading>
        {question.instructions && <Text size="small" color="black" margin={{ top: 'xsmall' }} >{question.instructions}</Text>}
      </Box>
      <Component width="100%" value={value} question={question} onChange={(e: React.ChangeEvent<HTMLInputElement> | string) => {
        if (typeof e === 'string' || Array.isArray(e)) {
          setValue(e)
        } else {
          setValue(e.target.value)
        }
      }} />
      <Box margin={{ top: 'xsmall' }}>
        {
          hasSwitch && question.switch![value as string]?.map(q => <Question question={q} />)}
      </Box>
    </Box>
  )
}

export default Question