import React from 'react'
import { Grommet, Paragraph } from 'grommet'
import './App.css'
import Form from './components/Form'
import { LanguageProvider } from './contexts/language'
import { FormProvider } from './contexts/form'
import { USDR } from './components/USDR'
import values from 'object.values'
import { TextEncoder } from 'fastestsmallesttextencoderdecoder'
import amplitude from 'amplitude-js'

amplitude.getInstance().init('f97e7157248bb243a19ad46f17cdf2d7')

// Load shims
if (!Object.values) {
  values.shim()
}
if (!window.TextEncoder) {
  window.TextEncoder = TextEncoder
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
    focus: {
      border: {
        color: '#bfcffb',
      },
    },
    text: {
      align: 'left',
    },
    selected: {
      background: '#F2F2F2',
      color: 'black',
    },
    control: {
      border: {
        color: 'black',
        radius: '4px',
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
        small: { size: sizing.detail },
        medium: { size: sizing.detail },
        large: { size: sizing.detail },
        xlarge: { size: sizing.detail },
        xxlarge: { size: sizing.detail },
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
      borderRadius: '4px',
    },
  },
  radioButton: {
    gap: '16px',
  },
  button: {
    border: {
      color: 'transparent',
    },
    primary: {
      color: '#4776f6',
    },
  },
  checkBox: {
    color: '#FFFFFF',
    check: {
      color: '#205EFF',
    },
    gap: '16px',
  },
}

function App() {
  // `theme as any` because grommet has incomplete TS definitions
  return (
    <Grommet className="App" theme={theme as any}>
      <LanguageProvider>
        <FormProvider>
          <Paragraph>
            This site has been moved to:{' '}
            <a href="https://newjersey.github.io/dol-eligibility-tool/">
              https://newjersey.github.io/dol-eligibility-tool
            </a>
          </Paragraph>
        </FormProvider>
      </LanguageProvider>
    </Grommet>
  )
}

export default App
