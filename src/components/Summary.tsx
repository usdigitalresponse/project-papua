import React, { useContext, useState } from 'react'
import { Page } from '../forms/types'
import { Values } from '../contexts/form'
import { Box, Heading, Text, CheckBox, Button } from 'grommet'
import { translate } from '../forms'
import { LanguageContext } from '../contexts/language'
import moment from 'moment'
interface Props {
  pages: Page[]
  values: Values
  setPage: (index: number) => void
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

const Edit = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.0149 0.51C11.3349 0.2 11.7749 0 12.2549 0C13.2249 0 14.0049 0.79 13.9949 1.74C13.9949 2.23 13.8049 2.66 13.4849 2.98L12.0449 4.42L9.57488 1.95L11.0149 0.51ZM2.26488 9.27L4.73488 11.74L11.4249 5.05L8.96488 2.57L2.26488 9.27ZM0.00488281 14L3.86488 12.61L1.40488 10.17L0.00488281 14Z"
      fill="#3E73FF"
    />
  </svg>
)

const Summary: React.FC<Props> = (props) => {
  const { pages, values, setPage } = props
  const { language } = useContext(LanguageContext)

  const [checkedPages, setCheckedPages] = useState<Record<string, boolean>>({})
  const [openPages, setOpenPages] = useState<Record<string, boolean>>({})

  const checkPage = (pageIndex: number) => setCheckedPages({ ...checkedPages, [pageIndex]: true })

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
              <Box pad={{ horizontal: '48px', vertical: '24px' }} style={{ borderBottom: '1px solid black' }}>
                {page.questions.map((q) => {
                  const value = values[q.id] instanceof Date ? moment(values[q.id]).format('M/DD/YYYY') : values[q.id]
                  return (
                    <Box key={q.id} direction="row" margin={{ bottom: '16px' }}>
                      <Text size="16px" margin={{ right: '8px' }} weight={600}>
                        {translate(q.name, language)}:
                      </Text>
                      <Text size="16px">{value}</Text>
                    </Box>
                  )
                })}
                <Box
                  pad={{ top: 'small' }}
                  margin={{ top: 'small ' }}
                  direction="row"
                  justify="between"
                  style={{ borderTop: '1px solid black' }}
                >
                  <Box>
                    <CheckBox checked={checked} onClick={() => checkPage(i)} label="The above info is correct." />
                  </Box>
                  <Text
                    style={{ cursor: 'pointer' }}
                    onClick={() => setPage(i + 1)}
                    size="16px"
                    color="#3E73FF"
                    a11yTitle={`Edit ${page.title}`}
                  >
                    Edit {Edit}
                  </Text>
                </Box>
              </Box>
            )}
          </>
        )
      })}
    </Box>
  )
}

export default Summary
