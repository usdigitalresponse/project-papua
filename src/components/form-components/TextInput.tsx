import React, { useContext } from 'react'
import { TextInput as GrommetTextInput } from 'grommet'
import { FormContext } from '../../contexts/form'

const TextInput: React.FC<any> = (props) => {
  const { question } = props
  const { values, setValue } = useContext(FormContext)
  return <GrommetTextInput value={values[question.id] as string} onChange={e => setValue(question.id, e.target.value)} color="black" />
}

export default TextInput