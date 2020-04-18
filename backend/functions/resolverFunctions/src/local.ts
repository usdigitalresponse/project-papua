import { app } from './app'

// You can run the API locally using `yarn backend`
const port = process.env.PORT || 3050
app.listen(port, () => {
  console.log(`API listening on port ${port}`)
})
