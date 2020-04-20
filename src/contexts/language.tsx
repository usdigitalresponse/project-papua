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

  const updateTitleAndDescription = (languageCode: string) => {
    // Update the page title
    document.title = translate(initializeForm().title, languageCode)

    // Upsert the page description
    let description = document.querySelector('meta[name="description"]')
    if (!description) {
      description = document.createElement('meta')
      description.setAttribute('name', 'description')
      document.head.appendChild(description)
    }
    description.setAttribute('content', translate(initializeForm().description, languageCode))
  }

  const changeLanguage = (languageCode: string) => {
    updateTitleAndDescription(languageCode)
    setLanguage(languageCode)
  }

  useEffect(() => {
    updateTitleAndDescription(language)
  }, [])

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
      changeLanguage(detectedLanguageCode)
    }
  }, [language, changeLanguage])

  const value = { language: language, setLanguage: changeLanguage }
  return <LanguageContext.Provider value={value}>{props.children}</LanguageContext.Provider>
}
