import React from 'react';
import { Grommet } from 'grommet'
import './App.css';
import FormApp from './components/FormApp'

const theme = {
  global: {
    text: {
      align: 'left'
    },
    font: {
      size: '14px'
    },
    '.card': {
      background: "white"
    },
    '.button': {
      border: "black 1px solid !important"
    }
  },
};


function App() {
  return (
    <Grommet className="App" theme={theme}>
      <FormApp />
    </Grommet>
  )
}

export default App;
