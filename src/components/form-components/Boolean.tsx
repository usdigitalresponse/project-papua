import React from 'react'
import { Question } from '../../forms/types'
import SingleSelect from './SingleSelect'
interface Props {
  [key: string]: any
  question: Question
  onChange: (val: string) => void
}

const Boolean: React.FC<Props> = (props) => {
  const { onChange, value } = props
  const question = props.question
  question.options = [{
    id: 'true',
    name: 'Yes'
  },
  {
    id: 'false',
    name: 'No'
  }]

  return <SingleSelect onChange={onChange} value={value} question={question} />
}

export default Boolean