import React, { useContext } from 'react'
import { TextInput as GrommetTextInput } from 'grommet'
import { FormContext } from '../../contexts/form'

const TextInput: React.FC<any> = (props) => {
  const { question } = props
  const { values, setValue, errors } = useContext(FormContext)

  const hasError = Boolean(errors[question.id])
  return <GrommetTextInput value={values[question.id] as string} onChange={e => setValue(question, e.target.value)} color="black" style={{ border: hasError ? '#FF4040 1px solid' : 'black 1px solid' }} />
}

export default TextInput
