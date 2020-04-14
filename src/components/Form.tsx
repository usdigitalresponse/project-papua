import React from 'react'
import { Page } from '../forms/types'
import { Box, Heading } from 'grommet'
import Question from './Question'

interface Props {
  page: Page
}

const Form: React.FC<Props> = (props) => {
  const { page } = props
  return (
    <Box pad='medium' direction="column" justify="start">
      <Heading color="black" margin={{ top: 'none' }} level={3}>{page.heading}</Heading>
      {page.questions.map(question => <Question question={question} key={question.name} />)}
    </Box>
  )
}

export default Form