import React, { useContext } from 'react'
import { Question } from '../../lib/types'
import { Box } from 'grommet'
import { FormContext } from '../../contexts/form'
import { StyledSelect } from '../helper-components/StyledSelect'

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
    <Box pad={{ horizontal: 'large' }}>
      <StyledSelect
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
    </Box>
  )
}
export default Select
