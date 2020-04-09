import React from 'react'
import { Select as EvergreenSelect } from 'evergreen-ui'
import './select.css'
import { Question } from '../../forms/types'

interface Props {
  [key: string]: any
  question: Question
}

const Select: React.FC<Props> = (props) => {
  return (
    <EvergreenSelect {...props} className="styled-select" color="black">
      {props.question.options?.map(o => <option value={o.id} key={o.id}>{o.name}</option>)}
    </EvergreenSelect>
  )
}
export default Select