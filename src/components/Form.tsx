import React, { useContext, useEffect } from 'react'
import { Card, Button, Markdown } from './helper-components'
import { Box, ResponsiveContext, Heading } from 'grommet'
import Sidebar from './Sidebar'
import { FormContext } from '../contexts/form'
import Question from './Question'
import { FormPrevious, FormNext } from 'grommet-icons'
import PDF from './PDF'
import { BlobProvider } from '@react-pdf/renderer'

const Form: React.FC<{}> = () => {
  const { form, translateByID, translateCopy, completion, pageIndex, setPage, values } = useContext(FormContext)
  const size = useContext(ResponsiveContext)

  const pageTitles = [...form.pages.map((page) => translateCopy(page.title))]

  const pageComponents = [
    ...form.pages.map((page) => (
      <Box direction="column" justify="start" key={page.heading.en} margin="none">
        <Box pad={{ horizontal: 'large' }}>
          <Heading margin={{ horizontal: 'none', top: 'none', bottom: page.instructions ? '24px' : 'none' }} level={3}>
            {translateCopy(page.heading)}
          </Heading>
          {page.instructions && <Markdown size="small">{translateCopy(page.instructions)}</Markdown>}
        </Box>
        {page.questions.map((question) => (
          <Question question={question} key={question.id} />
        ))}
      </Box>
    )),
  ]

  const onClickNext = () => setPage(pageIndex + 1)
  const onClickBack = () => setPage(pageIndex - 1)

  const pdf = <PDF form={form} values={values} translateCopy={translateCopy} />
  const fileName = 'new-jersey-eligiblity.pdf'
  const onDownload = (blob: Blob | null) => {
    console.log('[Google Analytics] sending event: Download')
    gtag('event', 'Download')

    // Downloads are fired via the href, but on IE we have to use the msSaveBlob API.
    // This code is based on the react-pdf codebase.
    if (blob && window.navigator.msSaveBlob) {
      window.navigator.msSaveBlob(blob, fileName)
    }
  }

  // Track page views
  useEffect(() => {
    if (!form) {
      return
    }

    console.log('[Google Analytics] sending page call: ', form.pages[pageIndex].title.en)
    gtag('event', 'page_view', {
      title: form.pages[pageIndex].title.en,
    })
  }, [form, pageIndex])

  return (
    <Box align="center" pad="medium" direction="column" width="100%" style={{ maxWidth: '1200px' }}>
      <Box width="100%" height="100%" justify="center" direction={size === 'small' ? 'column' : 'row'}>
        <Card justify="between" flex={{ grow: 1, shrink: 1 }} pad={{ vertical: '48px' }}>
          {pageComponents[pageIndex]}
          <Box justify="between" pad={{ horizontal: 'large' }} margin={{ top: '48px' }} direction="row">
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
            {pageIndex === pageTitles.length - 1 && null}
            {pageIndex === pageTitles.length - 1 && (
              <BlobProvider document={pdf}>
                {(params) => (
                  <Button
                    primary={true}
                    href={!params.loading && completion[pageIndex] ? params.url || undefined : undefined}
                    disabled={params.loading || !completion[pageIndex]}
                    label={params.loading ? 'Downloading...' : 'Download'}
                    onClick={() => !params.loading && completion[pageIndex] && onDownload(params.blob)}
                    {...{ download: fileName }}
                  />
                )}
              </BlobProvider>
            )}
          </Box>
        </Card>
        <Sidebar pages={pageTitles} />
      </Box>
    </Box>
  )
}

export default Form
