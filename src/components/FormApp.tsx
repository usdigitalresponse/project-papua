import React, { useContext } from 'react'
import { Card, Button, Markdown } from './helper-components'
import { Box, ResponsiveContext } from 'grommet'
import Sidebar from './Sidebar'
import Introduction from './Introduction'
import Review from './Review'
import Form from './Form'
import { FormContext } from '../contexts/form'

const FormApp: React.FC<{}> = () => {
  const { form, translateByID, translateCopy, completion, pageIndex, setPage } = useContext(FormContext)
  const size = useContext(ResponsiveContext)

  const pageTitles = [
    translateByID('introduction'),
    ...form.pages.map((page) => translateCopy(page.title)),
    translateByID('submit'),
  ]

  const pageComponents = [
    <Introduction key="introduction" />,
    ...form.pages.map((page) => <Form page={page} key={page.heading.en} />),
    <Review key="review" pages={form.pages} />,
  ]

  const onClickNext = () => setPage(pageIndex + 1)
  const onClickBack = () => setPage(pageIndex - 1)

  return (
    <Box align="center" pad="medium" direction="column">
      <Card margin={{ bottom: 'small' }} pad="small" background="white">
        <Markdown>{translateByID('demo-warning')}</Markdown>
      </Card>
      <Box width="100%" height="100%" justify="center" direction="row">
        <Card width="50%" background="white" display="flex" justify="between" flexDirection="column" textAlign="left">
          {pageComponents[pageIndex]}
          <Box justify="between" pad="medium" direction="row">
            {(pageIndex > 0 && (
              <Button
                border={{ radius: 0 }}
                color="black"
                onClick={onClickBack}
                hoverIndicator={{
                  color: pageIndex === 0 ? '#3E73FF !important' : 'black !important',
                }}
                label={translateByID('back')}
              />
            )) || <Box />}
            {pageIndex + 1 < pageTitles.length && (
              <Button
                color={pageIndex === 0 ? '#3E73FF' : 'black'}
                onClick={onClickNext}
                disabled={pageIndex > 0 && !completion[pageIndex]}
                label={pageIndex === 0 ? translateByID('get-started') : translateByID('next')}
                hoverIndicator={{
                  color: pageIndex === 0 ? '#3E73FF !important' : 'black !important',
                  style: {
                    color: 'white !important',
                  },
                }}
              />
            )}
          </Box>
        </Card>
        {size !== 'small' && <Sidebar pages={pageTitles} />}
      </Box>
    </Box>
  )
}

export default FormApp
