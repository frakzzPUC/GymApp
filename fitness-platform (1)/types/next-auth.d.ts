import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      program?: string | null
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    program?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    program?: string | null
  }
}
