import React from 'react'
import { Pane, Heading, majorScale, Button } from 'evergreen-ui'

import Amplify, { Storage } from 'aws-amplify';
// import awsconfig from './aws-exports';
import { withAuthenticator, S3Text } from 'aws-amplify-react';
import '@aws-amplify/ui/dist/style.css';

Storage.configure({ level: 'private' });

const sendData = () => (
        // const file = evt.target.files[0];
        // const name = file.name;

        Storage.put('test.txt', 'hello')
            .then (result => console.log(result))
            .catch(err => console.log(err))
)

const Review: React.FC<{}> = () => {


  return (
    <Pane padding={majorScale(4)} display="flex" flexDirection="column">
      <Heading>Review & Submit</Heading>
        <Button appearance="primary" onClick={sendData}>Hi Evergreen!</Button>
    </Pane>
  )
}

export default withAuthenticator(Review, true);