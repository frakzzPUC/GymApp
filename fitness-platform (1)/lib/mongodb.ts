import mongoose, { Mongoose } from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI || ""

if (!MONGODB_URI) {
  throw new Error("Por favor, defina a variável de ambiente MONGODB_URI dentro de .env.local")
}

// Declaração global para manter cache da conexão
declare global {
  var mongooseGlobal: {
    conn: Mongoose | null
    promise: Promise<Mongoose> | null
  }
}

let cached = globalThis.mongooseGlobal

if (!cached) {
  cached = globalThis.mongooseGlobal = { conn: null, promise: null }
}

async function dbConnect(): Promise<Mongoose> {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts)
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default dbConnect
