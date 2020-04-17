# Project PAPUA

The Pilot Application for Pandemic Unemployment Assistance (PAPUA) project is a prototype service providing a unified unemployment intake form and delivers high unemployment claims to various State backends.

[screenshots]

# Technical overview

[overview here]

# Documentation

[link(s) to documentation]

# Running locally

To run the app locally, just do the following:

```bash
$ yarn start
```

To build the app, run:

```bash
$ yarn build
```

To run tests, run:

```bash
$ yarn test
```

# Deploying

To deploy PAPUA for your state:

1. Click the following button to deploy to your state's AWS account:

[![amplifybutton](https://oneclick.amplifyapp.com/button.svg)](https://console.aws.amazon.com/amplify/home#/deploy?repo=https://github.com/usdigitalresponse/project-papua)

During this setup, make sure to:

- Click `Environment Variables` and set `STATE_CODE` to `csv`. We'll update this to use your state code below.

Your fork is now configured to auto-deploy the `master` branch to your Amplify deployment.

3. [Optional] Update the questions used in your state's PAPUA form by editing `forms.json` and committing those changes to the `master` branch of your fork.

4. [Optional] Update the state logo by dropping a `<state code>.png` file into `public` and commiting that change to the `master` branch of your fork.

5. [Optional] By default, this system will produce an hourly CSV of claim submissions. If you want to customize this, you can implement a "transformer" which will write claims in batches into your state's system. You can do this by adding a file to `backend/functions/transformer/src/transformers/<state code>.ts` where `<state code>` is your state's two-letter state abbreviation (CA, OR, etc.).

Inside that file, implement a function like so:

```ts
// backend/functions/transformer/src/transformers/<state code>.ts
import { Transformer } from "./index";

// Name this function the same name as your state code.
//
// cfg includes the hour/day of this run.
// claims includes an array of all JSON claims uploaded in the previous hour.
export const ca: Transformer = async (cfg, claims) => {
  // TODO(you): write `claims` into your system.

  return {};
};
```

You can this commit this file to the `master` branch in your fork, which will update your deployment on Amplify. To switch the backend transformer from the default (`csv`) to your state's (`<state code>`) just update the `STATE_CODE` environment variable.

At this point, you can now reboot your Lambda to pick up this environment change by clicking on your backend environment and selecting `Redeploy this version`.

6. [Optional] Redirect a subdomain from your state's website to this Amplify app. [Docs](https://docs.aws.amazon.com/amplify/latest/userguide/custom-domains.html)

# Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for additional information.

# License

[license here]
