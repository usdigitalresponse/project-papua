import React from 'react'
import { Grommet } from 'grommet'
import './App.css'
import FormApp from './components/FormApp'
import { LanguageProvider } from './contexts/language'
import { FormProvider } from './contexts/form'

const theme = {
  global: {
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
  heading: {
    level: {
      4: {
        small: { maxWidth: 'none !important' },
        medium: { maxWidth: 'none !important' },
        large: { maxWidth: 'none !important' },
      },
      5: {
        small: { maxWidth: 'none !important' },
        medium: { maxWidth: 'none !important' },
        large: { maxWidth: 'none !important' },
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
  checkBox: {
    color: '#205EFF',
    hover: {
      color: '#BCCFFF !important',
      border: {
        color: '#BCCFFF !important',
      },
    },
    border: {
      color: '#333333 !important',
    },
    check: {
      color: '#205EFF',
      extend: {
        border: '#205EFF 2px solid',
      },
    },
  },
  radioButton: {
    size: '24px',
    extend: {
      flexShrink: 0,
    },
    hover: {
      color: '#BCCFFF !important',
      border: {
        color: '#BCCFFF !important',
      },
    },
    border: {
      color: '#333333 !important',
    },
    check: {
      color: '#205EFF',
      extend: {
        border: '#205EFF 2px solid',
      },
    },
  },
}

function App() {
  // `theme as any` because grommet has incomplete TS definitions
  return (
    <Grommet className="App" theme={theme as any}>
      <LanguageProvider>
        <FormProvider>
          <FormApp />
        </FormProvider>
      </LanguageProvider>
    </Grommet>
  )
}

export default App
