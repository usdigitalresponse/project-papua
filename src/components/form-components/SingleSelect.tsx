import React, { useContext } from 'react'
import { Question } from '../../forms/types'
import { Box, Text, RadioButtonGroup } from 'grommet'
import './single-select.css'
import { LanguageContext } from '../../contexts/language'
import { translate } from '../../forms/index'
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
      {question.options.map((o) => (
        <Box
          onClick={() => setValue(question, o.id)}
          background={value === o.id ? '#BCCFFF' : 'white'}
          key={o.id}
          margin={{ bottom: 'xsmall' }}
          style={{ borderRadius: '4px' }}
          direction="row"
          className="single-select-border single-select"
          pad="small"
        >
          <Box
            background={value === o.id ? '#3E73FF' : 'white'}
            margin={{ right: 'small' }}
            flex={{ shrink: 0 }}
            style={{ height: 20, width: 20, borderRadius: '50%' }}
            className="single-select-border"
          />
          <Text>{translate(o.name, language)}</Text>
        </Box>
      ))}
    </Box>
  )
}

const SingleSelectRadio: React.FC<Props> = (props) => {
  const { question } = props
  const { language } = useContext(LanguageContext)
  const { values, setValue } = useContext(FormContext)

  const value = values[question.id]

  if (!question || !question.options) {
    return <Box />
  }

  const selectedOption = question.options.find((o) => o.id === value)
  const nameValue = selectedOption ? translate(selectedOption.name, language) : undefined

  return (
    <RadioButtonGroup
      name={translate(question.name, language)}
      options={question.options.map((o) => translate(o.name, language))}
      value={nameValue}
      onChange={(e) =>
        setValue(question, question.options?.find((o) => translate(o.name, language) === e.target.value)!.id)
      }
    />
  )
}

export default SingleSelectRadio
