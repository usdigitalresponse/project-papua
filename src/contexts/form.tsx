import { createContext } from 'react'

interface FormState {
  setValue: (id: string, value: Value) => void
  setError: (id: string, value: string) => void
  values: Values
  errors: Errors
}

export interface Values {
  [key: string]: Value
}

export interface Errors {
  [key: string]: string
}

export type Value = string | string[] | Date

const initialState: FormState = {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  /* eslint-disable @typescript-eslint/no-empty-function */
  values: {},
  errors: {},
  setValue: (id: string, value: Value) => {},
  setError: (id: string, value: string) => {},
}

export const FormContext = createContext(initialState)
