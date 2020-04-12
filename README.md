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

TBD, see: https://docs.google.com/document/d/1LJku-oOiclh6SW04nSMNv70yDbmPM3hDd_NPADV7DHU/edit#heading=h.j8g2w65tqlms

## One-Click Deploy

This doesn't yet work. We'll need to enable forking of this repo first.

[![amplifybutton](https://oneclick.amplifyapp.com/button.svg)](https://console.aws.amazon.com/amplify/home#/deploy?repo=https://github.com/usdigitalresponse/project-papua)

## Manual Deploy

```sh
# Open this repo on your local machine.
git clone git@github.com:usdigitalresponse/project-papua.git
# Install the Amplify CLI
yarn global add @aws-amplify/cli
# Configure a local AWS profile to use for Amplify.
# Make sure to save the secret access key!
amplify configure
# Compile all functions
yarn compile
# Publish to your AWS account.
amplify publish
```

# Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for additional information.

# License

[license here]
