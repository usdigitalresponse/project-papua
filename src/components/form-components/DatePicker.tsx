import React, { useContext } from 'react'
import ReactDatePicker from 'react-date-picker'
import './date-picker.css'
import { Question } from '../../lib/types'
import { FormContext } from '../../contexts/form'
import moment from 'moment'
import { Box } from 'grommet'

const DatePicker: React.FC<{ question: Question }> = (props) => {
  const { question } = props
  const { values, setValue } = useContext(FormContext)
  const value = values[question.id] as string | undefined

  let v: Date | undefined
  if (value) {
    v = moment(value, 'YYYY-MM-DDTHH:mm:ssZ', true).toDate()
  }

  const onChange = (date: Date | Date[]) => {
    if (!date) {
      setValue(question, undefined)
      return
    }

    setValue(question, moment.utc(date as Date).format('YYYY-MM-DDTHH:mm:ssZ'))
  }

  /**
   * TODO:
   * - Would be nice if delete moved your cursor to the previous date chunk
   *   for example, pressing delete again after having deleted the year
   *   should move your cursor to the end of your day value.
   * - On mobile, the keyboard pops up. Good/bad??
   * - On defocus, the calendar needs to hide.
   */

  return (
    <Box style={{ maxWidth: '600px' }}>
      <ReactDatePicker className="date-picker" onChange={onChange} value={v} clearIcon={null} calendarIcon={null} />
    </Box>
  )
}

export default DatePicker
