import React from 'react'
import { Pane, Heading, majorScale } from 'evergreen-ui'

const Review: React.FC<{}> = () => {
  return (
    <Pane padding={majorScale(4)} display="flex" flexDirection="column">
      <Heading>Review & Submit</Heading>
    </Pane>
  )
}

export default Review