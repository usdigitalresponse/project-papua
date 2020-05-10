import React from 'react'

const Caret: React.FC<{ open: boolean }> = (props) => {
  return (
    <svg
      transform={props.open ? 'rotate(90)' : undefined}
      width="9"
      height="14"
      viewBox="0 0 9 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="caret"
    >
      <path d="M1 1L7 7L1 13" stroke="#333333" strokeWidth="2" />
    </svg>
  )
}

export default Caret
