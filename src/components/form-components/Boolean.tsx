import React from 'react'
import { Question } from '../../forms/types'
import SingleSelect from './SingleSelect'
import { getInstructionalCopy } from '../../forms/index'

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
    name: getInstructionalCopy("yes")
  },
  {
    id: 'false',
    name: getInstructionalCopy("no")
  }]

  return <SingleSelect onChange={onChange} value={value} question={question} />
}

export default Boolean
