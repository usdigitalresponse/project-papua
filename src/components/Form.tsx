import React, { useContext, useEffect, useState } from 'react'
import { Card, Button, Markdown } from './helper-components'
import { Box, ResponsiveContext, Heading } from 'grommet'
import Sidebar from './Sidebar'
import { FormContext } from '../contexts/form'
import Question from './Question'
import { FormPrevious, FormNext } from 'grommet-icons'
import PDF from './PDF'
import { pdf } from '@react-pdf/renderer'
import amplitude from 'amplitude-js'

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

  const [previousURL, setPreviousURL] = useState<string>()
  const onDownload = async () => {
    console.log('[Google Analytics] sending event: Download')
    gtag('event', 'Download')
    amplitude.getInstance().logEvent('Download')

    // NOTE: we use the imperative react-pdf API here instead of `BlobProvider` because BlobProvider
    // renders the PDF in the foreground on document update, which blocks the UI. We only want to render
    // the PDF after the user clicks on the download button so that we don't block UI updates as the
    // user completes the form.
    const fileName = 'new-jersey-eligiblity.pdf'
    const blob = await pdf(<PDF form={form} values={values} translateCopy={translateCopy} />).toBlob()

    if (!blob) {
      // TODO: we should consider incorporating Sentry here.
      gtag('event', 'PDF Generation Failed')
      amplitude.getInstance().logEvent('PDF Generation Failed')
      console.error('Failed to generate PDF')
      return
    }

    // For most browsers, we can use the HTML5 download API. But for IE, we have to use
    // the msSaveBlob API. This code is based on the react-pdf codebase.
    if (window.navigator.msSaveBlob) {
      window.navigator.msSaveBlob(blob, fileName)
      return
    }

    // Attach a <a> element that we'll use to trigger the HTML5 download API
    // for this blob:
    const a = document.createElement('a')
    a.setAttribute('style', 'display: none;')
    document.body.appendChild(a)
    const url = window.URL.createObjectURL(blob)
    a.setAttribute('href', url)
    a.setAttribute('download', fileName)
    a.click()
    if (previousURL) {
      window.URL.revokeObjectURL(previousURL)
    }
    setPreviousURL(url)
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
    amplitude.getInstance().logEvent('Page View', {
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
              <Button
                primary={true}
                disabled={!completion[pageIndex]}
                label="Download"
                onClick={() => completion[pageIndex] && onDownload()}
              />
            )}
          </Box>
        </Card>
        <Sidebar pages={pageTitles} />
      </Box>
    </Box>
  )
}

export default Form
