import React, { ReactNode } from 'react'
import { Question as QuestionInterface } from '../forms/types'
import { Pane, Heading, Text, majorScale } from 'evergreen-ui'
import { getComponent } from '../forms'

interface Props {
  question: QuestionInterface
}

const Question: React.FC<Props> = (props) => {
  const { question } = props
  const Component: React.FC<{ [key: string]: any }> = getComponent(question.type)
  return (
    <Pane display="flex" flexDirection="column" marginBottom={majorScale(2)}>
      <Pane marginBottom={majorScale(1)}>
        <Heading color="black" size={400}>{question.name}</Heading>
        {question.instructions && <Text color="black" size={300}>{question.instructions}</Text>}
      </Pane>
      <Component width="100%" />
    </Pane>
  )
}

export default Question