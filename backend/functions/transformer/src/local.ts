import { handler } from './index'

async function run() {
  const req = {}
  console.log('Request: ', req)

  try {
    const resp = await handler({})
    console.log('Response: ', resp)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

run()
