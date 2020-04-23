import React, { useContext, useState } from 'react'
import { Box, Heading, Button } from 'grommet'
import Amplify, { API } from 'aws-amplify'
import { FormContext } from '../contexts/form'
import { v5 as uuid } from 'uuid'
import Summary from './Summary'
import { Markdown } from './helper-components/Markdown'

import awsconfig from '../aws-exports'
import { Page } from '../forms/types'
Amplify.configure(awsconfig)

interface Props {
  pages: Page[]
}

const Review: React.FC<Props> = (props) => {
  const { pages } = props
  const { values, translateByID, setPage } = useContext(FormContext)

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
    <Box pad="48px">
      <Heading margin="none" level={3}>
        {translateByID('submit')}
      </Heading>

      <Markdown>{translateByID('submit-instructions')}</Markdown>

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
