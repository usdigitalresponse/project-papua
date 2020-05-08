import React from 'react'
import { Box, BoxProps } from 'grommet'

interface Props extends BoxProps {
  ref?: React.Ref<HTMLDivElement>
}

const Card: React.FC<Props> = (props) => {
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
