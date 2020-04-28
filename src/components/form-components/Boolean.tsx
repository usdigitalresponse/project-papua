import React, { useContext } from 'react'
import { Question } from '../../lib/types'
import SingleSelect from './SingleSelect'
import { FormContext } from '../../contexts/form'

interface Props {
  [key: string]: any
  question: Question
  onChange: (val: string) => void
}

const Boolean: React.FC<Props> = (props) => {
  const { form, setValue } = useContext(FormContext)

  const question = props.question
  question.options = [
    {
      id: 'true',
      name: form.instructions['yes'],
    },
    {
      id: 'false',
      name: form.instructions['no'],
    },
  ]

  // Override the SingleSelect's onChange in order to cast the ID (string) to a boolean.
  const onChange = (id: string) => {
    setValue(question, id === 'true')
  }

  return <SingleSelect question={question} onChange={onChange} />
}

export default Boolean
