import React, { useContext } from 'react'
import { Question, Option } from '../../lib/types'
import { Box, CheckBox, Paragraph } from 'grommet'
import { FormContext } from '../../contexts/form'
import { pick } from 'lodash'
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
    const additionalValues: Record<string, string[]> = {}
    for (const key of question.additionalKeys?.split(',') || []) {
      if (!option[key]) {
        continue
      }

      // Each entry in additionalValues maps a key (f.e. "benefits") to a list of
      // sections that are enabled (f.e. UI-NJ).
      additionalValues[key] = (values[key] || []) as string[]

      // Based on whether we just enabled or disabled this option, add/remove the
      // specified sections from this key.
      const sections = (option[key] as string).split(',')
      if (selected) {
        // Note that we purposefully retain duplicates here so that it is easier
        // to remove sections from the list (see else statement below).
        additionalValues[key] = [...additionalValues[key], ...sections]
      } else {
        for (const s of sections) {
          additionalValues[key].splice(additionalValues[key].indexOf(s), 1)
        }
      }
    }

    setValue(question, selectedOptions, additionalValues)
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
                <Paragraph margin="none" fill={true}>
                  {translateCopy(o.name)}
                </Paragraph>
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
