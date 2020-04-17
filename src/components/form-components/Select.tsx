import React, { useContext } from 'react'
import './select.css'
import { Question } from '../../forms/types'
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

  const options = question.options!.map(option => ({ name: translate(option.name, language), id: option.id }))

  return (
    <GrommetSelect
      a11yTitle={translate(question.name, language)}
      margin={{ top: 'xsmall' }}
      options={options}
      labelKey="name"
      valueKey="id"
      value={value}
      onChange={({ option }: { option: { id: string, name: string } }) => setValue(question, option.id)}
    />
  )
}
export default Select
