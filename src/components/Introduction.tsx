import React, { useContext } from 'react'
import { Box, Heading, Paragraph, Text } from 'grommet'
import { translate, getCopy } from '../forms/index'
import { LanguageContext } from '../contexts/language'

const Introduction: React.FC = () => {
  const { language } = useContext(LanguageContext)

  return (
    <>
      <Box style={{ padding: '48px' }}>
        <Heading level={3} margin={{ top: 'none', bottom: 'small' }} color="black">
          {translate(getCopy('introduction:header'), language)}
        </Heading>
        <Paragraph fill={true} color="black" margin={{ vertical: 'xsmall' }}>
          {translate(getCopy('introduction:welcome'), language)}
        </Paragraph>
        <Paragraph fill={true} color="black" margin={{ vertical: 'xsmall' }}>
          {translate(getCopy('introduction:background'), language)}
        </Paragraph>
        <Paragraph fill={true} color="black" margin={{ vertical: 'xsmall' }}>
          {translate(getCopy('introduction:payment'), language)}
        </Paragraph>

        <Heading level={4} color="black" margin={{ bottom: 'xsmall' }}>
          {translate(getCopy('preparation:header'), language)}
        </Heading>
        <Paragraph fill={true} color="black" margin={{ vertical: 'none' }}>
          {translate(getCopy('preparation:instructions'), language)}
        </Paragraph>
        <ul color="black">
          <Text color="black">
            <li color="black">{translate(getCopy('preparation:ssn'), language)}</li>
          </Text>
          <Text color="black">
            <li color="black">{translate(getCopy('preparation:agi'), language)}</li>
          </Text>
          <Text color="black">
            <li color="black">{translate(getCopy('preparation:employment'), language)}</li>
          </Text>
          <Text color="black">
            <li color="black">{translate(getCopy('preparation:arn'), language)}</li>
          </Text>
          <Text color="black">
            <li color="black">{translate(getCopy('preparation:children'), language)}</li>
          </Text>
          <Text color="black">
            <li color="black">{translate(getCopy('preparation:license'), language)}</li>
          </Text>
          <Text color="black">
            <li color="black">{translate(getCopy('preparation:bank'), language)}</li>
          </Text>
        </ul>

        <Heading level={4} color="black" margin={{ bottom: 'xsmall' }}>
          {translate(getCopy('eligibility:header'), language)}
        </Heading>
        <Paragraph fill={true} color="black" margin={{ vertical: 'none' }}>
          {translate(getCopy('eligibility:instructions'), language)}
        </Paragraph>
        <ul color="black">
          <Text color="black">
            <li color="black">{translate(getCopy('eligibility:workers'), language)}</li>
          </Text>
          <Text color="black">
            <li color="black">{translate(getCopy('eligibility:unemployed'), language)}</li>
          </Text>
          <Text color="black">
            <li color="black">{translate(getCopy('eligibility:no-fault'), language)}</li>
          </Text>
        </ul>
        <Paragraph fill={true} color="black" margin={{ vertical: 'none' }}>
          {translate(getCopy('eligibility:other-state'), language)}
        </Paragraph>
        <Paragraph fill={true} color="black" margin={{ top: 'small', bottom: 'none' }}>
          {translate(getCopy('pandemic-eligibility:instructions'), language)}
        </Paragraph>
        <ol color="black">
          <Text color="black">
            <li color="black">{translate(getCopy('pandemic-eligibility:1'), language)}</li>
          </Text>
          <Text color="black">
            <li color="black">{translate(getCopy('pandemic-eligibility:2'), language)}</li>
          </Text>
          <Text color="black">
            <li color="black">{translate(getCopy('pandemic-eligibility:3'), language)}</li>
          </Text>
          <Text color="black">
            <li color="black">{translate(getCopy('pandemic-eligibility:4'), language)}</li>
          </Text>
          <Text color="black">
            <li color="black">{translate(getCopy('pandemic-eligibility:5'), language)}</li>
          </Text>
          <Text color="black">
            <li color="black">{translate(getCopy('pandemic-eligibility:6'), language)}</li>
          </Text>
          <Text color="black">
            <li color="black">{translate(getCopy('pandemic-eligibility:7'), language)}</li>
          </Text>
          <Text color="black">
            <li color="black">{translate(getCopy('pandemic-eligibility:8'), language)}</li>
          </Text>
          <Text color="black">
            <li color="black">{translate(getCopy('pandemic-eligibility:9'), language)}</li>
          </Text>
          <Text color="black">
            <li color="black">{translate(getCopy('pandemic-eligibility:10'), language)}</li>
          </Text>
          <Text color="black">
            <li color="black">{translate(getCopy('pandemic-eligibility:11'), language)}</li>
          </Text>
          <Text color="black">
            <li color="black">{translate(getCopy('pandemic-eligibility:12'), language)}</li>
          </Text>
        </ol>
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
        <Box style={{ padding: '0px 48px 0px 48px' }}>
          <Heading level={4} color="black" margin="none">
            {translate(getCopy('warning'), language)}
          </Heading>
          <Paragraph color="black" fill={true} margin={{ bottom: 'small' }}>
            {translate(getCopy('warning:content-1'), language)}
          </Paragraph>
          <Paragraph color="black" fill={true} margin={{ top: 'small' }}>
            {translate(getCopy('warning:content-2'), language)}
          </Paragraph>
        </Box>
      </Box>
      <Box style={{ padding: '0px 48px 0px 48px' }}>
        <Heading level={4} color="black" margin={{ bottom: 'xsmall' }}>
          {translate(getCopy('agreement:header'), language)}
        </Heading>
        <Paragraph color="black" fill={true} margin={{ vertical: 'none' }}>
          {translate(getCopy('agreement:instructions'), language)}
        </Paragraph>
      </Box>
    </>
  )
}

export default Introduction
