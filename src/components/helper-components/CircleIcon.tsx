import React from 'react'
import { Box, BoxProps } from 'grommet'
import './circle-icon.css'

export interface Props {
  color: string
  size?: number
}

export const CircleIcon: React.FC<Props & BoxProps & JSX.IntrinsicElements['div']> = (props) => {
  const { color, ...otherProps } = props
  const s = `${props.size || 20}px`
  const b = `${(props.size || 20) / 2}px`

  return (
    <Box
      style={{ height: s, width: s, borderRadius: b }}
      background={{ color }}
      flex={{ shrink: 0 }}
      justify="center"
      align="center"
      className="circle-icon"
      margin="none"
      {...otherProps}
    >
      {props.children}
    </Box>
  )
}
