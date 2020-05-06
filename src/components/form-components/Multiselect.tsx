import React, { useContext } from 'react'
import { Question, Option } from '../../lib/types'
import { Box, CheckBox } from 'grommet'
import './single-select.css'
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

  // This logic is pretty crazy - has to add additional keys to aggregate sections for NJ.
  const onSelect = (option: Option) => {
    const primaryKey = option.id
    let keys = [option.id]
    if (question.additionalKeys) {
      keys = keys.concat(question.additionalKeys.split(','))
    }

    let newValue = value ? [...value] : []
    let additionalValues: Record<string, string[]> = question.additionalKeys ? pick(values, question.additionalKeys?.split(',')) as Record<string, string[]> : {}
    keys.forEach(key => {
      // This option is being deselected
      if (value && typeof value !== 'string' && value.includes(primaryKey)) {
        if (key === primaryKey) {
          (newValue as string[]).splice(newValue.indexOf(key), 1)
        }
        if (option[key] && typeof option[key] === 'string') {
          let vals: string[] = (additionalValues[key] as string[]) || [] as string[]
          (option[key] as string).split(',').forEach((additionalValue: string) => {
            vals.splice(vals.indexOf(additionalValue), 1)
          })
          additionalValues[key] = vals
        }
      }
      // This option is being selected
      if (value && typeof value !== 'string' && !value.includes(primaryKey)) {
        if (key === primaryKey) {
          newValue = [...value, primaryKey]
        }
        if (option[key]) {
          additionalValues[key] = [...additionalValues[key], ...(option[key] as string).split(',')]
        }
      }
      // This option is being selected, and there are no other selections yet
      if (!value) {
        if (key === primaryKey) {
          newValue = [primaryKey]
        }
        if (option[key]) {
          additionalValues[key] = (option[key] as string || '').split(',')
        }
      }
    })

    setValue(question, newValue, additionalValues)
  }

  if (!question || !question.options) {
    return <Box />
  }

  return (
    <Box>
      {question.options.map((o) => {
        const isSelected = Boolean(value && value.includes(o.id))
        return (
          <CheckBox
            key={o.id}
            style={{
              marginTop: '8px',
            }}
            checked={isSelected}
            label={translateCopy(o.name)}
            onChange={() => onSelect(o)}
          />
        )
      })}
    </Box>
  )
}

export default Multiselect
