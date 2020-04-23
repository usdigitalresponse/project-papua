import React, { useContext } from 'react'
import { Question } from '../../forms/types'
import SingleSelect from './SingleSelect'
import { FormContext } from '../../contexts/form'

interface Props {
  [key: string]: any
  question: Question
  onChange: (val: string) => void
}

const Boolean: React.FC<Props> = (props) => {
  const { form } = useContext(FormContext)

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

  return <SingleSelect question={question} />
}

export default Boolean
