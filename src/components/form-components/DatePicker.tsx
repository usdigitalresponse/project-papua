import React, { useContext } from 'react'
import ReactDatePicker from 'react-date-picker'
import './date-picker.css'
import { Question } from '../../forms/types'
import { FormContext } from '../../contexts/form'
import moment from 'moment'

const DatePicker: React.FC<{ question: Question }> = (props) => {
  const { question } = props
  const { values, setValue } = useContext(FormContext)
  const value = values[question.id] as string | undefined

  return (
    <ReactDatePicker
      className="date-picker"
      onChange={(date) =>
        setValue(
          question,
          moment(date as Date)
            .startOf('day')
            .format('YYYY-MM-DDTHH:mm:ss')
        )
      }
      value={value ? new Date(value as string) : undefined}
      clearIcon={null}
    />
  )
}

export default DatePicker
