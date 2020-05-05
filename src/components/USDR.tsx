import React from 'react'

interface Props {}

/**
 * The USDR component wraps an underlying component with USDR branding.
 */
export const USDR: React.FC<Props> = (props) => {
  /**
   * - Header with USDR logo, app name, link to GitHub
   * - Footer with "built by etc", links to socials
   */
  return <>{props.children}</>
}
