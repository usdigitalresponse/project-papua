import { Form, Question } from './types'

export function transformInlineDefinitions(form: Form): Form {
  if (!form.definitions) {
    return form
  }

  const transformInlineDefinitionsQuestions = (questions: Question[]): Question[] => {
    for (let qi = 0; qi < questions.length; qi++) {
      const question = questions[qi]
      if (question.switch) {
        for (const switchKey of Object.keys(question.switch)) {
          const value = question.switch[switchKey]
          if (typeof value === 'string' && value.startsWith('definition:')) {
            const definitionID = value.replace(/^definition:/, '')
            const definition = form.definitions![definitionID]
            if (!definition) {
              console.error(`Unknown question set definition: ${definitionID}`)
            }
            questions[qi].switch![switchKey] = definition
          } else {
            questions[qi].switch![switchKey] = transformInlineDefinitionsQuestions(
              question.switch[switchKey] as Question[]
            )
          }
        }
      }
    }

    return questions
  }

  for (let pi = 0; pi < form.pages.length; pi++) {
    form.pages[pi].questions = transformInlineDefinitionsQuestions(form.pages[pi].questions)
  }

  return form
}
