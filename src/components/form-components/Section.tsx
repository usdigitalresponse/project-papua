import React, { useContext } from 'react'
import { Question } from '../../lib/types'
import { FormContext } from '../../contexts/form'
import { getSections } from '../../forms'
import { Box, Heading } from 'grommet'
import { Markdown } from '../helper-components/Markdown'

interface Props {
  question: Question
}

const Section: React.FC<Props> = (props) => {
  const { question } = props
  const { values, form, translateCopy } = useContext(FormContext)

  const sections = getSections(question.sections, form, values)
  return (
    <Box>
      {sections.map((section, index) => (
        <Box
          background="#F8F8F8"
          style={{
            border: '1px solid black',
            overflowWrap: 'break-word',
          }}
          justify="between"
          key={`section_${index}`}
          pad={{ horizontal: 'medium', vertical: 'small' }}
          margin={{ bottom: 'small' }}
        >
          <Heading margin="none" level={5} style={{ color: 'black' }}>
            {translateCopy(section.title)}
          </Heading>
          <Markdown margin={{ vertical: 'xsmall' }} size="small">
            {translateCopy(section.content)}
          </Markdown>
        </Box>
      ))}
    </Box>
  )
}

export default Section
