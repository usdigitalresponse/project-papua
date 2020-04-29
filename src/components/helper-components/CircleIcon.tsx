import React from 'react'
import { Box, BoxProps } from 'grommet'
import './circle-icon.css'

export interface Props {
  color: string
}

export const CircleIcon: React.FC<Props & BoxProps & JSX.IntrinsicElements['div']> = (props) => {
  const { color, ...otherProps } = props

  return (
    <Box
      style={{ height: '20px', width: '20px', borderRadius: '12px' }}
      background={{ color }}
      flex={true}
      justify="center"
      align="center"
      className="circle-icon"
      {...otherProps}
    >
      {props.children}
    </Box>
  )
}
