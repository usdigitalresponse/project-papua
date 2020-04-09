import React from 'react'
import { Page } from '../forms/types'
import { Pane, majorScale, Heading } from 'evergreen-ui'
import Question from './Question'

interface Props {
  page: Page
}

const Form: React.FC<Props> = (props) => {
  const { page } = props
  return (
    <Pane padding={majorScale(4)} display="flex" flexDirection="column">
      <Heading color="black" size={600} marginBottom={majorScale(2)}>{page.heading}</Heading>
      {page.questions.map(question => <Question question={question} key={question.name} />)}
    </Pane>
  )
}

export default Form