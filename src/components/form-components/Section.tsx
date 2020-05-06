import React, { useContext } from 'react'
import { Question } from '../../lib/types'
import { FormContext } from '../../contexts/form'
import { getSections } from '../../forms'
import { Box, Heading } from 'grommet'
import Caret from './Caret'

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
          }}
          direction="row"
          justify="between"
          align="center"
          key={`section_${index}`}
          pad={{ horizontal: 'medium', vertical: 'small' }}
        >
          <Box direction="row">
            <Heading margin="none" level={5} style={{ width: "100%" }}>
              {translateCopy(section.title)}
            </Heading>
          </Box>
          <Caret open={true} />
        </Box>
      ))}
    </Box>
  )
}

export default Section