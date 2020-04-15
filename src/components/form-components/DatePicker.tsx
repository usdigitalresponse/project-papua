import React, { useState } from 'react'
import ReactDatePicker from 'react-date-picker'
import "./date-picker.css"


const DatePicker: React.FC<{}> = () => {
  const [startDate, setStartDate] = useState(new Date());

  return (
    <ReactDatePicker
      className="date-picker"
      onChange={date => setStartDate(date as Date)}
      value={startDate}
      clearIcon={null}
    />
  );

}

export default DatePicker