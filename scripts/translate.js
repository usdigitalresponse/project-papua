const fs = require('fs')

const f = fs.readFileSync('form.json', {
  encoding: 'utf-8'
})

const form = JSON.parse(f)
console.log(form)

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
    // Update the question's name
    pages[i].questions[j].name = { en: pages[i].questions[j].name }

    // Update the question's instructions, if any
    if (pages[i].questions[j].instructions) {
      pages[i].questions[j].instructions = { en: pages[i].questions[j].instructions }
    }

    // Update the question's options, if any
    if (pages[i].questions[j].options) {
      for (let k = 0; k < pages[i].questions[j].options.length; k++) {
        // Update the option's name
        pages[i].questions[j].options[k].name = { en: pages[i].questions[j].options[k].name }
      }
    }

    // Update the questions's switches, if any

    // Update the validation errors, if any
  }
}

// Write back the updated pages
form.pages = pages
fs.writeFileSync('form-translations.json', JSON.stringify(form, null, 2), {
  encoding: 'utf-8'
})
