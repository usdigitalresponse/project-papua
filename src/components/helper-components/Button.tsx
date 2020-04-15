import React from 'react'
import { Button as GrommetButton } from 'grommet'

const Button: React.FC<any> = (props) => {
  return <GrommetButton fill={false} box={true} {...props} />
}

export default Button