import React, { useContext } from 'react'
import { FormContext } from '../contexts/form'
import { Heading, Box, Paragraph } from 'grommet'
import { Markdown } from './helper-components/Markdown'
import Button from './helper-components/Button'

export interface Props {
  id: string
}

export const Confirmation: React.FC<Props> = (props) => {
  const { translateByID } = useContext(FormContext)

  const onCopy = () => {
    // TODO
  }

  const onExit = () => {
    // TODO
  }

  return (
    <Box direction="column" justify="start">
      {/* Instructions */}
      <Box pad={{ horizontal: '48px', top: '48px', bottom: 'none' }}>
        <Heading color="black" margin="none" level={3}>
          {translateByID('confirmation-heading')}
        </Heading>
        <Markdown size="small">
          {translateByID('confirmation-instructions', {
            DATE_TIME: 'just now', // TODO: use a real date
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
      <Box background={{ color: 'grey' }} direction="row">
        <Box direction="row">
          <Paragraph>{translateByID('confirmation-number')}</Paragraph>
          <Paragraph>{props.id}</Paragraph>
        </Box>
        <Box>
          <Button onClick={onCopy}>{translateByID('copy')}</Button>
        </Box>
      </Box>
      {/* Warning */}
      <Box direction="row">
        <Box direction="row">
          <Paragraph>{translateByID('confirmation-number')}</Paragraph>
          <Paragraph>{props.id}</Paragraph>
        </Box>
        <Box>
          <Button onClick={onCopy}>{translateByID('copy')}</Button>
        </Box>
      </Box>
      {/* Exit button */}
      <Box direction="row">
        <Box>
          <Button onClick={onExit}>{translateByID('confirmation-exit')}</Button>
        </Box>
      </Box>
    </Box>
  )
}
