import React from 'react'
import { Question } from '../../forms/types'
import { Box, Text } from 'grommet'
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
    return <Box />
  }

  return (
    <Box>
      {question.options.map(o => {
        const isSelected = value && value.includes(o.id)
        return (
          <Box onClick={() => onSelectValue(o.id)} style={{ background: isSelected ? "#EBFFFA" : "white" }} align="start" key={o.id} margin={{ bottom: 'xsmall' }} pad='small' className="single-select-border single-select" direction="row">
            <Box style={{ background: isSelected ? "#008060" : "white", height: 20, width: 20, borderRadius: '50%', flexShrink: 0 }} margin={{ right: 'small' }} className="single-select-border" />
            <Text>{o.name}</Text>
          </Box>
        )
      })}
    </Box>
  )
}

export default Multiselect