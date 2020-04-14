import React, { useState } from 'react'
import { Card } from './helper-components'
import { Box, Text, Select, Image } from 'grommet'

interface Props {
  pages: string[]
  currentIndex: number
  seal?: string
  setCurrentIndex: (index: number) => void
}

const languages = ['English', 'Chinese', 'Spanish']

const Sidebar: React.FC<Props> = (props) => {
  const { pages, seal, currentIndex, setCurrentIndex } = props
  const currentPage = pages[currentIndex]
  const percent = Math.floor((currentIndex + 1) / pages.length * 100)
  const [language, setLanguage] = useState<string>(languages[0])

  return (
    <Card pad="medium" margin={{ left: 'small' }} textAlign="left" height="0%" background="white">
      {seal && <Image margin={{ bottom: 'small' }} src={seal} style={{ height: '175px' }} />}
      <Box>
        <Text weight={600} color="black">Language</Text>
        <Select
          a11yTitle="select language"
          margin={{ top: 'xsmall' }}
          options={languages}
          value={language}
          onChange={({ option }: { option: string }) => setLanguage(option)}
        />
      </Box>
      <Box margin={{ top: 'medium' }}>
        <Text weight={600} color="black">Progress</Text>
        <Box margin={{ top: 'xsmall' }} style={{ width: '100%', height: '8px', borderRadius: '12px', background: "#E4E7EB" }}>
          <Box style={{ width: `${percent}%`, height: '100%', borderRadius: '12px', background: "#008060" }} />
        </Box>
        <Box align="center"> <Text color="black" weight={300} size="xsmall">{percent}% complete</Text> </Box>
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