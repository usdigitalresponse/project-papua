import React, { createContext, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { initializeForm, translate } from '../forms/index'

const initialState = {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  /* eslint-disable @typescript-eslint/no-empty-function */
  language: 'en',
  setLanguage: (language: string) => {},
}
export const LanguageContext = createContext(initialState)

export const LanguageProvider: React.FC = (props) => {
  const [language, setLanguage] = useLocalStorage<string>('papua-selected-language', initialState.language)

  useEffect(() => {
    // Update the page title
    document.title = translate(initializeForm().title, language)

    // Upsert the page description
    let description = document.querySelector('meta[name="description"]')
    if (!description) {
      description = document.createElement('meta')
      description.setAttribute('name', 'description')
      document.head.appendChild(description)
    }
    description.setAttribute('content', translate(initializeForm().description, language))
  }, [language])

  // Check the user's browser's language and automatically match that.
  useEffect(() => {
    const codeMap: Record<string, string> = {
      en: 'en',
      'en-US': 'en',
      'en-GB': 'en',
      es: 'es',
      zh: 'zh',
    }
    const detectedLanguageCode = codeMap[navigator.language]

    if (detectedLanguageCode && !language) {
      setLanguage(detectedLanguageCode)
    }
  }, [language, setLanguage])

  const value = { language: language, setLanguage }
  return <LanguageContext.Provider value={value}>{props.children}</LanguageContext.Provider>
}
