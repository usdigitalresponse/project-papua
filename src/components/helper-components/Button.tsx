import React from 'react'
import { Button as GrommetButton, ButtonProps, Paragraph } from 'grommet'

const Button: React.FC<ButtonProps & Omit<JSX.IntrinsicElements['button'], 'color'>> = (props) => {
  const { label, ...rest } = props

  return (
    <GrommetButton
      className={props.primary ? 'primary-button' : 'default-button'}
      fill={false}
      gap="xxsmall"
      style={
        props.icon
          ? {
              paddingLeft: props.reverse ? '24px' : '12px',
              paddingRight: props.reverse ? '12px' : '24px',
              paddingTop: '6px',
              paddingBottom: '6px',
            }
          : {
              paddingTop: '6px',
              paddingBottom: '6px',
            }
      }
      label={
        label ? (
          <Paragraph margin="none" style={{ fontWeight: 500 }}>
            {label}
          </Paragraph>
        ) : undefined
      }
      {...rest}
    />
  )
}

export default Button
