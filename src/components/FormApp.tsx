import React, { useState, useContext } from 'react'
import { Card, Button } from './helper-components/index'
import { Box } from 'grommet'
import { initializeForm } from '../forms'
import Sidebar from './Sidebar'
import Introduction from './Introduction'
import Review from './Review'
import Form from './Form'
import { LanguageContext } from '../contexts/language'

const FormApp: React.FC<{}> = () => {
  const { language } = useContext(LanguageContext)

  const form = initializeForm()
  const { pages, state, seal } = form

  const pageTitles = ["Introduction", ...pages.map(page => page.title[language]), "Review & Submit"]
  const pageComponents = [<Introduction state={state} />, ...pages.map(page => <Form page={page} />), <Review />]

  const [currentIndex, setCurrentIndex] = useState<number>(0)

  const setNextPage = (index: number) => {
    setCurrentIndex(index)
    window.scrollTo(0, 0)
  }

  const onClickNext = () => setNextPage(currentIndex + 1)
  const onClickBack = () => setNextPage(currentIndex - 1)

  return (
    <Box align="center" pad="medium" direction="column">
      <Card margin={{ bottom: 'small' }} pad='small' background="white">This is for demo purposes only.</Card>
      <Box width="100%" height="100%" justify="center" direction="row">
        <Card width="50%" background="white" display="flex" justify="between" flexDirection="column" textAlign="left">
          {pageComponents[currentIndex]}
          <Box justify="between" pad="medium" direction="row">
            {(currentIndex > 0) && <Button border={{ radius: 0 }} color="black !important" onClick={onClickBack} label='Go Back' />}
            {(currentIndex + 1 < pageTitles.length) &&
              <Button color="black !important" onClick={onClickNext} label={currentIndex === 0 ? 'Get Started' : 'Next'} />
            }
          </Box>
        </Card>
        <Sidebar seal={seal} pages={pageTitles} currentIndex={currentIndex} setCurrentIndex={setNextPage} />
      </Box>
    </Box>
  )
}

export default FormApp
