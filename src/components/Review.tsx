import React from 'react'
import { Pane, Heading, majorScale, Button } from 'evergreen-ui'
import Amplify, { API } from 'aws-amplify'
import awsconfig from '../aws-exports';

Amplify.configure(awsconfig);

// const onClickNext = () => setNextPage(currentIndex + 1)
function sendData () {
    // uuid: `${Math.floor(Math.random() * 100)}.json`
    let myInit = {
        body: {
        }, // replace this with attributes you need
    }

    API.post('resolver','/claims', myInit).then(response => {
        // Add your code here
        console.log("rsp:", response)
    }).catch(error => {
        console.log(error.response)
    });
}

function deleteData () {
    // @ts-ignore             uuid: `${Math.floor(Math.random() * 100)}.json`
    let myInit = {
        body: {
        }, // replace this with attributes you need
    }

    API.del('resolver','/claims', myInit).then(response => {
        // Add your code here
        console.log("rsp:", response)
    }).catch(error => {
        console.log(error.response)
    });
}

const Review: React.FC<{}> = () => {
  return (
    <Pane padding={majorScale(4)} display="flex" flexDirection="column">
      <Heading>Review & Submit</Heading>
        <Button appearance="primary" onClick={sendData()}>Post</Button>
        {/*<Button onClick={deleteData()}>Delete</Button>*/}
    </Pane>
  )
}

export default Review
