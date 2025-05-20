import mongoose, { Mongoose } from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI || ""

if (!MONGODB_URI) {
  throw new Error("Por favor, defina a variável de ambiente MONGODB_URI dentro de .env.local")
}

// Definição do tipo global (necessário para Next.js com hot reload)
declare global {
  var mongoose: { conn: Mongoose | null; promise: Promise<Mongoose> | null }
}

const globalWithMongoose = global as typeof globalThis & {
  mongoose: { conn: Mongoose | null; promise: Promise<Mongoose> | null }
}

if (!globalWithMongoose.mongoose) {
  globalWithMongoose.mongoose = { conn: null, promise: null }
}

async function dbConnect(): Promise<Mongoose> {
  if (globalWithMongoose.mongoose.conn) {
    return globalWithMongoose.mongoose.conn
  }

  if (!globalWithMongoose.mongoose.promise) {
    const opts = {
      bufferCommands: false,
    }

    globalWithMongoose.mongoose.promise = mongoose.connect(MONGODB_URI, opts)
  }

  try {
    globalWithMongoose.mongoose.conn = await globalWithMongoose.mongoose.promise
  } catch (e) {
    globalWithMongoose.mongoose.promise = null
    throw e
  }

  return globalWithMongoose.mongoose.conn
}

export default dbConnect
