import React from 'react'
import { Question } from '../../forms/types'
import TextInput from './TextInput'

interface Props {
  question: Question
}

const validate = (value: string) => {
  return undefined
}

export const Email: React.FC<Props> = (props) => {
  return <TextInput question={props.question} validate={validate} />
}
