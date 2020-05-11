import React, { useContext, useState } from 'react'
import { Question } from '../../lib/types'
import { FormContext } from '../../contexts/form'
import { getSections } from '../../forms'
import { Box, Heading, Paragraph } from 'grommet'
import { Markdown } from '../helper-components/Markdown'
import Caret from './Caret'
import { useKeyPress } from '../../hooks/useKeyPress'
import { CircleIcon } from '../helper-components/CircleIcon'

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

  const sectionGroup = getSections(question.sections, form, values)

  const onToggle = (e: React.MouseEvent, id: string) => {
    // Handle Alt-pressing, which should expand/collapse all.
    if (!optionPressed) {
      // Just expand/collapse this specific option.
      setOpen({
        ...open,
        [id]: !open[id],
      })
    } else if (Object.keys(open).length > 0) {
      // The user alt-clicked and at least one option is open, so collapse all.
      setOpen({})
    } else {
      // The user alt-clicked and all options are closed, so expand all.
      const o: Record<string, boolean> = {}
      for (const { section } of sectionGroup) {
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
      {sectionGroup.map(({ section, options }, index) => {
        const icons = options.filter((o) => !!o.icon).map((o) => o.icon!)
        icons.sort((i1, i2) => i1.label.localeCompare(i2.label))

        return (
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
              pad={{ horizontal: '24px' }}
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
              <Box direction="row" justify="end" align="center" flex={{ shrink: 0 }}>
                {icons.map((icon, i) => (
                  <Box
                    direction="column"
                    justify="center"
                    flex={{ shrink: 0 }}
                    margin={{ right: i === icons.length - 1 ? '16px' : '8px' }}
                    key={icon.label}
                  >
                    <CircleIcon color={icon.color} size={24}>
                      <Paragraph fill={true} margin="none" color="white" style={{ fontWeight: 500, fontSize: '16px' }}>
                        {icon.label}
                      </Paragraph>
                    </CircleIcon>
                  </Box>
                ))}
                <Caret open={open[section.title.en]} />
              </Box>
            </Box>
            <Box
              pad={{ horizontal: '24px' }}
              className="accordion-content"
              style={{ maxHeight: open[section.title.en] ? '500px' : '0px' }}
            >
              <Box pad={{ vertical: '16px' }}>
                <Markdown size="small">{translateCopy(section.content)}</Markdown>
              </Box>
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}

export default Section
