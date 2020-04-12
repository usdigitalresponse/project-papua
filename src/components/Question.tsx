import React, { useState } from 'react'
import { Question as QuestionInterface } from '../forms/types'
import { Pane, Heading, Text, majorScale } from 'evergreen-ui'
import { getComponent } from '../forms'

interface Props {
  question: QuestionInterface
}

type Value = string | string[] | undefined

const Question: React.FC<Props> = (props) => {
  const { question } = props
  const Component: React.FC<{ [key: string]: any }> = getComponent(question.type)

  const [value, setValue] = useState<Value>(undefined)

  return (
    <Pane display="flex" flexDirection="column" marginBottom={majorScale(2)}>
      <Pane marginBottom={majorScale(1)}>
        <Heading color="black" size={400}>{question.name}</Heading>
        {question.instructions && <Text color="black" size={300}>{question.instructions}</Text>}
      </Pane>
      <Component width="100%" value={value} question={question} onChange={(e: React.ChangeEvent<HTMLInputElement> | string) => {
        if (typeof e === 'string' || Array.isArray(e)) {
          setValue(e)
        } else {
          setValue(e.target.value)
        }
      }} />
    </Pane>
  )
}

export default Question