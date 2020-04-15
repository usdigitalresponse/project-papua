import React from 'react'
import { Question } from '../../forms/types'
import TextInput from './TextInput'

interface Props {
  value: string
  question: Question
  onChange: (val: string) => void
  [key: string]: any
}

const PhoneNumber: React.FC<Props> = (props) => {
  // const { value = '', onChange } = props

  // let areaCodeInput: FocusComponent | null, firstPartInput: FocusComponent | null, secondPartInput: FocusComponent | null

  // //408 914 0349
  // const areaCode = value.substr(0, 3)
  // const firstPart = value.substr(3, 6)
  // const secondPart = value.substr(6, 9)
  // console.log('areaCode ', areaCode, ' firstPart', firstPart, ' secondPart ', secondPart)

  // return (
  //   <Pane display="flex">
  //     <TextInput
  //       ref={(i: FocusComponent) => areaCodeInput = i}
  //       value={value.substr(0, 3)}
  //       onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
  //         console.log(e.target.value);
  //         if (e.target.value.length > 3) {
  //           firstPartInput!.current.focus()
  //         } else {
  //           onChange(e.target.value + firstPart + secondPart)
  //         }
  //       }} color="black"
  //       border="black 1px solid !important"
  //     />
  //     <TextInput
  //       ref={(i: FocusComponent) => firstPartInput = i}
  //       value={value.substr(3, 6)}
  //       onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(areaCode + e.target.value + secondPart)}
  //       color="black"
  //       border="black 1px solid !important"
  //     />
  //     <TextInput
  //       ref={(i: FocusComponent) => secondPartInput = i}
  //       value={value.substr(6, 9)}
  //       onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(areaCode + firstPart + e.target.value)}
  //       color="black"
  //       border="black 1px solid !important"
  //     />
  //   </Pane>
  // )
  return <TextInput {...props} color="black" border="black 1px solid !important" />
}

export default PhoneNumber