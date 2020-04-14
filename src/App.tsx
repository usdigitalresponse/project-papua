import React from 'react';
import { Grommet } from 'grommet'
import './App.css';
import FormApp from './components/FormApp'

const theme = {
  global: {
    font: {
      family: 'IBM Plex Sans',
      size: '14px'
    },
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
