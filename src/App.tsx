import React from 'react'
import { Grommet } from 'grommet'
import './App.css'
import Form from './components/Form'
import { LanguageProvider } from './contexts/language'
import { FormProvider } from './contexts/form'
import { USDR } from './components/USDR'

const colors = {
  accent: '#3E73FF',
  warning: '#FFCA58',
  danger: '#FF4040',
}

const sizing = {
  header: '26px',
  subheader: '18px',
  body: '18px',
  detail: '14px',
}

const theme = {
  global: {
    colors: {
      text: {
        dark: 'white',
        light: 'black',
      },
    },
    text: {
      align: 'left',
    },
    paragraph: {},
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
  paragraph: {
    small: { size: sizing.detail },
    medium: { size: sizing.body },
    large: { size: sizing.body },
    xlarge: { size: sizing.body },
    xxlarge: { size: sizing.body },
  },
  heading: {
    level: {
      1: {
        small: { size: sizing.header },
        medium: { size: sizing.header },
        large: { size: sizing.header },
        xlarge: { size: sizing.header },
        xxlarge: { size: sizing.header },
      },
      2: {
        small: { size: sizing.header },
        medium: { size: sizing.header },
        large: { size: sizing.header },
        xlarge: { size: sizing.header },
        xxlarge: { size: sizing.header },
      },
      3: {
        small: { size: sizing.header },
        medium: { size: sizing.header },
        large: { size: sizing.header },
        xlarge: { size: sizing.header },
        xxlarge: { size: sizing.header },
      },
      4: {
        small: { size: sizing.subheader },
        medium: { size: sizing.subheader },
        large: { size: sizing.subheader },
        xlarge: { size: sizing.subheader },
        xxlarge: { size: sizing.subheader },
      },
      5: {
        small: { size: sizing.subheader },
        medium: { size: sizing.subheader },
        large: { size: sizing.subheader },
        xlarge: { size: sizing.subheader },
        xxlarge: { size: sizing.subheader },
      },
      6: {
        small: { size: sizing.subheader },
        medium: { size: sizing.subheader },
        large: { size: sizing.subheader },
        xlarge: { size: sizing.subheader },
        xxlarge: { size: sizing.subheader },
      },
    },
  },
  select: {
    icons: {
      color: '#000000',
    },
    options: {
      text: {
        color: 'black',
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
          <USDR>
            <Form />
          </USDR>
        </FormProvider>
      </LanguageProvider>
    </Grommet>
  )
}

export default App
