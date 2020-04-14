
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
    selected: {
      background: '#008060'
    },
    focus: {
      border: {
        color: 'none'
      }
    }
  },
  select: {
    icons: {
      color: '#000000'
    }
  }
};


function App() {
  return (
    <Grommet className="App" theme={theme}>
      <FormApp />
    </Grommet>
  )
}

export default App;
