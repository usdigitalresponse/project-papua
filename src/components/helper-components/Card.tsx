import React from 'react'
import { Box } from 'grommet'

const Card: React.FC<any> = (props) => {
  const { children, ...otherProps } = props
  return (
    <Box
      className="card"
      style={{
        border: '1px solid #CCCCCC',
        borderRadius: '8px',
      }}
      {...otherProps}
    >
      {children}
    </Box>
  )
}

export default Card
