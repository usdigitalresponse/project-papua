import React, { useContext } from 'react'
import ReactDatePicker from 'react-date-picker'
import './date-picker.css'
import { Question } from '../../lib/types'
import { FormContext } from '../../contexts/form'
import moment from 'moment'

const DatePicker: React.FC<{ question: Question }> = (props) => {
  const { question } = props
  const { values, setValue } = useContext(FormContext)
  const value = values[question.id] as string | undefined

  let v: Date | undefined
  if (value) {
    const m = moment(value, 'YYYY-MM-DDTHH:mm:ssZ', true)
    // I wish react-date-picker let you specify the timezone! Instead, it operates
    // in the local time zone and we just want to send day-truncated dates in RFC3339
    // format (which requires a timezone, so we specify UTC).
    //
    // Since we truncate the timezone to UTC on setValue, we need to replace it when
    // we provide a value to the date picker. So we add the current user's timezone
    // offset back to the value to get the original value.
    const offset = new Date().getTimezoneOffset()
    v = m.add(offset, 'minutes').toDate()
  }

  return (
    <ReactDatePicker
      className="date-picker"
      onChange={(date) => {
        setValue(
          question,
          moment
            .utc(date as Date)
            .startOf('day')
            .format('YYYY-MM-DDTHH:mm:ssZ')
        )
      }}
      value={v}
      clearIcon={null}
    />
  )
}

export default DatePicker
