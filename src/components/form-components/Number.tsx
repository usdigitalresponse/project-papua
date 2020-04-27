import React, { useContext } from 'react'
import { TextInput as GrommetTextInput } from 'grommet'
import { FormContext } from '../../contexts/form'
import { Question } from '../../forms/types'
import NumberFormat, { NumberFormatProps } from 'react-number-format'

interface Props {
  question: Question
}

export const Number: React.FC<Props> = (props) => {
  const { question } = props
  const { setValue, errors } = useContext(FormContext)

  const onChange: NumberFormatProps['onValueChange'] = ({ floatValue }) => {
    setValue(question, floatValue)
  }

  let typeProps: Partial<NumberFormatProps> = {
    type: 'tel',
    allowNegative: false,
  }
  if (question.type === 'dollar-amount') {
    typeProps = {
      ...typeProps,
      prefix: '$',
      thousandSeparator: true,
      decimalScale: 2,
    }
  } else if (question.type === 'integer') {
    typeProps = {
      ...typeProps,
      decimalScale: 0,
      thousandSeparator: true,
    }
  } else if (question.type === 'decimal') {
    typeProps = {
      ...typeProps,
      thousandSeparator: true,
      decimalScale: 2,
    }
  } else if (question.type === 'phone') {
    typeProps = {
      ...typeProps,
      decimalScale: 0,
      format: '+1 (###) ###-####',
      allowEmptyFormatting: true,
      mask: '_',
    }
  }

  const hasError = Boolean(errors[question.id])
  return (
    <NumberFormat
      customInput={GrommetTextInput}
      onValueChange={onChange}
      color="black"
      style={{ border: hasError ? '#FF4040 1px solid' : 'black 1px solid' }}
      {...typeProps}
    />
  )
}
