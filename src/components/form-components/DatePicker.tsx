import React, { useContext } from 'react'
import ReactDatePicker from 'react-date-picker'
import './date-picker.css'
import { Question } from '../../forms/types'
import { FormContext } from '../../contexts/form'

const DatePicker: React.FC<{ question: Question }> = (props) => {
  const { question } = props
  const { values, setValue } = useContext(FormContext)
  const value = values[question.id] as string | undefined

  return (
    <ReactDatePicker
      className="date-picker"
      onChange={(date) => setValue(question, (date as Date).toISOString())}
      value={value ? new Date(value as string) : undefined}
      clearIcon={null}
    />
  )
}

export default DatePicker
