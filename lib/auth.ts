import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import dbConnect from "./mongodb"
import User from "@/models/User"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          await dbConnect()

          // Encontrar usuário pelo email
          const user = await User.findOne({ email: credentials.email })

          if (!user) {
            return null
          }

          // Verificar senha
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

          if (!isPasswordValid) {
            return null
          }

          // Retornar objeto do usuário sem a senha
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            program: user.program,
          }
        } catch (error) {
          console.error("Erro na autenticação:", error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Quando o usuário faz login
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.program = user.program
      }

      // Quando a sessão é atualizada
      if (trigger === "update" && session) {
        if (session.program) {
          token.program = session.program
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.program = token.program
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.JWT_SECRET,
}
