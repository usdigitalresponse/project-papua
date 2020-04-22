import React from 'react'
import { states } from '../../forms/states'
import Select from './Select'
import { Question } from '../../forms/types'

interface Props {
  question: Question
}

const StateSelect: React.FC<Props> = (props) => {
  const { question } = props
  question.options = states
  return <Select question={question} />
}

export default StateSelect
