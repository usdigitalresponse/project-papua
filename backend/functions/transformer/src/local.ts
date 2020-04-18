import { readFileSync } from 'fs'
import { handler } from './index'

async function run() {
  let req = {}
  try {
    const stdinFD = 0
    const input = readFileSync(stdinFD, 'utf-8')
    if (input !== '') {
      req = JSON.parse(input)
    }
  } catch (err) {
    console.error('Failed JSON.parse stdin: ', err)
  }

  try {
    const resp = await handler(req)
    console.log('Response: ', resp)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

run()
