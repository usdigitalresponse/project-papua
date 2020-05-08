import React, { useContext } from 'react'
import { Card, Button, Markdown } from './helper-components'
import { Box, ResponsiveContext, Heading } from 'grommet'
import Sidebar from './Sidebar'
import Review from './Review'
import { FormContext } from '../contexts/form'
import Question from './Question'
import { FormPrevious, FormNext } from 'grommet-icons'
import PDF from './PDF'
import { PDFDownloadLink } from '@react-pdf/renderer'

const Form: React.FC<{}> = () => {
  const { form, translateByID, translateCopy, completion, pageIndex, setPage, values } = useContext(FormContext)
  const size = useContext(ResponsiveContext)

  const pageTitles = [...form.pages.map((page) => translateCopy(page.title))]

  const padding = size === 'small' ? '12px' : '24px'
  const pageComponents = [
    ...form.pages.map((page) => (
      <Box
        pad={{ horizontal: padding, top: padding, bottom: 'none' }}
        direction="column"
        justify="start"
        key={page.heading.en}
      >
        <Heading margin="none" level={3}>
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

  const pdf = <PDF form={form} values={values} translateCopy={translateCopy} />

  return (
    <Box align="center" pad="medium" direction="column" width="100%" style={{ maxWidth: '1200px' }}>
      <Box width="100%" height="100%" justify="center" direction={size === 'small' ? 'column' : 'row'}>
        <Card pad="medium" justify="between" flex={{ grow: 1, shrink: 1 }}>
          {pageComponents[pageIndex]}
          <Box justify="between" pad="medium" direction="row">
            {(pageIndex > 0 && (
              <Button onClick={onClickBack} label={translateByID('back')} icon={<FormPrevious />} />
            )) || <Box />}
            {pageIndex + 1 < pageTitles.length && (
              <Button
                primary={pageIndex === 0}
                onClick={onClickNext}
                disabled={!completion[pageIndex]}
                icon={<FormNext />}
                reverse={true}
                label={pageIndex === 0 ? translateByID('get-started') : translateByID('next')}
              />
            )}
            {pageIndex === pageTitles.length - 1 && (
              <PDFDownloadLink
                style={{
                  padding: '4px 22px',
                  backgroundColor: '#3E73FF',
                  borderRadius: '18px',
                  color: 'white',
                  fontSize: '18px',
                  textDecoration: 'none',
                }}
                document={pdf}
                fileName="new-jersey-eligiblity.pdf"
              >
                {({ loading }) => (loading ? 'Downloading...' : 'Download')}
              </PDFDownloadLink>
            )}
          </Box>
        </Card>
        <Sidebar pages={pageTitles} />
      </Box>
    </Box>
  )
}

export default Form
