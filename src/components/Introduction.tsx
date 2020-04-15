import React from 'react'
import { Box, Heading, Paragraph, Text } from 'grommet'
interface Props {
  state: string
}

const Introduction: React.FC<Props> = (props) => {
  const { state } = props
  return (
    <>
      <Box pad="medium">
        <Heading level={3} color="black" margin={{ top: 'none', bottom: 'none' }}> Welcome to the {state} Claims System </Heading>
        <Paragraph fill={true} color="black" >The {state} COVID-19 Emergency Unemployment Insurance Benefits Internet Claims Application should be used to request unemployment benefits against income earned, or expected to be earned, in the state of {state}. <br />
          <br />
        If you have worked in another state and have not worked in {state} in the last 18 months, you must contact the unemployment office in the state(s) where you have performed work in the last 18 months.
          <br />
          <br />
          Benefits are paid via Direct Deposit into your checking or savings account. You may also choose to receive an Electronic Payment Card (EPC) to access your benefits.
          <br />
          <br />
          <Text weight={600}>Please note you may need the following information before filing your claim:</Text>
          <ol color="black">
            <li color="black">Your Social Security Number (SSN)</li>
            <li color="black"> Your Adjusted Gross Income from your most recent tax return</li>
            <li color="black">The names, addresses, phone numbers, and dates of employment for all employers where you have worked in the last 18 months.</li>
            <li color="black">Your Alien Registration Number, if applicable.</li>
            <li color="black">The names, Social Security Numbers and dates of birth for all dependent children.</li>
            <li color="black">Your driver's license or state-issued ID number.</li>
            <li color="black">Your bank account and routing number (if you choose direct deposit as your payment option).</li>
          </ol>
        </Paragraph>
      </Box>
      <Box style={{ position: "relative" }}>
        <Box style={{ position: "absolute", height: "100%", width: "8px", backgroundColor: "#FFAE00" }} />
        <Box pad={{ vertical: 'none', horizontal: 'medium' }}>
          <Paragraph color="black" fill={true}>
            <Text color="black" weight={600}> Warning: </Text>
            <br />
              Unless you receive a confirmation number, your claim will not be processed. The {state} Department of Labor and Training will not retain any of the information you enter to file your claim until you receive your confirmation number. The last page of the Internet application will state that your claim has been completed and will give you a confirmation number.
              <br /><br />
              Please print, or record your confirmation number and keep it in a safe place. If you provide an email for the Department to contact you with, it will take up to 72 hours for the system to email your unique confirmation number to you. If you exit or refresh the page before receiving a confirmation number, any information that you have entered will be discarded.
            </Paragraph>
        </Box>
      </Box>

    </>
  )
}

export default Introduction