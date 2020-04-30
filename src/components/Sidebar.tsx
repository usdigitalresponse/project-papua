import React, { useContext } from 'react'
import { Card } from './helper-components'
import { Box, Text, Select, Image } from 'grommet'
import { LanguageContext } from '../contexts/language'
import { FormContext } from '../contexts/form'
import { range } from 'lodash'

interface Props {
  pages: string[]
}

const languages = [
  { title: 'English', value: 'en' },
  { title: '中文', value: 'zh' },
  { title: 'Español', value: 'es' },
]

const Sidebar: React.FC<Props> = (props) => {
  const { pages } = props
  const { translateByID, form, pageIndex, setPage, completion } = useContext(FormContext)
  const { language, setLanguage } = useContext(LanguageContext)

  const currentPage = pages[pageIndex]
  const percent = Math.floor(((pageIndex + 1) / pages.length) * 100)

  return (
    <Card flex={{ shrink: 0 }} margin={{ left: 'small' }} height="0%" background="white" pad="medium" width="350px">
      {form.seal && (
        <Box margin={{ bottom: 'medium' }}>
          <Image src={form.seal} style={{ maxHeight: '175px', maxWidth: '100%', objectFit: 'contain' }} />
        </Box>
      )}
      <Box>
        <Text weight={600} color="black">
          {translateByID('language')}
        </Text>
        <Select
          a11yTitle="select language"
          margin={{ top: 'xsmall' }}
          options={languages}
          labelKey="title"
          valueKey={{ key: 'value', reduce: true }}
          value={language}
          onChange={({ value }) => setLanguage(value)}
        />
      </Box>
      <Box margin={{ top: 'medium' }}>
        <Text weight={600} color="black">
          {translateByID('progress')}
        </Text>
        <Box
          margin={{ top: 'xsmall' }}
          style={{ width: '100%', height: '8px', borderRadius: '12px', background: '#E4E7EB' }}
        >
          <Box style={{ width: `${percent}%`, height: '100%', borderRadius: '12px', background: '#3E73FF' }} />
        </Box>
        <Box align="center">
          {' '}
          <Text color="black" weight={300} size="xsmall">
            {percent}% {translateByID('complete')}
          </Text>{' '}
        </Box>
      </Box>
      <Box margin={{ top: 'small' }}>
        {pages.map((page, i) => {
          // Set to true right now for demo purposes
          const canClickPage =
            true || i === 0 || i === pages.length - 1 || range(1, i).every((index) => completion[index])
          return (
            <Text
              style={{ cursor: canClickPage ? 'pointer' : 'not-allowed' }}
              onClick={() => canClickPage && setPage(i)}
              color={currentPage === page ? 'black' : '#66788A'}
              margin={{ bottom: 'xsmall' }}
              key={page}
            >
              {page}
            </Text>
          )
        })}
      </Box>
    </Card>
  )
}

export default Sidebar
