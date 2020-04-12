import React from 'react'
import { Pane, Heading, majorScale, Button } from 'evergreen-ui'

import Amplify, { Storage } from 'aws-amplify';
// import awsconfig from './aws-exports';
import { withAuthenticator, S3Text } from 'aws-amplify-react';
import '@aws-amplify/ui/dist/style.css';

Storage.configure({ level: 'private' });

function sendData ({data}: { data: any }) {
    Storage.put(`${Math.floor(Math.random() * 100)}.json`, JSON.stringify(data))
        .then(result => console.log(result))
        .catch(err => console.log(err))
}

const Review: React.FC<{}> = () => {
    const data = {
        uuid: 0,
        first: "Tom",
        last: "Nook",
        employment: "Nook Inc",
        lastWorked: "2020-04-01",
        income: 1000000000
    }


  return (
    <Pane padding={majorScale(4)} display="flex" flexDirection="column">
      <Heading>Review & Submit</Heading>
        <Button appearance="primary" onClick={sendData({data: data})}>Send Valid</Button>
    </Pane>
  )
}

export default withAuthenticator(Review, true);