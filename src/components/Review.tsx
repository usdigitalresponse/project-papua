import React, { useContext } from 'react'
import { Box, Heading } from 'grommet'
import { getCopy, translate } from '../forms/index';
import { LanguageContext } from '../contexts/language'

const Review: React.FC<{}> = () => {
  const { language } = useContext(LanguageContext)

  return (
    <Box pad="medium">
      <Heading margin="none" level={3}>{translate(getCopy('submit'), language)}</Heading>
    </Box>
  )
}

export default Review
