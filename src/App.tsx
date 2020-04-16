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
  // `theme as any` because grommet has incomplete TS definitions
  return (
    <Grommet className="App" theme={theme as any}>
      <LanguageProvider>
        <FormApp />
      </LanguageProvider>
    </Grommet>
  )
}

export default App;
