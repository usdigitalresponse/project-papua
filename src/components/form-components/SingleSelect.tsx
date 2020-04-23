import React, { useContext } from 'react'
import { Question } from '../../forms/types'
import { Box, RadioButtonGroup } from 'grommet'
import './single-select.css'
import { FormContext } from '../../contexts/form'

interface Props {
  question: Question
}

/**
 * 
 * @param props "disabled": false,
    "id": "ONE",
    "name": "one",
    "value": "1",
    "label": "one"
 */

const SingleSelectRadio: React.FC<Props> = (props) => {
  const { question } = props
  const { values, setValue, translateCopy } = useContext(FormContext)

  const value = values[question.id]

  if (!question || !question.options) {
    return <Box />
  }

  const options = question.options.map((o) => ({
    id: `${question.id}:${o.id}`,
    value: `${question.id}:${o.id}`,
    name: `${question.id}:${o.id}`,
    label: translateCopy(o.name),
  }))

  return (
    <RadioButtonGroup
      name={translateCopy(question.name)}
      options={options}
      value={`${question.id}:${value}`}
      onChange={(e) => {
        const id = e.target.value.split(':')[1]
        setValue(question, question.options?.find((o) => id === o.id)!.id)
      }}
    />
  )
}

export default SingleSelectRadio
