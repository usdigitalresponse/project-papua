import React, { useContext } from 'react'
import { Page } from '../forms/types'
import { Values } from '../contexts/form'
import { Box, Heading } from 'grommet'
import { translate } from '../forms'
import { LanguageContext } from '../contexts/language'

interface Props {
  pages: Page[]
  values: Values
}

const Summary: React.FC<Props> = (props) => {
  const { pages } = props
  const { language } = useContext(LanguageContext)
  return (
    <Box margin={{ top: 'medium' }} border={{ color: 'black' }}>
      {pages.map((page) => {
        return (
          <Box
            background="#F8F8F8"
            style={{
              borderBottom: '1px solid black',
              borderLeft: '1px solid black',
            }}
            key={translate(page.title, language)}
            pad={{ horizontal: 'medium', vertical: 'small' }}
          >
            <Heading margin="none" level={5}>
              {translate(page.title, language)}
            </Heading>
          </Box>
        )
      })}
    </Box>
  )
}

export default Summary
