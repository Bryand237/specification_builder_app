import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

import { getMongoClientPromise } from "@/lib/db/mongodb"
import { signupSchema } from "@/lib/validators/auth"

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const parsed = signupSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", issues: parsed.error.issues } },
      { status: 400 }
    )
  }

  const { firstName, lastName, email, phone, username, password } = parsed.data

  const client = await getMongoClientPromise()
  const db = client.db()

  const existing = await db
    .collection("users")
    .findOne({ $or: [{ email }, { username }] })

  if (existing) {
    return NextResponse.json(
      { error: { code: "USER_ALREADY_EXISTS" } },
      { status: 409 }
    )
  }

  const passwordHash = await bcrypt.hash(password, 12)

  const now = new Date()

  const result = await db.collection("users").insertOne({
    firstName,
    lastName,
    email,
    phone,
    username,
    passwordHash,
    createdAt: now,
    updatedAt: now,
  })

  return NextResponse.json({ userId: String(result.insertedId) }, { status: 201 })
}
