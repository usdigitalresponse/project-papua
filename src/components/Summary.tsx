import React, { useContext, useState } from 'react'
import { Page } from '../forms/types'
import { Values } from '../contexts/form'
import { Box, Heading, Text } from 'grommet'
import { translate } from '../forms'
import { LanguageContext } from '../contexts/language'

interface Props {
  pages: Page[]
  values: Values
}

const Caret: React.FC<{ open: boolean }> = (props) => {
  return (
    <svg
      transform={props.open ? 'rotate(90)' : 'none'}
      width="9"
      height="14"
      viewBox="0 0 9 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M1 1L7 7L1 13" stroke="#333333" strokeWidth="2" />
    </svg>
  )
}

const Summary: React.FC<Props> = (props) => {
  const { pages, values } = props
  const { language } = useContext(LanguageContext)

  const [checkedPages, setCheckedPages] = useState<Record<string, boolean>>({})
  const [openPages, setOpenPages] = useState<Record<string, boolean>>({})

  const toggleOpenPage = (pageIndex: number) => {
    setOpenPages({
      ...openPages,
      [pageIndex]: !openPages[pageIndex],
    })
  }

  return (
    <Box margin={{ top: 'medium' }} border={{ color: 'black' }}>
      {pages.map((page, i) => {
        const checked = checkedPages[i]
        return (
          <>
            <Box
              background="#F8F8F8"
              style={{
                borderBottom: '1px solid black',
                borderLeft: '1px solid black',
              }}
              onClick={() => toggleOpenPage(i)}
              direction="row"
              justify="between"
              align="center"
              key={translate(page.title, language)}
              pad={{ horizontal: 'medium', vertical: 'small' }}
            >
              <Box direction="row">
                <Box
                  margin={{ right: '16px' }}
                  justify="center"
                  align="center"
                  height="25px"
                  width="25px"
                  background={checked ? '#3E73FF' : '#F8F8F8'}
                  style={{ border: checked ? '1px solid #3E73F' : '1px solid #CCCCCC', borderRadius: '50%' }}
                >
                  {checked && (
                    <Text color="white" weight="bold">
                      ✓
                    </Text>
                  )}
                </Box>
                <Heading margin="none" level={5}>
                  {translate(page.title, language)}
                </Heading>
              </Box>
              <Caret open={openPages[i]} />
            </Box>
            {openPages[i] && (
              <Box margin={{ horizontal: '48px', vertical: '24px' }}>
                {page.questions.map((q) => {
                  return (
                    <Box key={q.id} direction="row" margin={{ bottom: '16px' }}>
                      <Text margin={{ right: '8px' }} weight="bold">
                        {translate(q.name, language)}:
                      </Text>
                      <Text>{values[q.id]}</Text>
                    </Box>
                  )
                })}
              </Box>
            )}
          </>
        )
      })}
    </Box>
  )
}

export default Summary
