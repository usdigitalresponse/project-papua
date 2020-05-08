import React, { useContext } from 'react'
import { Question } from '../../lib/types'
import { CheckBox as GrommetCheckBox, Paragraph, Box } from 'grommet'
import { FormContext } from '../../contexts/form'

interface Props {
  question: Question
}

export const Checkbox: React.FC<Props> = (props) => {
  const { question, ...rest } = props
  const { values, setValue, translateCopy } = useContext(FormContext)

  const value = values[question.id]

  return (
    <Box className={value === true ? 'checkbox checkbox-selected' : 'checkbox'}>
      <GrommetCheckBox
        checked={value === true}
        label={<Paragraph>{translateCopy(question.options![0].name)}</Paragraph>}
        onChange={() => setValue(question, !value)}
        {...rest}
      />
    </Box>
  )
}
