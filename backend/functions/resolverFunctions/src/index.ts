import awsServerlessExpress from 'aws-serverless-express'
import { app } from './app'

const server = awsServerlessExpress.createServer(app)

export async function handler(event: any, context: any) {
  return await awsServerlessExpress.proxy(server, event, context, 'PROMISE').promise
}
