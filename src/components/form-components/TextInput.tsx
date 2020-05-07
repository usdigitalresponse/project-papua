import React, { useContext } from 'react'
import { TextInput as GrommetTextInput } from 'grommet'
import { FormContext } from '../../contexts/form'
import { Question } from '../../lib/types'

interface Props {
  question: Question
}

const TextInput: React.FC<Props> = (props) => {
  const { question } = props
  const { values, setValue, errors } = useContext(FormContext)
  const value = values[question.id]

  const hasError = Boolean(errors[question.id])
  return (
    <GrommetTextInput
      value={(value as string) || ''}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(question, e.target.value)}
      style={{ border: hasError ? '#FF4040 1px solid' : 'black 1px solid', maxWidth: '600px' }}
    />
  )
}

export default TextInput
