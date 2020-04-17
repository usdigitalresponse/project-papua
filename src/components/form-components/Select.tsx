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


  // Have to save value as the id of the option, not the translated name.
  const getId = (name: string): string => question.options!.find(o => translate(o.name, language) === name)?.id || ''
  const getValue = (id: string): string => value ? translate(question.options!.find(o => o.id === value)?.name!, language) : ''


  return (
    <GrommetSelect
      // TODO: we should translate these a11y titles if we want to use them
      a11yTitle="select language"
      margin={{ top: 'xsmall' }}
      options={options}

      value={getValue(value as string)}
      onChange={({ option }) => setValue(question.id, getId(option))}

      id={question.id}
      name={translate(question.name, language)}
    />
  )
}
export default Select
