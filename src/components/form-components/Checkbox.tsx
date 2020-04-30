import React, { useContext } from 'react'
import { Question } from '../../lib/types'
import { CheckBox as GrommetCheckBox } from 'grommet'
import { FormContext } from '../../contexts/form'

interface Props {
  question: Question
}

export const Checkbox: React.FC<Props> = (props) => {
  const { question } = props
  const { values, setValue, translateCopy } = useContext(FormContext)

  const value = values[question.id]

  return (
    <GrommetCheckBox
      checked={value === true}
      label={translateCopy(question.options![0].name)}
      onChange={() => setValue(question, !value)}
    />
  )
}
