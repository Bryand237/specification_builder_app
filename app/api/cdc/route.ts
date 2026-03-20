import { NextResponse } from "next/server"

import { auth } from "@/auth"
import { getMongoClientPromise } from "@/lib/db/mongodb"
import { createCdcSchema } from "@/lib/validators/cdc"
import { buildDefaultCdcSections } from "@/lib/cdc-template"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED" } },
      { status: 401 }
    )
  }

  const client = await getMongoClientPromise()
  const db = client.db()

  const items = await db
    .collection("cdc")
    .find({ userId: session.user.id })
    .project({ sections: 0 })
    .sort({ createdAt: -1 })
    .limit(50)
    .toArray()

  return NextResponse.json({ items })
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED" } },
      { status: 401 }
    )
  }

  const body = await request.json().catch(() => null)
  const parsed = createCdcSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", issues: parsed.error.issues } },
      { status: 400 }
    )
  }

  const client = await getMongoClientPromise()
  const db = client.db()

  const now = new Date()

  const sections = parsed.data.sections ?? buildDefaultCdcSections()

  const result = await db.collection("cdc").insertOne({
    userId: session.user.id,
    title: parsed.data.title,
    description: parsed.data.description,
    sections,
    version: 1,
    createdAt: now,
    updatedAt: now,
  })

  return NextResponse.json(
    { cdcId: String(result.insertedId) },
    { status: 201 }
  )
}
