import React, { useContext } from 'react'
import { Page } from '../lib/types'
import { Box, Heading, ResponsiveContext } from 'grommet'
import Question from './Question'
import { FormContext } from '../contexts/form'
import { Markdown } from './helper-components/Markdown'

interface Props {
  page: Page
}

const Form: React.FC<Props> = (props) => {
  const { page } = props
  const { translateCopy } = useContext(FormContext)
  const size = useContext(ResponsiveContext)

  const padding = size === 'small' ? '12px' : '24px'
  return (
    <Box pad={{ horizontal: padding, top: padding, bottom: 'none' }} direction="column" justify="start">
      <Heading color="black" margin="none" level={3}>
        {translateCopy(page.heading)}
      </Heading>
      {page.instructions && <Markdown size="small">{translateCopy(page.instructions)}</Markdown>}
      <Box margin={{ bottom: 'medium' }}></Box>
      {page.questions.map((question) => (
        <Question question={question} key={question.id} />
      ))}
    </Box>
  )
}

export default Form
