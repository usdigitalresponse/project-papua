import React, { useState } from 'react'
import { Card, majorScale, Pane, Button } from 'evergreen-ui'
import { initializeForm } from '../forms'
import Sidebar from './Sidebar'
import Introduction from './Introduction'
import Review from './Review'
import Form from './Form'

const FormApp: React.FC<{}> = () => {
  const form = initializeForm()
  const { pages, state, seal } = form

  const pageTitles = ["Introduction", ...pages.map(page => page.title), "Review & Submit"]
  const pageComponents = [<Introduction state={state} />, ...pages.map(page => <Form page={page} />), <Review />]

  const [currentIndex, setCurrentIndex] = useState<number>(0)

  const setNextPage = (index: number) => {
    setCurrentIndex(index)
    window.scrollTo(0, 0)
  }

  const onClickNext = () => setNextPage(currentIndex + 1)
  const onClickBack = () => setNextPage(currentIndex - 1)

  return (
    <Pane alignItems="center" padding={majorScale(8)} display="flex" flexDirection="column" >
      <Card marginBottom={majorScale(2)} padding={majorScale(2)} background="white">This is for demo purposes only.</Card>
      <Pane display="flex" width="100%" height="100%" justifyContent="center">
        <Card width="50%" background="white" display="flex" justifyContent="space-between" flexDirection="column" textAlign="left">
          {pageComponents[currentIndex]}
          <Pane display="flex" justifyContent="space-between" padding={majorScale(4)}>
            {(currentIndex > 0) && <Button border="black 1px solid !important" backgroundImage="none !important" color="black !important" width={125} display="flex" justifyContent="center" onClick={onClickBack}>{'Go Back'}
            </Button>}
            {(currentIndex + 1 < pageTitles.length) &&
              <Button border="black 1px solid !important" backgroundImage="none !important" color="black !important" width={125} display="flex" justifyContent="center" onClick={onClickNext}>
                {currentIndex === 0 ? 'Get Started' : 'Next'}
              </Button>
            }
          </Pane>
        </Card>
        <Sidebar seal={seal} pages={pageTitles} currentIndex={currentIndex} setCurrentIndex={setNextPage} />
      </Pane>
    </Pane >
  )
}

export default FormApp