import { createContext } from 'react'
import { Question, Copy } from '../forms/types'

interface FormState {
  setValue: (question: Question, value: Value) => void
  setError: (id: string, value: Copy[]) => void
  values: Values
  errors: Errors
}

export interface Values {
  [key: string]: Value
}

export interface Errors {
  [key: string]: Copy[]
}

export type Value = string | string[] | Date


const initialState: FormState = {
  values: {},
  errors: {},
  setValue: (question: Question, value: Value) => { },
  setError: (id: string, value: Copy[]) => { }
}

export const FormContext = createContext(initialState)
