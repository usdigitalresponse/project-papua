/**
 * This script will populate `form.json` with translations. It can be used in an iterative manner
 * as new copy is added to `form.json`, since it will only perform translations if a translation
 * doesn't already exist.
 *
 * Translations are stored in `form.json` like so for any translatable copy:
 *
 *   "title": {
 *      "en": "Name",
 *      "es": "Nombre",
 *      "zh": "名称"
 *   }
 *
 * This script will do a first-pass with Google Translate. It's expected that a second-pass
 * would be done by a native speaker in each supported language.
 *
 * To run this script, you'll need a Google Cloud Platform (GCP) account. You can set up your GCP
 * account by clicking the "Set up a project" button here: https://cloud.google.com/translate/docs/basic/setup-basic
 *
 * The free plan gives you about 500k chars of translations, so you'll be fine with that.
 *
 * Once you got through that setup, GCP will have you download a JSON key. You can then use that key
 * to run this script like so (make sure to update your credentials path below!):
 *
 *   GOOGLE_APPLICATION_CREDENTIALS=~/Downloads/PAPUA-59beefc0cfb4.json node ./scripts/translate.js
 *
 * This script can be extended to translate other languages by adding more `translate` calls at the
 * bottom of this script.
 *
 * If you want to re-translate all copy in `form.json`, set `FORCE=true` in your environment, like so:
 *
 *   FORCE=true GOOGLE_APPLICATION_CREDENTIALS=~/Downloads/PAPUA-59beefc0cfb4.json node ./scripts/translate.js
 */

const fs = require("fs");
const { Translate } = require("@google-cloud/translate").v2;
const translater = new Translate();

const f = fs.readFileSync("src/form.json", {
  encoding: "utf-8",
});

const form = JSON.parse(f);

async function map(f) {
  const updateQuestion = async (question) => {
    // Update the question's name
    question.name = await f(question.name);

    // Update the question's instructions, if any
    if (question.instructions) {
      question.instructions = await f(question.instructions);
    }

    // Update the question's options, if any
    if (question.options) {
      for (let i = 0; i < question.options.length; i++) {
        // Update the option's name
        question.options[i].name = await f(question.options[i].name);
      }
    }

    // Update the questions's switches, if any
    if (question.switch) {
      for (const field of Object.keys(question.switch)) {
        if (question.switch[field]) {
          for (let j = 0; j < question.switch[field].length; j++) {
            question.switch[field][j] = await updateQuestion(
              question.switch[field][j]
            );
          }
        }
      }
    }

    // Update the validation errors, if any
    if (question.validate) {
      for (let j = 0; j < question.validate.length; j++) {
        question.validate[j].error = await f(question.validate[j].error);
      }
    }

    return question;
  };

  // Update the top-level instructional copy:
  for (const id of Object.keys(form.instructions)) {
    form.instructions[id] = await f(form.instructions[id])
  }

  // Update the copy in each page:
  const pages = form.pages;
  for (let i = 0; i < pages.length; i++) {
    // Update the title
    pages[i].title = await f(pages[i].title);

    // Update the heading
    pages[i].heading = await f(pages[i].heading);

    // Update the page's instructions, if any
    if (pages[i].instructions) {
      pages[i].instructions = await f(pages[i].instructions);
    }

    // Update the question's copy:
    for (let j = 0; j < pages[i].questions.length; j++) {
      pages[i].questions[j] = await updateQuestion(pages[i].questions[j]);
    }
  }

  // Write back the updated pages
  form.pages = pages;
}

function translate(languageCode) {
  return async (copy) => {
    // Don't translate if we already have translated this field.
    if (copy[languageCode] && process.env.FORCE !== "true") {
      return copy;
    }

    try {
      const result = await translater.translate(copy.en, {
        to: languageCode,
      });
      if (result.length > 0 && result[0].length > 0) {
        return {
          ...copy,
          [languageCode]: result[0],
        };
      }
    } catch (err) {
      // If we fail to query the Google Translate API, just skip this text
      console.error({
        message: "Failed to translate text",
        copy,
        error: err,
      });
    }

    return copy;
  };
}

(async () => {
  // We originally stored copy in forms like `title: "Foo"` but
  // when we introduced i18n, we moved to a format like `title: { en: "Foo" }`
  // If you need to convert a form from the former to the latter, then 
  // uncomment the following line.
  // await map(copy => ({ en: copy}));
  
  // Add spanish translations
  await map(translate("es"));

  // Add chinese translations
  await map(translate("zh"));

  fs.writeFileSync("src/form.json", JSON.stringify(form, null, 2), {
    encoding: "utf-8",
  });
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
