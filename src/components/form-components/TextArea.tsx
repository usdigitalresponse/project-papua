import React, { useContext } from 'react'
import { Question } from '../../forms/types'
import { TextArea as GrommetTextArea } from 'grommet'
import { FormContext } from '../../contexts/form'

interface Props {
  question: Question
  [key: string]: any
}

const TextArea: React.FC<Props> = (props) => {
  const { question } = props
  const { values, setValue, errors } = useContext(FormContext)
  const hasError = errors[question.id]

  return (
    <GrommetTextArea
      value={values[question.id] as string}
      onChange={(e) => setValue(question, e.target.value)}
      style={{ border: hasError ? '#FF4040 1px solid' : 'black 1px solid' }}
    />
  )
}

export default TextArea
