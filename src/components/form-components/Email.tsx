import React, { useContext } from 'react'
import { Question } from '../../forms/types'
import TextInput from './TextInput'
import validator from 'email-validator'
import { FormContext } from '../../contexts/form'

interface Props {
  question: Question
}

export const Email: React.FC<Props> = (props) => {
  const { form } = useContext(FormContext)

  const validate = (value: string) => {
    return validator.validate(value) ? undefined : form.instructions['invalid-email']
  }

  return <TextInput question={props.question} validate={validate} />
}
