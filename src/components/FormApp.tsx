import React, { useState, useContext } from 'react'
import { Card, Button, Markdown } from './helper-components'
import { Box, ResponsiveContext } from 'grommet'
import Sidebar from './Sidebar'
import Introduction from './Introduction'
import Review from './Review'
import Form from './Form'
import { FormContext } from '../contexts/form'

const FormApp: React.FC<{}> = () => {
  const { form, values, errors, translateByID, translateCopy } = useContext(FormContext)
  const size = useContext(ResponsiveContext)

  const { pages, seal } = form

  const pageTitles = [
    translateByID('introduction'),
    ...pages.map((page) => translateCopy(page.title)),
    translateByID('submit'),
  ]

  const [formCompletion, setFormCompletion] = useState<Record<string, boolean>>({})

  const setNextPage = (index: number) => {
    setCurrentIndex(index)
    window.scrollTo(0, 0)
  }

  const pageComponents = [
    <Introduction key="introduction" />,
    ...pages.map((page) => <Form page={page} key={page.heading.en} />),
    <Review key="review" pages={pages} setPage={setNextPage} />,
  ]

  const [currentIndex, setCurrentIndex] = useState<number>(0)

  const onClickNext = () => setNextPage(currentIndex + 1)
  const onClickBack = () => setNextPage(currentIndex - 1)

  return (
    <Box align="center" pad="medium" direction="column">
      <Card margin={{ bottom: 'small' }} pad="small" background="white">
        <Markdown>{translateByID('demo-warning')}</Markdown>
      </Card>
      <Box width="100%" height="100%" justify="center" direction="row">
        <Card width="50%" background="white" display="flex" justify="between" flexDirection="column" textAlign="left">
          {pageComponents[currentIndex]}
          <Box justify="between" pad="medium" direction="row">
            {currentIndex > 0 && (
              <Button
                border={{ radius: 0 }}
                color="black"
                onClick={onClickBack}
                hoverIndicator={{
                  color: currentIndex === 0 ? '#3E73FF !important' : 'black !important',
                }}
                label={translateByID('back')}
              />
            )}
            {currentIndex + 1 < pageTitles.length && (
              <Button
                color={currentIndex === 0 ? '#3E73FF' : 'black'}
                onClick={onClickNext}
                disabled={currentIndex > 0 && !formCompletion[currentIndex]}
                label={currentIndex === 0 ? translateByID('get-started') : translateByID('next')}
                hoverIndicator={{
                  color: currentIndex === 0 ? '#3E73FF !important' : 'black !important',
                  style: {
                    color: 'white !important',
                  },
                }}
              />
            )}
          </Box>
        </Card>
        {size !== 'small' && (
          <Sidebar
            completion={formCompletion}
            seal={seal}
            pages={pageTitles}
            currentIndex={currentIndex}
            setCurrentIndex={setNextPage}
          />
        )}
      </Box>
    </Box>
  )
}

export default FormApp
