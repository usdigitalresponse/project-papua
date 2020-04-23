import React, { useContext } from 'react'
import { Page } from '../forms/types'
import { Box, Heading } from 'grommet'
import Question from './Question'
import { FormContext } from '../contexts/form'
import { Markdown } from './helper-components/Markdown'

interface Props {
  page: Page
}

const Form: React.FC<Props> = (props) => {
  const { page } = props
  const { translateCopy } = useContext(FormContext)

  return (
    <Box style={{ padding: '48px' }} direction="column" justify="start">
      <Heading color="black" margin="none" level={3}>
        {translateCopy(page.heading)}
      </Heading>
      {page.instructions && <Markdown>{translateCopy(page.instructions)}</Markdown>}
      <Box margin={{ bottom: 'medium' }}></Box>
      {page.questions.map((question) => (
        <Question question={question} key={question.id} />
      ))}
    </Box>
  )
}

export default Form
