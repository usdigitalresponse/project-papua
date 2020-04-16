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
  const { values, setValue } = useContext(FormContext)
  return <GrommetTextArea value={values[question.id] as string} onChange={e => setValue(question.id, e.target.value)} />
}

export default TextArea