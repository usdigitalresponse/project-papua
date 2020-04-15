const fs = require('fs')

const f = fs.readFileSync('form.json', {
  encoding: 'utf-8'
})

const form = JSON.parse(f)

const pages = form.pages

function translate(f) {
  const updateQuestion = (question) => {
    // Update the question's name
    question.name = f(question.name)
  
    // Update the question's instructions, if any
    if (question.instructions) {
      question.instructions = f(question.instructions)
    }
  
    // Update the question's options, if any
    if (question.options) {
      for (let i = 0; i < question.options.length; i++) {
        // Update the option's name
        question.options[i].name = f(question.options[i].name)
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
    if (question.validate) {
      for (let j = 0; j < question.validate.length; j++) {
        question.validate[j].error = f(question.validate[j].error)
      }
    }
  
    return question
  }

  for (let i = 0; i < pages.length; i++) {
    // Update the title
    pages[i].title = f(pages[i].title)
  
    // Update the heading
    pages[i].heading = f(pages[i].heading)
  
    // Update the page's instructions, if any
    if (pages[i].instructions) {
      pages[i].instructions = f(pages[i].instructions)
    }
  
    // Update the question's copy:
    for (let j = 0; j < pages[i].questions.length; j++) {
      pages[i].questions[j] = updateQuestion(pages[i].questions[j])
    }
  }

  // Write back the updated pages
  form.pages = pages
}

// First pass, convert `title: "Foo"` to `title: { en: "Foo" }`
// this translates from our initial forms format to the new
// version that includes translated copy.
translate((copy) => ({ en: copy }))

// Add spanish translations 
translate((copy) => {
  return {
    ...copy,
    es: copy.sp || `es:${copy.en}`,
  }
})

// Add chinese translations 
translate((copy) => {
  return {
    ...copy,
    zh: copy.sp || `zh:${copy.en}`,
  }
})

fs.writeFileSync('form-translations.json', JSON.stringify(form, null, 2), {
  encoding: 'utf-8'
})
