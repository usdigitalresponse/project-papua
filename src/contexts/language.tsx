import React, { createContext, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const initialState = { language: 'en', setLanguage: (language: string) => {}}
export const LanguageContext = createContext(initialState);

export const LanguageProvider: React.FC = props => {
  const [language, setLanguage] = useLocalStorage<string | undefined>('papua-selected-language', undefined)

  // Check the user's browser's language and automatically match that.
  useEffect(() => {
    const codeMap: Record<string, string> = {
      "en": "en",
      "en-US": "en",
      "en-GB": "en",
      "es": "es",
      "zh": "zh"
    }
    const detectedLanguageCode = codeMap[navigator.language]

    if (detectedLanguageCode && !language) {
      setLanguage(detectedLanguageCode)
    }
  }, [language, setLanguage])

  return (
    <LanguageContext.Provider value={{ language: language || initialState.language, setLanguage }}>
      {props.children}
    </LanguageContext.Provider>
  )
}
