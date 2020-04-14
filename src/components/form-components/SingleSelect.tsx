import React from 'react'
import { Question } from '../../forms/types'
import { Box, Text } from 'grommet'
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
    return <Box />
  }
  return (
    <Box>
      {question.options.map(o => (
        <Box onClick={() => onChange(o.id)} background={value === o.id ? "#EBFFFA" : "white"} key={o.id} margin={{ bottom: 'xsmall' }} style={{ borderRadius: '4px' }} direction="row" className="single-select-border single-select" pad='small'>
          <Box background={value === o.id ? "#008060" : "white"} margin={{ right: 'small' }} flex={{ shrink: 0 }} style={{ height: 20, width: 20, borderRadius: '50%' }} className="single-select-border" />
          <Text>{o.name}</Text>
        </Box>
      ))}
    </Box>
  )
}

export default SingleSelect