import React, { useContext } from 'react'
import { Card } from './helper-components'
import { Box, Text, Select, Image } from 'grommet'
import { LanguageContext } from '../contexts/language'
import { FormContext } from '../contexts/form'
import { range } from 'lodash'

interface Props {
  pages: string[]
  currentIndex: number
  completion: Record<string, any>
  seal?: string
  setCurrentIndex: (index: number) => void
}

const languages = [
  { title: 'English', value: 'en' },
  { title: '中文', value: 'zh' },
  { title: 'Español', value: 'es' },
]

const Sidebar: React.FC<Props> = (props) => {
  const { pages, seal, currentIndex, setCurrentIndex, completion } = props
  const currentPage = pages[currentIndex]
  const percent = Math.floor(((currentIndex + 1) / pages.length) * 100)
  const { language, setLanguage } = useContext(LanguageContext)
  const { translateByID } = useContext(FormContext)

  return (
    <Card margin={{ left: 'small' }} textAlign="left" height="0%" background="white" pad="medium">
      {seal && (
        <Box margin={{ bottom: 'medium' }}>
          <Image src={seal} style={{ maxHeight: '175px', maxWidth: '100%', objectFit: 'contain' }} />
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
          valueKey="value"
          value={language}
          onChange={({ option }: { option: { title: string; value: string } }) => setLanguage(option.value)}
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
              onClick={() => canClickPage && setCurrentIndex(i)}
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
