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
          const oldSwitch = question.switch[switchKey]
          const newSwitch: Question[] = []
          for (let si = 0; si < oldSwitch.length; si++) {
            const value = oldSwitch[si]
            if (typeof value === 'string' && value.startsWith('definition:')) {
              const definitionID = value.replace(/^definition:/, '')
              const definition = form.definitions![definitionID]
              if (!definition) {
                console.error(`Unknown question set definition: ${definitionID}`)
                continue
              }
              newSwitch.push(...transformInlineDefinitionsQuestions(definition))
            } else {
              newSwitch.push(...transformInlineDefinitionsQuestions([value as Question]))
            }
          }
          questions[qi].switch![switchKey] = newSwitch
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
