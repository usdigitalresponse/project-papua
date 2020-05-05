import React, { useState, useContext } from 'react'
import { Card, Button, Markdown } from './helper-components'
import { Box, ResponsiveContext, Heading } from 'grommet'
import Sidebar from './Sidebar'
import Review from './Review'
import { FormContext } from '../contexts/form'
import Amplify, { API } from 'aws-amplify'
import awsconfig from '../aws-exports'
import { v5 as uuid } from 'uuid'
import { Confirmation } from './Confirmation'
import Question from './Question'

Amplify.configure(awsconfig)

const Form: React.FC<{}> = () => {
  const { form, translateByID, translateCopy, completion, pageIndex, setPage, values } = useContext(FormContext)
  const size = useContext(ResponsiveContext)

  const [canSubmit, setCanSubmit] = useState(true)
  const [claimID, setClaimID] = useState<string>()

  const onSubmit = async () => {
    setCanSubmit(false)
    try {
      /**
       * TODO: clear any subquestion values if the subquestion is hidden, s.t. we don't submit those values.
       *
       * We should only do this at submission time, so that users can toggle switches without losing
       * their WIP content.
       */
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
      setClaimID(resp.id)
    } catch (err) {
      setCanSubmit(true)
      console.error(JSON.stringify(err.response.data, null, 2))
    }
  }

  const pageTitles = [...form.pages.map((page) => translateCopy(page.title)), translateByID('submit')]

  const padding = size === 'small' ? '12px' : '24px'
  const pageComponents = [
    ...form.pages.map((page) => (
      <Box
        pad={{ horizontal: padding, top: padding, bottom: 'none' }}
        direction="column"
        justify="start"
        key={page.heading.en}
      >
        <Heading color="black" margin="none" level={3}>
          {translateCopy(page.heading)}
        </Heading>
        {page.instructions && <Markdown size="small">{translateCopy(page.instructions)}</Markdown>}
        <Box margin={{ bottom: 'medium' }}></Box>
        {page.questions.map((question) => (
          <Question question={question} key={question.id} />
        ))}
      </Box>
    )),
    <Review key="review" pages={form.pages} />,
  ]

  const onClickNext = () => setPage(pageIndex + 1)
  const onClickBack = () => setPage(pageIndex - 1)

  return (
    <Box align="center" pad="medium" direction="column" width={{ max: '1200px' }} margin="auto">
      <Box width="100%" height="100%" justify="center" direction={size === 'small' ? 'column' : 'row'}>
        <Card pad="medium" background="white" justify="between" flex={{ grow: 1, shrink: 1 }}>
          {(claimID && <Confirmation id={claimID} />) || (
            <>
              {pageComponents[pageIndex]}
              <Box justify="between" pad="medium" direction="row">
                {(pageIndex > 0 && (
                  <Button border={{ radius: 0 }} color="black" onClick={onClickBack} label={translateByID('back')} />
                )) || <Box />}
                {pageIndex + 1 < pageTitles.length && (
                  <Button
                    color={pageIndex === 0 ? '#3E73FF' : 'black'}
                    onClick={onClickNext}
                    disabled={!completion[pageIndex]}
                    label={pageIndex === 0 ? translateByID('get-started') : translateByID('next')}
                  />
                )}
                {pageIndex === pageTitles.length - 1 && (
                  <Button
                    color={'#3E73FF'}
                    primary={true}
                    onClick={onSubmit}
                    disabled={!canSubmit}
                    label={translateByID('submit:button')}
                  />
                )}
              </Box>
            </>
          )}
        </Card>
        <Sidebar pages={pageTitles} />
      </Box>
    </Box>
  )
}

export default Form
