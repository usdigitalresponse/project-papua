import React from 'react'
import { Box } from 'grommet'

interface Props {}

/**
 * The USDR component wraps an underlying component with USDR branding.
 */
export const USDR: React.FC<Props> = (props) => {
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
    <Box width="#0050d8" background={{ color: '#0050d8' }} justify="between">
      <Box>Left</Box>
      <Box>Right</Box>
    </Box>
  )
}

const Footer: React.FC = () => {
  return null
}
