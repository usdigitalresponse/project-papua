import React from 'react'
import { Question } from '../../forms/types'
import { TextArea as GrommetTextArea } from 'grommet'

interface Props {
  value: string
  question: Question
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  [key: string]: any
}

const TextArea: React.FC<Props> = (props) => {
  return <GrommetTextArea {...props} />
}

export default TextArea