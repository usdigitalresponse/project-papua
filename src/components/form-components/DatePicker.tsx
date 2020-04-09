import React, { useState } from 'react'
import ReactDatePicker from 'react-date-picker'
import "./date-picker.css"
import { Icon } from 'evergreen-ui'


const DatePicker: React.FC<{}> = () => {
  const [startDate, setStartDate] = useState(new Date());

  return (
    <ReactDatePicker
      className="date-picker"
      onChange={date => setStartDate(date as Date)}
      value={startDate}
      calendarIcon={<Icon icon="calendar" color="black" />}
      clearIcon={null}
    />
  );

}

export default DatePicker