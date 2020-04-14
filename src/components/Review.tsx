import React from 'react'
import { Pane, Heading, majorScale, Button } from 'evergreen-ui'
import Amplify, { API } from 'aws-amplify'
import awsconfig from '../aws-exports';

Amplify.configure(awsconfig);

function sendData () {
    let myInit = {
        body: {
            metadata: {
                uuid: Math.floor(Math.random() * 10),
            },
            questions: {
                "first-name": "Tom",
                "last-name": "Nook",
                "occupation": "slumlord"
            }
        }, // replace this with form data
    }

    API.post('resolver','/claims', myInit).then(response => {
        console.log("rsp:", response)
    }).catch(error => {
        console.log("error: ", error)
    });
}

const Review: React.FC<{}> = () => {
  return (
    <Pane padding={majorScale(4)} display="flex" flexDirection="column">
      <Heading>Review & Submit</Heading>
        <Button appearance="primary" onClick={sendData}>Post</Button>
    </Pane>
  )
}

export default Review
