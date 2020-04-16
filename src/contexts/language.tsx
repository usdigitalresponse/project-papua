import React, { createContext, useState, useEffect } from 'react'

const initialState = { language: 'en', setLanguage: (language: string) => {}}
export const LanguageContext = createContext(initialState);

export const LanguageProvider: React.FC = props => {
  const [language, setLanguage] = useState(initialState.language)

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

    if (detectedLanguageCode) {
      setLanguage(detectedLanguageCode)
    }
  }, [])

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {props.children}
    </LanguageContext.Provider>
  )
}
