import React from 'react'
import { Card, majorScale, Strong, Pane, Text, Image } from 'evergreen-ui'
import Select from './form-components/Select'

interface Props {
  pages: string[]
  currentIndex: number
  seal?: string
  setCurrentIndex: (index: number) => void
}

const languages = [
  {
    "name": "English",
    "id": "english"
  },
  {
    "name": "Chinese",
    "id": "chinese"
  },
  {
    "name": "Spanish",
    "id": "spanish"
  }
]

const Sidebar: React.FC<Props> = (props) => {
  const { pages, seal, currentIndex, setCurrentIndex } = props
  const currentPage = pages[currentIndex]
  const percent = Math.floor((currentIndex + 1) / pages.length * 100)

  return (
    <Card marginLeft={majorScale(2)} textAlign="left" justifyContent="flex-start" display="flex" flexDirection="column" height="0%" background="white" padding={majorScale(4)} >
      {seal && <Image marginBottom={majorScale(2)} height={125} src={seal} />}
      <Pane>
        <Strong color="black">Language</Strong>
        <br />
        <Select marginTop={majorScale(1)} width={200}>
          {languages.map(l => <option id={l.id} key={l.id}>{l.name}</option>)}
        </Select>
      </Pane>
      <Pane marginTop={majorScale(2)}>
        <Strong color="black">Progress</Strong>
        <br />
        <Pane marginTop={majorScale(1)} background="#F7F5F4" width="100%" height={majorScale(1)} borderRadius={12}>
          <Pane borderRadius={12} height="100%" width={`${percent}%`} background="#008060" />
        </Pane>
        <Pane textAlign="center"> <Text color="black" size={300}>{percent}% complete</Text> </Pane>
      </Pane>
      <Pane marginTop={majorScale(2)} display="flex" flexDirection="column">
        {pages.map((page, i) =>
          <Text cursor="pointer" onClick={() => setCurrentIndex(i)} color={currentPage === page ? 'black' : 'muted'} display="block" marginBottom={majorScale(1)} key={page}>{page}</Text>
        )}
      </Pane>
    </Card >
  )
}

export default Sidebar