import React, { useState, useContext } from 'react'
import { Card, Button } from './helper-components/index'
import { Box } from 'grommet'
import { initializeForm } from '../forms'
import Sidebar from './Sidebar'
import Introduction from './Introduction'
import Review from './Review'
import Form from './Form'
import { LanguageContext } from '../contexts/language'
import { getInstructionalCopy } from '../forms/index';

const FormApp: React.FC<{}> = () => {
  const { language } = useContext(LanguageContext)

  const form = initializeForm()
  const { pages, seal } = form

  const pageTitles = [getInstructionalCopy("introduction")[language], ...pages.map(page => page.title[language]), getInstructionalCopy("submit")[language]]
  const pageComponents = [<Introduction />, ...pages.map(page => <Form page={page} />), <Review />]

  const [currentIndex, setCurrentIndex] = useState<number>(0)

  const setNextPage = (index: number) => {
    setCurrentIndex(index)
    window.scrollTo(0, 0)
  }

  const onClickNext = () => setNextPage(currentIndex + 1)
  const onClickBack = () => setNextPage(currentIndex - 1)

  return (
    <Box align="center" pad="medium" direction="column">
      <Card margin={{ bottom: 'small' }} pad='small' background="white">{getInstructionalCopy("demo-warning")[language]}</Card>
      <Box width="100%" height="100%" justify="center" direction="row">
        <Card width="50%" background="white" display="flex" justify="between" flexDirection="column" textAlign="left">
          {pageComponents[currentIndex]}
          <Box justify="between" pad="medium" direction="row">
            {(currentIndex > 0) && <Button border={{ radius: 0 }} color="black !important" onClick={onClickBack} label={getInstructionalCopy('back')[language]} />}
            {(currentIndex + 1 < pageTitles.length) &&
              <Button color="black !important" onClick={onClickNext} label={currentIndex === 0 ? getInstructionalCopy('get-started')[language]: getInstructionalCopy('next')[language]} />
            }
          </Box>
        </Card>
        <Sidebar seal={seal} pages={pageTitles} currentIndex={currentIndex} setCurrentIndex={setNextPage} />
      </Box>
    </Box>
  )
}

export default FormApp
