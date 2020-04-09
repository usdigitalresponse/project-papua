import React from 'react'
import { Page } from '../forms/types'
import { Pane, majorScale, Heading } from 'evergreen-ui'

interface Props {
  page: Page
}

const Form: React.FC<Props> = (props) => {
  const { page } = props
  return (
    <Pane padding={majorScale(4)} display="flex" flexDirection="column">
      <Heading>{page.title}</Heading>
    </Pane>
  )
}

export default Form