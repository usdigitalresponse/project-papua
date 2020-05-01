import React, { useContext } from 'react'
import './select.css'
import { Question } from '../../lib/types'
import { Select as GrommetSelect, Box } from 'grommet'
import { FormContext } from '../../contexts/form'

interface Props {
  [key: string]: any
  question: Question
}

const Select: React.FC<Props> = (props) => {
  const { question } = props
  const { values, setValue, translateCopy } = useContext(FormContext)
  const value = values[question.id]

  if (!props.question) {
    return <Box />
  }

  if (!question.options) {
    console.error('expected question to have options')
    return null
  }

  const options = question.options.map((option) => ({ name: translateCopy(option.name), id: option.id }))

  return (
    <GrommetSelect
      a11yTitle={translateCopy(question.name)}
      margin={{ top: 'xsmall' }}
      options={options}
      labelKey="name"
      valueKey={{
        key: 'id',
        reduce: true,
      }}
      value={value as string}
      onChange={({ option }: { option: { id: string; name: string } }) => setValue(question, option.id)}
    />
  )
}
export default Select
