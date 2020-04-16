import React, { useContext } from 'react'
import { Question } from '../../forms/types'
import { Box, Text } from 'grommet'
import './single-select.css'
import { LanguageContext } from '../../contexts/language'
import { translate } from '../../forms/index';
import { FormContext } from '../../contexts/form'

interface Props {
  question: Question
}

const SingleSelect: React.FC<Props> = (props) => {
  const { question } = props
  const { language } = useContext(LanguageContext)
  const { values, setValue } = useContext(FormContext)

  const value = values[question.id]

  if (!question || !question.options) {
    return <Box />
  }
  return (
    <Box>
      {question.options.map(o => (
        <Box onClick={() => setValue(question.id, o.id)} background={value === o.id ? "#EBFFFA" : "white"} key={o.id} margin={{ bottom: 'xsmall' }} style={{ borderRadius: '4px' }} direction="row" className="single-select-border single-select" pad='small'>
          <Box background={value === o.id ? "#008060" : "white"} margin={{ right: 'small' }} flex={{ shrink: 0 }} style={{ height: 20, width: 20, borderRadius: '50%' }} className="single-select-border" />
          <Text>{translate(o.name, language)}</Text>
        </Box>
      ))}
    </Box>
  )
}

export default SingleSelect
