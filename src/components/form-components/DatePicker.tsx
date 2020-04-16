import React, { useState, useContext } from 'react'
import ReactDatePicker from 'react-date-picker'
import "./date-picker.css"
import { Question } from '../../forms/types'
import { FormContext } from '../../contexts/form'


const DatePicker: React.FC<{ question: Question }> = (props) => {
  const { question } = props
  const { values, setValue } = useContext(FormContext)

  return (
    <ReactDatePicker
      className="date-picker"
      onChange={date => setValue(question.id, date as Date)}
      value={values[question.id] as Date}
      clearIcon={null}
    />
  );

}

export default DatePicker