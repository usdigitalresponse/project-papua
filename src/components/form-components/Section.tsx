import React, { useContext, useState } from 'react'
import { Question } from '../../lib/types'
import { FormContext } from '../../contexts/form'
import { getSections } from '../../forms'
import { Box, Heading } from 'grommet'
import { Markdown } from '../helper-components/Markdown'
import Caret from './Caret'
import { useKeyPress } from '../../hooks/useKeyPress'

interface Props {
  question: Question
}

const Section: React.FC<Props> = (props) => {
  const { question } = props
  const { values, form, translateCopy } = useContext(FormContext)
  const [open, setOpen] = useState<Record<string, boolean>>({})
  const optionPressed = useKeyPress('Alt')

  if (!question.sections) {
    // A sections field should always be specified for section question types.
    return null
  }

  const sections = getSections(question.sections, form, values)

  const onToggle = (e: React.MouseEvent, id: string) => {
    if (!optionPressed) {
      setOpen({
        ...open,
        [id]: !open[id],
      })
    } else if (Object.keys(open).length > 0) {
      setOpen({})
    } else {
      const o: Record<string, boolean> = {}
      for (const section of sections) {
        o[section.title.en] = true
      }
      setOpen(o)
    }
  }

  return (
    <Box style={{ backgroundColor: question.sections.color }} pad={{ horizontal: 'large', vertical: 'large' }}>
      <Heading level={3} margin="none">
        {translateCopy(question.sections.name)}
      </Heading>
      {sections.map((section, index) => (
        <Box
          background="#FFFFFF"
          style={{
            border: '1px solid #CCCCCC',
            borderRadius: '4px',
            overflowWrap: 'break-word',
            transitionDuration: '.2s',
          }}
          justify="between"
          key={`section_${index}`}
          margin={{ top: 'small' }}
          className="accordion"
          overflow="hidden"
        >
          <Box
            height="70px"
            direction="row"
            align="center"
            justify="between"
            onClick={(e: React.MouseEvent) => onToggle(e, section.title.en)}
            pad={{ horizontal: 'medium' }}
            className="accordion-header"
            background={open[section.title.en] ? '#F8F8F8' : '#FFFFFF'}
            hoverIndicator={{
              color: '#F8F8F8',
            }}
          >
            <Box>
              <Heading margin="none" level={5} style={{ color: 'black' }}>
                {translateCopy(section.title)}
              </Heading>
            </Box>
            <Box>
              <Caret open={open[section.title.en]} />
            </Box>
          </Box>
          <Box
            pad={{ horizontal: 'medium' }}
            className="accordion-content"
            style={{ maxHeight: open[section.title.en] ? '300px' : '0px' }}
          >
            <Box pad={{ vertical: '16px' }}>
              <Markdown size="small">{translateCopy(section.content)}</Markdown>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  )
}

export default Section
