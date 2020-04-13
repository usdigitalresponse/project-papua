import React from 'react'
import { RadioGroup, Pane, majorScale } from 'evergreen-ui'
import { Question } from '../../forms/types'

interface Props {
  [key: string]: any
  question: Question
  onChange: (val: string) => void
}

const Boolean: React.FC<Props> = (props) => {
  const { onChange, value } = props

  return (
    <Pane>
      <Pane onClick={() => onChange('true')} cursor="pointer" background={value === 'true' ? "#EBFFFA" : "white"} alignItems="flex-start" display="flex" marginBottom={majorScale(1)} className="single-select-border single-select" padding={majorScale(1)}>
        <Pane background={value === 'true' ? "#008060" : "white"} borderRadius="50%" marginRight={majorScale(2)} flexBasis={20} flexShrink={0} height={20} width={20} className="single-select-border" />
        <Pane>Yes</Pane>
      </Pane>
      <Pane onClick={() => onChange('false')} cursor="pointer" background={value === 'false' ? "#EBFFFA" : "white"} alignItems="flex-start" display="flex" marginBottom={majorScale(1)} className="single-select-border single-select" padding={majorScale(1)}>
        <Pane background={value === 'false' ? "#008060" : "white"} borderRadius="50%" marginRight={majorScale(2)} flexBasis={20} flexShrink={0} height={20} width={20} className="single-select-border" />
        <Pane>No</Pane>
      </Pane>
    </Pane>
  )
}

export default Boolean