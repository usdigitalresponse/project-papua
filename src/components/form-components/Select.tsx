import React, { useContext } from 'react'
import './select.css'
import { Question, Option } from '../../forms/types'
import { Select as GrommetSelect, Box } from 'grommet'
import { LanguageContext } from '../../contexts/language'
import { translate } from '../../forms/index'


interface Props {
  [key: string]: any
  question?: Question
}

const Select: React.FC<Props> = (props) => {
  const { language } = useContext(LanguageContext)

  if (!props.question) {
    return <Box />
  }

  const options = props.question!.options!.map((option: Option) => translate(option.name, language))

  return (
    <GrommetSelect
      // TODO: we should translate these a11y titles if we want to use them
      a11yTitle="select language"
      margin={{ top: 'xsmall' }}
      options={options}
      value={props.value}
      onChange={({ option }) => props.onChange(option)}
      id={props.question.id}
      name={translate(props.question.name, language)}
    />
  )
}
export default Select
