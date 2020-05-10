import React, { useContext } from 'react'
import { Question } from '../../lib/types'
import { CheckBox as GrommetCheckBox, Paragraph, Box } from 'grommet'
import { FormContext } from '../../contexts/form'
import classnames from 'classnames'

interface Props {
  question: Question
}

export const Checkbox: React.FC<Props> = (props) => {
  const { question, ...rest } = props
  const { values, setValue, translateCopy, errors } = useContext(FormContext)

  const value = values[question.id]
  const hasError = Boolean(errors[question.id])

  return (
    <Box
      className={classnames('checkbox', {
        'checkbox-selected': !!value,
        errored: hasError,
      })}
      margin="none"
      pad={{ horizontal: 'large' }}
    >
      <GrommetCheckBox
        checked={value === true}
        label={<Paragraph margin="none">{translateCopy(question.options![0].name)}</Paragraph>}
        onChange={() => setValue(question, !value)}
        {...rest}
      />
    </Box>
  )
}
