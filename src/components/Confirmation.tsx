import React, { useContext } from 'react'
import { FormContext } from '../contexts/form'
import { Heading, Box, Paragraph } from 'grommet'
import { Markdown } from './helper-components/Markdown'
import Button from './helper-components/Button'
import { Clipboard } from 'grommet-icons'
import copy from 'copy-to-clipboard'

export interface Props {
  id: string
}

export const Confirmation: React.FC<Props> = (props) => {
  const { translateByID, form } = useContext(FormContext)

  const onCopy = () => {
    copy(props.id)
  }

  const onExit = () => {
    const domain = form.variables?.['DOMAIN']
    if (domain) {
      window.location.href = `https://${domain}`
    }
  }

  return (
    <Box direction="column" justify="start">
      {/* Instructions */}
      <Box pad={{ horizontal: '48px', top: '48px', bottom: 'none' }}>
        <Heading margin="none" level={3}>
          {translateByID('confirmation-heading')}
        </Heading>
        <Markdown>
          {translateByID('confirmation-instructions', {
            // NOTE: this is a hack for demos -- if we forgot to fill out the first and last name
            // and then skip ahead to the confirmation (past all of the validation that would
            // ensure you've provided a name), then we would render something ugly like
            // Hello, {{id:first_name}} {{id_last_name}}!
            //
            // YUCK! Let's instead fallback on a hardcoded name just in case we forgot
            // (it's a demo after all!).
            'id:first_name': 'John',
            'id:last_name': 'Doe',
          })}
        </Markdown>
      </Box>
      {/* Confirmation number + copy button */}
      <Box
        background={{ color: '#F6F7F9' }}
        direction="row"
        pad={{ horizontal: '48px', vertical: '16px' }}
        justify="between"
      >
        <Box direction="column">
          <Paragraph size="small" margin={{ top: 'none', bottom: 'small' }}>
            {translateByID('confirmation-number')}
          </Paragraph>
          <Paragraph size="large" margin="none">
            {props.id}
          </Paragraph>
        </Box>
        <Box height="100%" justify="center" pad={{ top: '16px' }}>
          <Button
            color={'black'}
            onClick={onCopy}
            label={translateByID('copy')}
            reverse={true}
            icon={<Clipboard size="small" color="black" />}
          />
        </Box>
      </Box>
      {/* Warning */}
      <Box style={{ position: 'relative' }} margin={{ vertical: '16px' }} direction="row">
        <Box
          style={{
            position: 'absolute',
            height: '100%',
            width: '8px',
            backgroundColor: '#FFAE00',
          }}
        />
        <Box pad={{ vertical: 'none', horizontal: '48px' }}>
          <Markdown>{translateByID('confirmation-warning')}</Markdown>
        </Box>
      </Box>
      {/* Exit button */}
      <Box direction="row" justify="between" margin={{ horizontal: '48px', vertical: '16px' }}>
        <Box />
        <Box>
          <Button
            color="#3E73FF"
            primary={true}
            onClick={onExit}
            label={translateByID('confirmation-exit')}
            size="small"
          />
        </Box>
      </Box>
    </Box>
  )
}
