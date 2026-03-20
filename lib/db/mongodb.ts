import { MongoClient } from "mongodb"

import { env } from "@/lib/env"

const globalForMongo = globalThis as typeof globalThis & {
  __mongoClientPromise?: Promise<MongoClient>
}

function createMongoClient() {
  return new MongoClient(env.MONGODB_URI)
}

export function getMongoClientPromise() {
  if (process.env.NODE_ENV === "development") {
    if (!globalForMongo.__mongoClientPromise) {
      globalForMongo.__mongoClientPromise = createMongoClient().connect()
    }
    return globalForMongo.__mongoClientPromise
  }

  return createMongoClient().connect()
}

export async function getDb() {
  const client = await getMongoClientPromise()
  return client.db()
}
