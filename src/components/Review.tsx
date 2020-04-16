import React, { useContext } from 'react'
import { Box, Heading } from 'grommet'
import { getInstructionalCopy } from '../forms/index'
import { LanguageContext } from '../contexts/language'

const Review: React.FC<{}> = () => {
  const { language } = useContext(LanguageContext)

  return (
    <Box pad="medium">
      <Heading margin="none" level={3}>{getInstructionalCopy('submit')[language]}</Heading>
    </Box>
  )
}

export default Review
