import { GridFSBucket, ObjectId } from "mongodb"

import { getMongoClientPromise } from "@/lib/db/mongodb"

export async function getGridFsBucket() {
  const client = await getMongoClientPromise()
  const db = client.db()
  return new GridFSBucket(db, { bucketName: "assets" })
}

export function toObjectId(value: string) {
  return new ObjectId(value)
}
