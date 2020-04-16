import React from 'react'
import { Question } from '../../forms/types'
import SingleSelect from './SingleSelect'
import { getCopy } from '../../forms/index'

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
    name: getCopy("yes")
  },
  {
    id: 'false',
    name: getCopy("no")
  }]

  return <SingleSelect onChange={onChange} value={value} question={question} />
}

export default Boolean
