import React, { useContext, useState } from 'react'
import { Box, Heading, Button, Text } from 'grommet'
import { getCopy, translate } from '../forms/index'
import { LanguageContext } from '../contexts/language'
import Amplify, { API } from 'aws-amplify'
import { FormContext } from '../contexts/form'
import { v5 as uuid } from 'uuid'
import Summary from './Summary'

import awsconfig from '../aws-exports'
import { Page } from '../forms/types'
Amplify.configure(awsconfig)

interface Props {
  pages: Page[]
}

const Review: React.FC<Props> = (props) => {
  const { pages } = props
  const { language } = useContext(LanguageContext)
  const { values } = useContext(FormContext)

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
        {translate(getCopy('submit'), language)}
      </Heading>

      <br />
      <Text>{translate(getCopy('submit:instructions-1'), language)}</Text>
      <br />

      <Text>{translate(getCopy('submit:instructions-2'), language)}</Text>
      <Summary values={values} pages={pages} />
      <Button
        color="black !important"
        onClick={onSubmit}
        disabled={!canSubmit}
        label={translate(getCopy('submit:button'), language)}
      />
    </Box>
  )
}

export default Review
