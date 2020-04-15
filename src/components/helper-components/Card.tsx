import React from 'react'
import { Box } from 'grommet'

const Card: React.FC<any> = (props) => {
  const { children, ...otherProps } = props
  return (
    <Box className="card" {...otherProps}>
      {children}
    </Box >)
}

export default Card

