import React, { useContext } from 'react'
import { Question, Option } from '../../lib/types'
import { Box, CheckBox, Paragraph } from 'grommet'
import { FormContext } from '../../contexts/form'
import { omit } from 'lodash'
import { CircleIcon } from '../helper-components/CircleIcon'

interface Props {
  value: string[]
  question: Question
  onChange: (val: string[]) => void
  [key: string]: any
}

const Multiselect: React.FC<Props> = (props) => {
  const { question } = props
  const { values, setValue, translateCopy } = useContext(FormContext)
  const value = values[question.id] as string[] | string

  const onSelect = (option: Option) => {
    // Handle the state of the multiselect, first.
    const selectedOptions = value ? [...value] : []
    const selected = !selectedOptions.includes(option.id)
    if (selected) {
      // Case A: User selected this option
      selectedOptions.push(option.id)
    } else {
      // Case B: User deselected this option
      selectedOptions.splice(selectedOptions.indexOf(option.id), 1)
    }

    // Now handle the additional keys
    const additionalValues: Record<string, Record<string, Option[]> | undefined> = {}
    for (const key of question.additionalKeys?.split(',') || []) {
      if (!option[key]) {
        continue
      }

      // Each entry in additionalValues maps a key (f.e. "benefits") to a mapping of
      // section ID to a list of options that enabled that section.
      additionalValues[key] = { ...(values[key] as any) }

      // Based on whether we just enabled or disabled this option, add/remove this option
      // from each of the corresponding section.
      const sections = (option[key] as string).split(',')
      if (selected) {
        for (const s of sections) {
          additionalValues[key]![s] = [...(additionalValues[key]![s] || []), option]
        }
      } else {
        for (const s of sections) {
          if (additionalValues[key]![s].length === 1) {
            // If this option is the only option associated with this section, omit the section.
            additionalValues[key] = omit(additionalValues[key], s)
          } else {
            additionalValues[key]![s] = additionalValues[key]![s].filter((o) => o.id !== option.id)
          }
        }
      }

      // If all sections are now hidden, omit this section group key.
      if (Object.keys(additionalValues[key]!).length === 0) {
        additionalValues[key] = undefined
      }
    }

    setValue(question, selectedOptions.length > 0 ? selectedOptions : undefined, additionalValues)
  }

  if (!question || !question.options) {
    return <Box />
  }

  return (
    <Box pad={{ horizontal: 'large' }}>
      {question.options.map((o) => {
        const isSelected = Boolean(value && value.includes(o.id))
        return (
          <Box
            className={isSelected ? 'checkbox checkbox-selected' : 'checkbox'}
            key={o.id}
            margin={{ bottom: '16px' }}
          >
            <CheckBox
              checked={isSelected}
              label={
                <Box direction="row">
                  {o.icon && (
                    <Box direction="column" justify="center" flex={{ shrink: 0 }} margin={{ right: '8px' }}>
                      <CircleIcon color={o.icon.color} size={30}>
                        <Paragraph fill={true} margin="none" color="white" style={{ fontWeight: 500 }}>
                          {o.icon.label}
                        </Paragraph>
                      </CircleIcon>
                    </Box>
                  )}
                  <Paragraph margin="none" fill={true}>
                    {translateCopy(o.name)}
                  </Paragraph>
                </Box>
              }
              onChange={() => onSelect(o)}
            />
          </Box>
        )
      })}
    </Box>
  )
}

export default Multiselect
