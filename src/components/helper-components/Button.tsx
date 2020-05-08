import React from 'react'
import { Button as GrommetButton, ButtonProps } from 'grommet'

const Button: React.FC<ButtonProps & Omit<JSX.IntrinsicElements['button'], 'color'>> = (props) => {
  const { primary } = props

  let p = props
  if (primary) {
    p = {
      className: 'primary-button',
      ...p,
    }
  }

  return <GrommetButton fill={false} {...p} />
}

export default Button
