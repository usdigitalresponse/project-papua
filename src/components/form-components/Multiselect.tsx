import React, { useState } from 'react'
import { Question } from '../../forms/types'
import { Pane, majorScale } from 'evergreen-ui'
import './single-select.css'

interface Props {
  value: string[]
  question: Question
  onChange: (val: string[]) => void
  [key: string]: any
}

const Multiselect: React.FC<Props> = (props) => {
  const { question, onChange, value } = props

  const onSelectValue = (option: string) => {
    if (!value) {
      return onChange([option])
    }
    if (!Array.isArray(value)) {
      return onChange([value, option])
    }
    if (value.includes(option)) {
      return onChange(value.filter(val => val !== option))
    }

    onChange([...value, option])
  }

  if (!question || !question.options) {
    return <Pane />
  }

  return (
    <Pane>
      {question.options.map(o => {
        const isSelected = value && value.includes(o.id)
        return (
          <Pane onClick={() => onSelectValue(o.id)} cursor="pointer" background={isSelected ? "#EBFFFA" : "white"} alignItems="flex-start" display="flex" key={o.id} marginBottom={majorScale(1)} className="single-select-border single-select" padding={majorScale(1)}>
            <Pane background={isSelected ? "#008060" : "white"} borderRadius="50%" marginRight={majorScale(2)} flexBasis={20} flexShrink={0} height={20} width={20} className="single-select-border" />
            <Pane>{o.name}</Pane>
          </Pane>
        )
      })}
    </Pane>
  )
}

export default Multiselect