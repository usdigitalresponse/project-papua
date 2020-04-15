const fs = require('fs')

const f = fs.readFileSync('form.json', {
  encoding: 'utf-8'
})

const form = JSON.parse(f)

const pages = form.pages

for (let i = 0; i < pages.length; i++) {
  // Update the title
  pages[i].title = { en: pages[i].title }

  // Update the heading
  pages[i].heading = { en: pages[i].heading }

  // Update the page's instructions, if any
  if (pages[i].instructions) {
    pages[i].instructions = { en: pages[i].instructions }
  }

  // Update the question's copy:
  for (let j = 0; j < pages[i].questions.length; j++) {
    pages[i].questions[j] = updateQuestion(pages[i].questions[j])
  }
}

function updateQuestion(question) {
  // Update the question's name
  question.name = { en: question.name }

  // Update the question's instructions, if any
  if (question.instructions) {
    question.instructions = { en: question.instructions }
  }

  // Update the question's options, if any
  if (question.options) {
    for (let i = 0; i < question.options.length; i++) {
      // Update the option's name
      question.options[i].name = { en: question.options[i].name }
    }
  }

  // Update the questions's switches, if any
  if (question.switch) {
    for (const field of Object.keys(question.switch)) {
      if (question.switch[field]) {
        for (let j = 0; j < question.switch[field].length; j++) {
          question.switch[field][j] = updateQuestion(question.switch[field][j])
        }
      }
    }
  }

  // Update the validation errors, if any

  return question
}

// Write back the updated pages
form.pages = pages
fs.writeFileSync('form-translations.json', JSON.stringify(form, null, 2), {
  encoding: 'utf-8'
})
