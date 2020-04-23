import React, { useContext } from 'react'
import { Box } from 'grommet'
import { FormContext } from '../contexts/form'
import { Markdown } from './helper-components/Markdown'

const Introduction: React.FC = () => {
  const { translateByID } = useContext(FormContext)

  return (
    <>
      <Box pad="48px">
        <Markdown>{translateByID('introduction-content')}</Markdown>
      </Box>
      <Box style={{ position: 'relative' }}>
        <Box
          style={{
            position: 'absolute',
            height: '100%',
            width: '8px',
            backgroundColor: '#FFAE00',
          }}
        />
        <Box pad={{ vertical: 'none', horizontal: 'medium' }}>
          <Markdown>{translateByID('warning')}</Markdown>
        </Box>
      </Box>
      <Box pad={{ horizontal: 'medium' }}>
        <Markdown>{translateByID('agreement')}</Markdown>
      </Box>
    </>
  )
}

export default Introduction
