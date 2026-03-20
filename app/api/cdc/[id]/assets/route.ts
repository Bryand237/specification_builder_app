import { ObjectId } from "mongodb"
import { NextResponse } from "next/server"

import { auth } from "@/auth"
import { getMongoClientPromise } from "@/lib/db/mongodb"
import { isCdcSectionArray } from "@/lib/cdc-template"
import { getGridFsBucket, toObjectId } from "@/lib/db/gridfs"
import { addAssetToSection } from "@/lib/cdc-sections"

export async function POST(
  request: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED" } },
      { status: 401 }
    )
  }

  const { id } = await ctx.params

  const formData = await request.formData()
  const file = formData.get("file")
  const sectionKey = String(formData.get("sectionKey") ?? "")

  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { error: { code: "MISSING_FILE" } },
      { status: 400 }
    )
  }

  if (!sectionKey) {
    return NextResponse.json(
      { error: { code: "MISSING_SECTION_KEY" } },
      { status: 400 }
    )
  }

  const client = await getMongoClientPromise()
  const db = client.db()

  const cdc = await db.collection("cdc").findOne({
    _id: new ObjectId(id),
    userId: session.user.id,
  })

  if (!cdc) {
    return NextResponse.json({ error: { code: "NOT_FOUND" } }, { status: 404 })
  }

  const mimeType = file.type || "application/octet-stream"
  if (!mimeType.startsWith("image/")) {
    return NextResponse.json(
      { error: { code: "UNSUPPORTED_FILE_TYPE" } },
      { status: 415 }
    )
  }

  const bucket = await getGridFsBucket()

  const buffer = Buffer.from(await file.arrayBuffer())
  const uploadStream = bucket.openUploadStream(file.name, {
    contentType: mimeType,
    metadata: {
      userId: session.user.id,
      cdcId: id,
      sectionKey,
    },
  })

  uploadStream.end(buffer)

  await new Promise<void>((resolve, reject) => {
    uploadStream.on("finish", () => resolve())
    uploadStream.on("error", (err) => reject(err))
  })

  const assetId = String(uploadStream.id)
  const url = `/api/assets/${assetId}`

  const currentSections = (cdc as { sections?: unknown }).sections
  if (!isCdcSectionArray(currentSections)) {
    return NextResponse.json(
      { error: { code: "INVALID_STATE" } },
      { status: 409 }
    )
  }

  const addRes = addAssetToSection(currentSections, sectionKey, {
    assetId,
    fileName: file.name,
    mimeType,
    url,
  })

  if (!addRes.updated) {
    await (await getGridFsBucket()).delete(toObjectId(assetId))
    return NextResponse.json(
      { error: { code: "SECTION_NOT_FOUND" } },
      { status: 404 }
    )
  }

  const now = new Date()

  await db.collection("cdc").updateOne(
    { _id: new ObjectId(id), userId: session.user.id },
    {
      $set: { sections: addRes.sections, updatedAt: now },
      $inc: { version: 1 },
    }
  )

  return NextResponse.json({ assetId, url }, { status: 201 })
}
