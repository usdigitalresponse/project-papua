import React, { useState } from 'react'
import { Card, majorScale, Pane, Heading, Paragraph, Strong, OrderedList, ListItem, Button } from 'evergreen-ui'
import { initializeForm } from '../forms'
import Sidebar from './Sidebar'
import Introduction from './Introduction'
import Review from './Review'
import Form from './Form'

const FormApp: React.FC<{}> = () => {
  const form = initializeForm()
  const { pages, state } = form

  const pageTitles = ["Introduction", ...pages.map(page => page.title), "Review & Submit"]
  const pageComponents = [<Introduction state={state} />, ...pages.map(page => <Form page={page} />), <Review />]

  const [currentIndex, setcurrentIndex] = useState<number>(3)


  return (
    <Pane padding={majorScale(8)} display="flex">
      <Card width="50%" background="white" display="flex" justifyContent="space-between" flexDirection="column" textAlign="left">
        {pageComponents[currentIndex]}
        <Pane display="flex" justifyContent="space-between" padding={majorScale(4)}>
          {(currentIndex > 0) && <Button border="black 1px solid !important" backgroundImage="none !important" color="black !important" width={125} display="flex" justifyContent="center" onClick={() => setcurrentIndex(currentIndex - 1)}>{'Go Back'}
          </Button>}
          {(currentIndex + 1 < pageTitles.length) &&
            <Button border="black 1px solid !important" backgroundImage="none !important" color="black !important" width={125} display="flex" justifyContent="center" onClick={() => setcurrentIndex(currentIndex + 1)}>{currentIndex === 0 ? 'Get Started' : 'Next'}
            </Button>}
        </Pane>
      </Card>
      <Sidebar pages={pageTitles} currentIndex={currentIndex} />
    </Pane >
  )
}

export default FormApp