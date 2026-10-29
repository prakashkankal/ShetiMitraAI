import { config } from './config/env.js'
import { connectDB } from './config/database.js'
import app from './app.js'

async function startServer() {
  await connectDB()

  const server = app.listen(config.PORT, () => {
    console.log(`[Server] ShetiMitra AI backend running on port ${config.PORT} [${config.NODE_ENV}]`)
    console.log(`[Server] API: http://localhost:${config.PORT}/api/v1/health`)
  })

  server.on('error', (err) => {
    console.error('[Server] Fatal error:', err)
    process.exit(1)
  })
}

startServer()
