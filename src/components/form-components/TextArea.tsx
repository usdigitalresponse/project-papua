import React from 'react'
import { Textarea as EvergreenTextArea } from 'evergreen-ui'
import { Question } from '../../forms/types'

interface Props {
  value: string
  question: Question
  onChange: (val: string) => void
  [key: string]: any
}

const TextArea: React.FC<Props> = (props) => {
  return <EvergreenTextArea {...props} border="black 1px solid !important" />
}

export default TextArea