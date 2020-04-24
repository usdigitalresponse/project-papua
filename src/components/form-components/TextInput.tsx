import React, { useContext } from 'react'
import { TextInput as GrommetTextInput } from 'grommet'
import { FormContext } from '../../contexts/form'
import { Question, Copy } from '../../forms/types'

interface Props {
  question: Question
  validate?: (value: string) => Copy | undefined
}

const TextInput: React.FC<Props> = (props) => {
  const { question } = props
  const { values, setValue, errors, setError } = useContext(FormContext)

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setValue(question, value)

    // If a validation function was provided, call that and check
    // if we should treat this new value as an error.
    if (props.validate) {
      const error = props.validate(value)
      if (error) {
        setError(question.id, [error])
        return
      }
    }
  }

  const hasError = Boolean(errors[question.id])
  return (
    <GrommetTextInput
      value={values[question.id] as string}
      onChange={onChange}
      color="black"
      style={{ border: hasError ? '#FF4040 1px solid' : 'black 1px solid' }}
    />
  )
}

export default TextInput
