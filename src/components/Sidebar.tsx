import React, { useContext } from 'react'
import { Card } from './helper-components'
import { Box, Text, Select, Image } from 'grommet'
import { LanguageContext } from '../contexts/language'
import { translate, getCopy } from '../forms/index';

interface Props {
  pages: string[]
  currentIndex: number
  seal?: string
  setCurrentIndex: (index: number) => void
}

const languages = [
  {title: 'English', value: 'en'},
  {title: '中文', value: 'zh'},
  {title: 'Español', value: 'es'},
]

const Sidebar: React.FC<Props> = (props) => {
  const { pages, seal, currentIndex, setCurrentIndex } = props
  const currentPage = pages[currentIndex]
  const percent = Math.floor((currentIndex + 1) / pages.length * 100)
  const { language, setLanguage } = useContext(LanguageContext)

  return (
    <Card pad="medium" margin={{ left: 'small' }} textAlign="left" height="0%" background="white">
      {seal && <Image margin={{ bottom: 'small' }} src={seal} style={{ height: '175px' }} />}
      <Box>
        <Text weight={600} color="black">{translate(getCopy('language'), language)}</Text>
        <Select
          a11yTitle="select language"
          margin={{ top: 'xsmall' }}
          options={languages}
          labelKey="title"
          valueKey="value"
          value={language}
          onChange={({ option }: { option: { title: string, value: string} }) => setLanguage(option.value)}
        />
      </Box>
      <Box margin={{ top: 'medium' }}>
        <Text weight={600} color="black">{translate(getCopy('progress'), language)}</Text>
        <Box margin={{ top: 'xsmall' }} style={{ width: '100%', height: '8px', borderRadius: '12px', background: "#E4E7EB" }}>
          <Box style={{ width: `${percent}%`, height: '100%', borderRadius: '12px', background: "#008060" }} />
        </Box>
        <Box align="center"> <Text color="black" weight={300} size="xsmall">{percent}% {translate(getCopy('complete'), language)}</Text> </Box>
      </Box>
      <Box margin={{ top: 'small' }}>
        {pages.map((page, i) =>
          <Text style={{ cursor: 'pointer' }} onClick={() => setCurrentIndex(i)} color={currentPage === page ? 'black' : '#66788A'} margin={{ bottom: 'xsmall' }} key={page}>{page}</Text>
        )}
      </Box>
    </Card >
  )
}

export default Sidebar
