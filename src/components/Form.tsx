import React, { useContext } from 'react'
import { Page } from '../forms/types'
import { Box, Heading, Paragraph } from 'grommet'
import Question from './Question'
import { LanguageContext } from '../contexts/language'
import { translate } from '../forms/index'

interface Props {
  page: Page
}

const Form: React.FC<Props> = (props) => {
  const { page } = props
  const { language } = useContext(LanguageContext)

  return (
    <Box pad="medium" direction="column" justify="start">
      <Heading color="black" margin={{ bottom: 'none', top: 'none' }} level={3}>
        {translate(page.heading, language)}
      </Heading>
      {page.instructions && (
        <Paragraph fill={true} style={{ whiteSpace: 'pre-wrap' }} size="small" color="black" margin={{ top: 'xsmall' }}>
          {translate(page.instructions, language)}
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
