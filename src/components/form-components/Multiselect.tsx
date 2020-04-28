import React, { useContext } from 'react'
import { Question } from '../../lib/types'
import { Box, CheckBox } from 'grommet'
import './single-select.css'
import { FormContext } from '../../contexts/form'

interface Props {
  value: string[]
  question: Question
  onChange: (val: string[]) => void
  [key: string]: any
}

const Multiselect: React.FC<Props> = (props) => {
  const { question } = props
  const { values, setValue, translateCopy } = useContext(FormContext)
  const value = values[question.id] as string[] | string

  const onSelectValue = (option: string) => {
    if (!value) {
      return setValue(question, [option])
    }
    if (!Array.isArray(value)) {
      return setValue(question, [value, option])
    }
    if (value.includes(option)) {
      return setValue(
        question,
        value.filter((val) => val !== option)
      )
    }

    setValue(question, [...value, option])
  }

  if (!question || !question.options) {
    return <Box />
  }

  return (
    <Box>
      {question.options.map((o) => {
        const isSelected = Boolean(value && value.includes(o.id))
        return (
          <CheckBox
            key={o.id}
            style={{
              marginTop: '8px',
            }}
            checked={isSelected}
            label={translateCopy(o.name)}
            onChange={() => onSelectValue(o.id)}
          />
        )
      })}
    </Box>
  )
}

export default Multiselect
