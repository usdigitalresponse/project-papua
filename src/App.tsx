import React from 'react';
import { Grommet } from 'grommet'
import './App.css';
import FormApp from './components/FormApp'
import { LanguageProvider } from './contexts/language';

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
    },
    control: {
      border: {
        color: 'black'
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
    // @ts-ignore: grommet has incomplete type definitions 
    <Grommet className="App" theme={theme}>
      <LanguageProvider>
        <FormApp />
      </LanguageProvider>
    </Grommet>
  )
}

export default App;
