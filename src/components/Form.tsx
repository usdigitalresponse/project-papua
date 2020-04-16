import React, {useContext} from 'react'
import { Page } from '../forms/types'
import { Box, Heading } from 'grommet'
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
    <Box pad='medium' direction="column" justify="start">
      <Heading color="black" margin={{ bottom: 'medium', top: 'none' }} level={3}>{translate(page.heading, language)}</Heading>
      {page.questions.map(question => <Question question={question} key={translate(question.name, language)} />)}
    </Box>
  )
}

export default Form
