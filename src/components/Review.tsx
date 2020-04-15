import React from 'react'
import { Box, Heading, Button } from 'grommet'
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
                "occupation": "Real estate tycoon"
            }
        }
    }

    API.post('resolverAPI','/claims', myInit).then(response => {
        console.log("rsp:", response)
    }).catch(error => {
        console.log("error: ", error)
    });
}

const Review: React.FC<{}> = () => {
  return (
    <Box pad="medium">
      <Heading margin="none" level={3}>Review & Submit</Heading>
      <Button color="black !important" onClick={sendData}>Post</Button>
    </Box>
  )
}

export default Review
