import { ObjectId } from "mongodb"
import { NextResponse } from "next/server"

import { auth } from "@/auth"
import { getMongoClientPromise } from "@/lib/db/mongodb"
import { getGridFsBucket } from "@/lib/db/gridfs"
import { isCdcSectionArray } from "@/lib/cdc-template"
import { updateCdcSectionSchema } from "@/lib/validators/cdc"
import { updateSection } from "@/lib/cdc-sections"

export async function GET(
  _req: Request,
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

  const client = await getMongoClientPromise()
  const db = client.db()

  const doc = await db.collection("cdc").findOne({
    _id: new ObjectId(id),
    userId: session.user.id,
  })

  if (!doc) {
    return NextResponse.json({ error: { code: "NOT_FOUND" } }, { status: 404 })
  }

  return NextResponse.json({ item: doc })
}

export async function PATCH(
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

  const body = await request.json().catch(() => null)
  const parsed = updateCdcSectionSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", issues: parsed.error.issues } },
      { status: 400 }
    )
  }

  const client = await getMongoClientPromise()
  const db = client.db()

  const existing = await db.collection("cdc").findOne({
    _id: new ObjectId(id),
    userId: session.user.id,
  })

  if (!existing) {
    return NextResponse.json({ error: { code: "NOT_FOUND" } }, { status: 404 })
  }

  const currentSections = (existing as { sections?: unknown }).sections
  if (!isCdcSectionArray(currentSections)) {
    return NextResponse.json(
      { error: { code: "INVALID_STATE" } },
      { status: 409 }
    )
  }

  const res = updateSection(currentSections, parsed.data.key, {
    title: parsed.data.title,
    content: parsed.data.content,
  })

  if (!res.updated) {
    return NextResponse.json(
      { error: { code: "SECTION_NOT_FOUND" } },
      { status: 404 }
    )
  }

  const now = new Date()

  await db.collection("cdc").updateOne(
    { _id: new ObjectId(id), userId: session.user.id },
    {
      $set: { sections: res.sections, updatedAt: now },
      $inc: { version: 1 },
    }
  )

  return NextResponse.json({ ok: true })
}

export async function DELETE(
  _req: Request,
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
  const cdcObjectId = new ObjectId(id)

  const client = await getMongoClientPromise()
  const db = client.db()

  // Delete associated GridFS assets first
  const assets = await db
    .collection("assets.files")
    .find({ "metadata.userId": session.user.id, "metadata.cdcId": id })
    .toArray()

  const bucket = await getGridFsBucket()

  for (const a of assets as Array<{ _id: ObjectId }>) {
    await bucket.delete(a._id)
  }

  await db.collection("cdc").deleteOne({ _id: cdcObjectId, userId: session.user.id })

  return NextResponse.json({ ok: true })
}
