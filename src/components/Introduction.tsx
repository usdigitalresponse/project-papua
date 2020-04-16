import React, { useContext } from 'react'
import { Box, Heading, Paragraph, Text } from 'grommet'
import { getInstructionalCopy } from '../forms/index';
import { LanguageContext } from '../contexts/language'

const Introduction: React.FC = () => {
  const { language } = useContext(LanguageContext)

  return (
    <>
      <Box pad="medium">
        <Heading level={3} color="black" margin={{ top: 'none', bottom: 'none' }}>{getInstructionalCopy('welcome')[language]}</Heading>
        <Paragraph fill={true} color="black">
          {getInstructionalCopy('intro')[language]}
          <br />
          <Text weight={600}>{getInstructionalCopy('prereqs')[language]}</Text>
          <ol color="black">
            <li color="black">{getInstructionalCopy('prereqs:ssn')[language]}</li>
            <li color="black">{getInstructionalCopy('prereqs:agi')[language]}</li>
            <li color="black">{getInstructionalCopy('prereqs:employment')[language]}</li>
            <li color="black">{getInstructionalCopy('prereqs:arn')[language]}</li>
            <li color="black">{getInstructionalCopy('prereqs:children')[language]}</li>
            <li color="black">{getInstructionalCopy('prereqs:license')[language]}</li>
            <li color="black">{getInstructionalCopy('prereqs:bank')[language]}</li>
          </ol>
        </Paragraph>
      </Box>
      <Box style={{ position: "relative" }}>
        <Box style={{ position: "absolute", height: "100%", width: "8px", backgroundColor: "#FFAE00" }} />
        <Box pad={{ vertical: 'none', horizontal: 'medium' }}>
          <Paragraph color="black" fill={true}>
            <Text color="black" weight={600}>{getInstructionalCopy('warning')[language]}:</Text>
            <br />
            {getInstructionalCopy('warning:content')[language]}
          </Paragraph>
        </Box>
      </Box>
    </>
  )
}

export default Introduction
