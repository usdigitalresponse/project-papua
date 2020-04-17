import { createContext } from 'react'
import { Question, ErrorMessage } from '../forms/types'

interface FormState {
  setValue: (question: Question, value: Value) => void
  setError: (id: string, value: ErrorMessage[]) => void
  values: Values
  errors: Errors
}

export interface Values {
  [key: string]: Value
}

export interface Errors {
  [key: string]: ErrorMessage[]
}

export type Value = string | string[] | Date


const initialState: FormState = {
  values: {},
  errors: {},
  setValue: (question: Question, value: Value) => { },
  setError: (id: string, value: ErrorMessage[]) => { }
}

export const FormContext = createContext(initialState)
