import React from 'react'
import { Box, Heading, Image } from 'grommet'

/**
 * The USDR component wraps an underlying component with USDR branding.
 */
export const USDR: React.FC = (props) => {
  /**
   * - Header with USDR logo, app name, link to GitHub
   * - Footer with "built by etc", links to socials
   */
  return (
    <Box direction="column">
      <Box>
        <Header />
      </Box>

      <Box>{props.children}</Box>

      <Box>
        <Footer />
      </Box>
    </Box>
  )
}

const Header: React.FC = () => {
  return (
    <Box background={{ color: '#FFFFFF' }} elevation="xsmall" align="center">
      <Box
        width="100%"
        justify="start"
        style={{ maxWidth: '1200px' }}
        pad={{ horizontal: 'medium', vertical: '16px' }}
        direction="row"
        align="center"
      >
        <Image width="26px" src="./USDR-icon-BW.png" margin={{ right: '8px' }} />
        <Heading level={4} margin="none">
          Pandemic Unemployment Assistance Demo
        </Heading>
      </Box>
    </Box>
  )
}

const Footer: React.FC = () => {
  return null
}
