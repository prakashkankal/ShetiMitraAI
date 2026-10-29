import dns from 'node:dns'
import mongoose from 'mongoose'
import { config } from './env.js'

// Fix for Node.js querySrv ECONNREFUSED on Windows / ISP routers that block SRV records
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1'])
} catch {
  // Safe fallback if environment prohibits custom DNS servers
}

export async function connectDB() {
  try {
    const conn = await mongoose.connect(config.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    })
    console.log(`[DB] Connected: ${conn.connection.host}`)
  } catch (err) {
    console.error('[DB] Connection failed:', err.message)
    process.exit(1)
  }
}

mongoose.connection.on('disconnected', () => {
  console.warn('[DB] Disconnected from MongoDB')
})

async function gracefulShutdown(signal) {
  console.log(`\n[DB] ${signal} received. Closing MongoDB connection...`)
  await mongoose.connection.close()
  process.exit(0)
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'))
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
