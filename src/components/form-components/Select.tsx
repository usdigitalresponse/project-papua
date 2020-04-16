import React, { useContext } from 'react'
import './select.css'
import { Question, Option } from '../../forms/types'
import { Select as GrommetSelect, Box } from 'grommet'
import { LanguageContext } from '../../contexts/language'
import { translate } from '../../forms/index'
import { FormContext } from '../../contexts/form'


interface Props {
  [key: string]: any
  question: Question
}

const Select: React.FC<Props> = (props) => {
  const { question } = props
  const { language } = useContext(LanguageContext)
  const { values, setValue } = useContext(FormContext)
  const value = values[question!.id]

  if (!props.question) {
    return <Box />
  }

  const options = question.options!.map((option: Option) => translate(option.name, language))

  return (
    <GrommetSelect
      // TODO: we should translate these a11y titles if we want to use them
      a11yTitle="select language"
      margin={{ top: 'xsmall' }}
      options={options}
      value={value}
      onChange={({ option }) => setValue(question.id, option)}
      id={question.id}
      name={translate(question.name, language)}
    />
  )
}
export default Select
