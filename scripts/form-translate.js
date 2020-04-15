const fs = require('fs')

const f = fs.readFileSync('form.json', {
  encoding: 'utf-8'
})

const form = JSON.parse(f)
console.log(form)

const pages = form.pages
const translations = {}

for (let i = 0; i < pages.length; i++) {
  const pageNamespace = pages[i].title.replace(/\s/g, '_').toLowerCase()

  // Update the title
  let translationID = pageNamespace + "-title"
  translations[translationID] = { en: pages[i].title }
  pages[i].title = "translation:" + translationID

  // Update the heading
  translationID = pageNamespace + "-heading"
  translations[pageNamespace + "-heading"] = { en: pages[i].heading }
  pages[i].heading = "translation:" + translationID

  // Update the page's instructions, if any
  if (pages[i].instructions) {
    translationID = pages[i].id + "-instructions"
    translations[translationID] = { en: pages[i].instructions }
    pages[i].instructions = "translation:" + translationID
  }

  // Update the question's copy:
  for (let j = 0; j < pages[i].questions.length; j++) {
    // Update the question's name
    translationID = pages[i].questions[j].id + "-name"
    translations[translationID] = { en: pages[i].questions[j].name }
    pages[i].questions[j].name = "translation:" + translationID

    // Update the question's instructions, if any
    if (pages[i].questions[j].instructions) {
      translationID = pages[i].questions[j].id + "-instructions"
      translations[translationID] = { en: pages[i].questions[j].instructions }
      pages[i].questions[j].instructions = "translation:" + translationID
    }

    // Update the question's options, if any
    if (pages[i].questions[j].options) {
      for (let k = 0; k < pages[i].questions[j].options.length; k++) {
        // Update the option's name
        translationID = pages[i].questions[j].id + "-" + pages[i].questions[j].options[k].id + "-name"
        translations[translationID] = { en: pages[i].questions[j].options[k].name }
        pages[i].questions[j].options[k].name = "translation:" + translationID
      }
    }

    // Update the questions's switches, if any

    // Update the validation errors, if any
  }
}

// Write back with the translations embedded
form.translations = translations
// and the updated pages
form.pages = pages
fs.writeFileSync('form-translations.json', JSON.stringify(form, null, 2), {
  encoding: 'utf-8'
})
