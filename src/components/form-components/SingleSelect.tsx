import React, { useContext } from 'react'
import { Question } from '../../lib/types'
import { Box, RadioButtonGroup } from 'grommet'
import { FormContext } from '../../contexts/form'

interface Props {
  question: Question
  onChange?: (id: string) => void
}

const SingleSelectRadio: React.FC<Props> = (props) => {
  const { question } = props
  const { values, setValue, translateCopy } = useContext(FormContext)

  const value = values[question.id]

  if (!question || !question.options) {
    return <Box />
  }

  const options = question.options.map((o) => {
    const v = `${question.id}:${o.id}`
    return {
      id: v,
      value: v,
      name: v,
      label: translateCopy(o.name),
    }
  })

  return (
    <Box className="radio-button-group" pad={{ horizontal: 'large' }}>
      <RadioButtonGroup
        name={translateCopy(question.name) || ''}
        options={options}
        value={`${question.id}:${value}`}
        onChange={(e) => {
          const id = e.target.value.split(':')[1]
          props.onChange ? props.onChange(id) : setValue(question, id)
        }}
        gap="16px"
      />
    </Box>
  )
}

export default SingleSelectRadio
