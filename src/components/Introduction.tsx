import React, { useContext } from 'react'
import { Box, Heading, Paragraph, Text } from 'grommet'
import { translate, getCopy } from '../forms/index'
import { LanguageContext } from '../contexts/language'

const Introduction: React.FC = () => {
  const { language } = useContext(LanguageContext)

  return (
    <>
      <Box pad="medium">
        <Heading level={3} color="black" margin={{ top: 'none', bottom: 'none' }}>
          {translate(getCopy('introduction:header'), language)}
        </Heading>
        <Paragraph fill={true} color="black">
          {translate(getCopy('introduction:welcome'), language)}
          <br />
          <br />
          {translate(getCopy('introduction:background'), language)}
          <br />
          <br />
          {translate(getCopy('introduction:payment'), language)}
          <br />
          <br />
          <Text weight={600}>{translate(getCopy('preparation:header'), language)}</Text>
          <br />
          <Text weight={400}>{translate(getCopy('preparation:instructions'), language)}</Text>
          <ul color="black">
            <li color="black">{translate(getCopy('preparation:ssn'), language)}</li>
            <li color="black">{translate(getCopy('preparation:agi'), language)}</li>
            <li color="black">{translate(getCopy('preparation:employment'), language)}</li>
            <li color="black">{translate(getCopy('preparation:arn'), language)}</li>
            <li color="black">{translate(getCopy('preparation:children'), language)}</li>
            <li color="black">{translate(getCopy('preparation:license'), language)}</li>
            <li color="black">{translate(getCopy('preparation:bank'), language)}</li>
          </ul>
          <br />
          <Text weight={600}>{translate(getCopy('eligibility:header'), language)}</Text>
          <br />
          <Text weight={400}>{translate(getCopy('eligibility:instructions'), language)}</Text>
          <ul color="black">
            <li color="black">{translate(getCopy('eligibility:workers'), language)}</li>
            <li color="black">{translate(getCopy('eligibility:unemployed'), language)}</li>
            <li color="black">{translate(getCopy('eligibility:no-fault'), language)}</li>
          </ul>
          <br />
          <Text weight={400}>{translate(getCopy('eligibility:other-state'), language)}</Text>
          <br />
          <br />
          <Text weight={400}>{translate(getCopy('pandemic-eligibility:instructions'), language)}</Text>
          <ol color="black">
            <li color="black">{translate(getCopy('pandemic-eligibility:1'), language)}</li>
            <li color="black">{translate(getCopy('pandemic-eligibility:2'), language)}</li>
            <li color="black">{translate(getCopy('pandemic-eligibility:3'), language)}</li>
            <li color="black">{translate(getCopy('pandemic-eligibility:4'), language)}</li>
            <li color="black">{translate(getCopy('pandemic-eligibility:5'), language)}</li>
            <li color="black">{translate(getCopy('pandemic-eligibility:6'), language)}</li>
            <li color="black">{translate(getCopy('pandemic-eligibility:7'), language)}</li>
            <li color="black">{translate(getCopy('pandemic-eligibility:8'), language)}</li>
            <li color="black">{translate(getCopy('pandemic-eligibility:9'), language)}</li>
            <li color="black">{translate(getCopy('pandemic-eligibility:10'), language)}</li>
            <li color="black">{translate(getCopy('pandemic-eligibility:11'), language)}</li>
            <li color="black">{translate(getCopy('pandemic-eligibility:12'), language)}</li>
          </ol>
        </Paragraph>
      </Box>
      <Box style={{ position: 'relative' }}>
        <Box
          style={{
            position: 'absolute',
            height: '100%',
            width: '8px',
            backgroundColor: '#FFAE00',
          }}
        />
        <Box pad={{ vertical: 'none', horizontal: 'medium' }}>
          <Paragraph color="black" fill={true}>
            <Text color="black" weight={600}>
              {translate(getCopy('warning'), language)}:
            </Text>
            <br />
            {translate(getCopy('warning:content-1'), language)}
            <br />
            <br />
            {translate(getCopy('warning:content-2'), language)}
          </Paragraph>
        </Box>
      </Box>
      <Box pad="medium">
        <Paragraph fill={true} color="black">
          <Text weight={600}>{translate(getCopy('agreement:header'), language)}</Text>
          <br />
          <Text weight={400}>{translate(getCopy('agreement:instructions'), language)}</Text>
        </Paragraph>
      </Box>
    </>
  )
}

export default Introduction
