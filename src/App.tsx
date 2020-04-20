import React from 'react'
import { Grommet } from 'grommet'
import './App.css'
import FormApp from './components/FormApp'
import { LanguageProvider } from './contexts/language'

const theme = {
  global: {
    hover: {
      color: 'white',
    },
    text: {
      align: 'left',
    },
    font: {
      size: '14px',
    },
    selected: {
      background: '#F2F2F2',
      color: 'black',
    },
    focus: {
      border: {
        color: '#BCCFFF',
      },
    },
    control: {
      border: {
        color: 'black',
      },
    },
  },
  select: {
    icons: {
      color: '#000000',
    },
    options: {
      text: {
        size: 'small',
      },
    },
    container: {
      borderRadius: '8px',
    },
  },
}

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

export default App
