import { auth } from "@/auth"
import { getMongoClientPromise } from "@/lib/db/mongodb"

export const runtime = "nodejs"

type AssetListItem = {
  assetId: string
  fileName: string
  mimeType: string
  size: number
  uploadedAt: string
  url: string
  metadata?: {
    cdcId?: string
    sectionKey?: string
  }
}

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 })
  }

  const url = new URL(req.url)
  const q = url.searchParams.get("q")?.trim()
  const cdcId = url.searchParams.get("cdcId")?.trim()

  const filter: Record<string, unknown> = {
    "metadata.userId": session.user.id,
  }

  if (q) {
    filter.filename = { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" }
  }

  if (cdcId) {
    filter["metadata.cdcId"] = cdcId
  }

  const client = await getMongoClientPromise()
  const db = client.db()

  const docs = await db
    .collection("assets.files")
    .find(filter)
    .sort({ uploadDate: -1 })
    .limit(200)
    .project({
      filename: 1,
      length: 1,
      uploadDate: 1,
      contentType: 1,
      metadata: 1,
    })
    .toArray()

  const items: AssetListItem[] = docs.map((d) => {
    const doc = d as {
      _id: unknown
      filename?: unknown
      length?: unknown
      uploadDate?: unknown
      contentType?: unknown
      metadata?: unknown
    }

    const metadata =
      doc.metadata && typeof doc.metadata === "object"
        ? (doc.metadata as {
            cdcId?: unknown
            sectionKey?: unknown
          })
        : undefined

    const assetId = String(doc._id)

    return {
      assetId,
      fileName: typeof doc.filename === "string" ? doc.filename : assetId,
      mimeType: typeof doc.contentType === "string" ? doc.contentType : "",
      size: typeof doc.length === "number" ? doc.length : 0,
      uploadedAt:
        doc.uploadDate instanceof Date
          ? doc.uploadDate.toISOString()
          : new Date().toISOString(),
      url: `/api/assets/${assetId}`,
      metadata: metadata
        ? {
            cdcId: typeof metadata.cdcId === "string" ? metadata.cdcId : undefined,
            sectionKey:
              typeof metadata.sectionKey === "string" ? metadata.sectionKey : undefined,
          }
        : undefined,
    }
  })

  return Response.json({ items })
}
