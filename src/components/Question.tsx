import React, { useState, useContext } from 'react'
import { Question as QuestionInterface } from '../forms/types'
import { getComponent } from '../forms'
import { Box, Heading, Text } from 'grommet'
import { LanguageContext } from '../contexts/language';
import { translate } from '../forms/index';
import { FormContext } from '../contexts/form';

interface Props {
  question: QuestionInterface
}

const Question: React.FC<Props> = (props) => {
  const { question } = props
  const Component: React.FC<{ [key: string]: any }> = getComponent(question.type)

  const { language } = useContext(LanguageContext)
  const { values } = useContext(FormContext)

  const value = values[question.id]
  const hasSwitch = question.switch && value && typeof value === 'string'

  return (
    <Box direction="column" margin={{ bottom: 'small' }}>
      <Box fill={true} margin={{ bottom: 'small' }}>
        <Heading style={{
          maxWidth: 'none'
        }} color="black" level={4} margin="none">{translate(question.name, language)}</Heading>
        {question.instructions && <Text size="small" color="black" margin={{ top: 'xsmall' }} >{translate(question.instructions, language)}</Text>}
      </Box>
      <Component width="100%" question={question} />
      <Box margin={{ top: 'xsmall' }}>
        {hasSwitch && question.switch![value as string]?.map(q => <Question question={q} />)}
      </Box>
    </Box>
  )
}

export default Question