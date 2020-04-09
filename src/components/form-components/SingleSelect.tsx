import React from 'react'
import { Question } from '../../forms/types'
import { Pane, majorScale } from 'evergreen-ui'
import './single-select.css'

interface Props {
  value: string
  question: Question
  onChange: (val: string) => void
  [key: string]: any
}

const SingleSelect: React.FC<Props> = (props) => {
  const { question, onChange, value } = props
  if (!question || !question.options) {
    return <Pane />
  }
  return (
    <Pane>
      {question.options.map(o => (
        <Pane onClick={() => onChange(o.id)} cursor="pointer" background={value === o.id ? "#EBFFFA" : "white"} alignItems="flex-start" display="flex" key={o.id} marginBottom={majorScale(1)} className="single-select-border single-select" padding={majorScale(1)}>
          <Pane background={value === o.id ? "#008060" : "white"} borderRadius="50%" marginRight={majorScale(2)} flexBasis={20} flexShrink={0} height={20} width={20} className="single-select-border" />
          <Pane>{o.name}</Pane>
        </Pane>
      ))}
    </Pane>
  )
}

export default SingleSelect