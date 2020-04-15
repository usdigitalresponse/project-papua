import React from 'react'
import './select.css'
import { Question, Option } from '../../forms/types'
import { Select as GrommetSelect, Box } from 'grommet'

interface Props {
  [key: string]: any
  question?: Question
}

const Select: React.FC<Props> = (props) => {
  if (!props.question) {
    return <Box />
  }

  const options = props.question!.options!.map((option: Option) => option.name)

  return (
    <GrommetSelect
      a11yTitle="select language"
      margin={{ top: 'xsmall' }}
      options={options}
      value={props.value}
      onChange={({ option }) => props.onChange(option)}
      id={props.question.id}
      name={props.question.name}
    />
  )
}
export default Select