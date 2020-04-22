import React, { useContext } from 'react'
import { Page } from '../forms/types'
import { Box, Heading, Paragraph } from 'grommet'
import Question from './Question'
import { FormContext } from '../contexts/form'

interface Props {
  page: Page
}

const Form: React.FC<Props> = (props) => {
  const { page } = props
  const { translateCopy } = useContext(FormContext)

  return (
    <Box pad="medium" direction="column" justify="start">
      <Heading color="black" margin={{ bottom: 'none', top: 'none' }} level={3}>
        {translateCopy(page.heading)}
      </Heading>
      {page.instructions && (
        <Paragraph fill={true} style={{ whiteSpace: 'pre-wrap' }} size="small" color="black" margin={{ top: 'xsmall' }}>
          {translateCopy(page.instructions)}
        </Paragraph>
      )}
      <Box margin={{ bottom: 'small' }}></Box>
      {page.questions.map((question) => (
        <Question question={question} key={question.id} />
      ))}
    </Box>
  )
}

export default Form
