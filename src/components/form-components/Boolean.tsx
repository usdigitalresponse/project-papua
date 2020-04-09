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
      <Pane onClick={() => onChange('yes')} cursor="pointer" background={value === 'yes' ? "#EBFFFA" : "white"} alignItems="flex-start" display="flex" marginBottom={majorScale(1)} className="single-select-border single-select" padding={majorScale(1)}>
        <Pane background={value === 'yes' ? "#008060" : "white"} borderRadius="50%" marginRight={majorScale(2)} flexBasis={20} flexShrink={0} height={20} width={20} className="single-select-border" />
        <Pane>Yes</Pane>
      </Pane>
      <Pane onClick={() => onChange('no')} cursor="pointer" background={value === 'no' ? "#EBFFFA" : "white"} alignItems="flex-start" display="flex" marginBottom={majorScale(1)} className="single-select-border single-select" padding={majorScale(1)}>
        <Pane background={value === 'no' ? "#008060" : "white"} borderRadius="50%" marginRight={majorScale(2)} flexBasis={20} flexShrink={0} height={20} width={20} className="single-select-border" />
        <Pane>No</Pane>
      </Pane>
    </Pane>
  )
}

export default Boolean