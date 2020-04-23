import React, { useContext, useState } from 'react'
import { Box, Heading, Button, Text } from 'grommet'
import Amplify, { API } from 'aws-amplify'
import { FormContext } from '../contexts/form'
import { v5 as uuid } from 'uuid'
import Summary from './Summary'

import awsconfig from '../aws-exports'
import { Page } from '../forms/types'
Amplify.configure(awsconfig)

interface Props {
  pages: Page[]
  setPage: (index: number) => void
}

const Review: React.FC<Props> = (props) => {
  const { pages, setPage } = props
  const { values, translateByID } = useContext(FormContext)

  const [canSubmit, setCanSubmit] = useState(true)

  const onSubmit = async () => {
    setCanSubmit(false)
    try {
      const resp = await API.post('resolverAPI', '/claims', {
        body: {
          metadata: {
            uuid: uuid(window.location.hostname, uuid.DNS),
            timestamp: new Date(),
            host: window.location.hostname,
          },
          questions: values,
        },
      })
      console.log(resp)
    } catch (err) {
      setCanSubmit(true)
      console.error(err)
    }
  }

  return (
    <Box style={{ padding: '48px' }}>
      <Heading margin="none" level={3}>
        {translateByID('submit')}
      </Heading>

      <br />
      <Text>{translateByID('submit:instructions-1')}</Text>
      <br />

      <Text>{translateByID('submit:instructions-2')}</Text>
      <Summary setPage={setPage} values={values} pages={pages} />
      <Button
        margin={{ top: 'small' }}
        color="black !important"
        onClick={onSubmit}
        disabled={!canSubmit}
        label={translateByID('submit:button')}
      />
    </Box>
  )
}

export default Review
