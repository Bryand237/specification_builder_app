import { ObjectId } from "mongodb"
import { Readable } from "node:stream"

import { auth } from "@/auth"
import { getMongoClientPromise } from "@/lib/db/mongodb"
import { getGridFsBucket } from "@/lib/db/gridfs"

type AssetFileDoc = {
  _id: ObjectId
  contentType?: string
  metadata?: {
    userId?: string
    cdcId?: string
    sectionKey?: string
  }
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ assetId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 })
  }

  const { assetId } = await ctx.params

  const client = await getMongoClientPromise()
  const db = client.db()

  const fileDoc = await db
    .collection("assets.files")
    .findOne({ _id: new ObjectId(assetId) })

  if (!fileDoc) {
    return new Response("Not found", { status: 404 })
  }

  const { metadata } = fileDoc as AssetFileDoc
  if (!metadata || metadata.userId !== session.user.id) {
    return new Response("Not found", { status: 404 })
  }

  const bucket = await getGridFsBucket()
  const download = bucket.openDownloadStream(new ObjectId(assetId))

  const webStream = Readable.toWeb(download) as ReadableStream

  return new Response(webStream, {
    headers: {
      "Content-Type":
        (fileDoc as AssetFileDoc).contentType || "application/octet-stream",
      "Cache-Control": "private, max-age=3600",
    },
  })
}
