import React, { useContext } from 'react'
import { Box, TextInput as GrommetTextInput } from 'grommet'
import { FormContext } from '../../contexts/form'
import { Question } from '../../lib/types'

interface Props {
  question: Question
}

const TextInput: React.FC<Props> = (props) => {
  const { question } = props
  const { values, setValue, errors } = useContext(FormContext)
  const value = values[question.id]

  const hasError = Boolean(errors[question.id])
  return (
    <Box pad={{ horizontal: 'large' }}>
      <GrommetTextInput
        className={hasError ? 'text-input errored' : 'text-input'}
        value={(value as string) || ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(question, e.target.value)}
        style={{ maxWidth: '600px' }}
      />
    </Box>
  )
}

export default TextInput
