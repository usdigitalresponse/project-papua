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

  const onChange = (date: Date | Date[]) => {
    if (!date) {
      setValue(question, undefined)
    }

    let d = moment.utc(date as Date)
    if (d.years() > 999) {
      // We don't care about the hour component, so we truncate to the start
      // of the day. However, we ONLY do this once the user has finished typing in
      // the year. Otherwise, it makes the day jump around.
      // Effectively, we want to wait until they've finished typing in a date before
      // truncating it down to the value we'll store.
      d = d.startOf('day')
    }
    setValue(question, d.format('YYYY-MM-DDTHH:mm:ssZ'))
  }

  /**
   * TODO:
   * - Would be nice if delete moved your cursor to the previous date chunk
   *   for example, pressing delete again after having deleted the year
   *   should move your cursor to the end of your day value.
   * - On mobile, the keyboard pops up. Good/bad??
   * - On defocus, the calendar needs to hide.
   */

  return <ReactDatePicker className="date-picker" onChange={onChange} value={v} clearIcon={null} />
}

export default DatePicker
