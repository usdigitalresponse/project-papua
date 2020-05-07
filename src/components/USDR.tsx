import React from 'react'
import { Box, Text } from 'grommet'

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
    <Box width="#0050d8" background={{ color: '#FFFFFF' }} pad="16px" elevation="xsmall" align="center">
      <Box width="100%" justify="start" style={{ maxWidth: '1200px' }}>
        <Text>Pandemic Unemployment Assistance Demo</Text>
      </Box>
    </Box>
  )
}

const Footer: React.FC = () => {
  return null
}
