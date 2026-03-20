import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import bcrypt from "bcryptjs"

import { getMongoClientPromise } from "@/lib/db/mongodb"
import { env } from "@/lib/env"
import { loginSchema } from "@/lib/validators/auth"

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: env.AUTH_SECRET,
  adapter: MongoDBAdapter(getMongoClientPromise()),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) {
          return null
        }

        const { email, password } = parsed.data
        const client = await getMongoClientPromise()
        const db = client.db()
        const user = await db.collection("users").findOne({ email })

        if (!user) {
          return null
        }

        const passwordHash = (user as { passwordHash?: string }).passwordHash
        if (!passwordHash) {
          return null
        }

        const ok = await bcrypt.compare(password, passwordHash)
        if (!ok) {
          return null
        }

        return {
          id: String(user._id),
          email: (user as { email?: string }).email,
          name:
            (user as { name?: string }).name ||
            `${(user as { firstName?: string }).firstName ?? ""} ${(user as { lastName?: string }).lastName ?? ""}`.trim(),
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token?.sub) {
        session.user.id = token.sub
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
})
