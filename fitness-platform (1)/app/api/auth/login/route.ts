import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"

export async function POST(req: NextRequest) {
  try {
    await dbConnect()

    const body = await req.json()
    const { email, password } = body

    // Validação básica
    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email e senha são obrigatórios" }, { status: 400 })
    }

    // Verificar se o usuário existe
    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ success: false, message: "Credenciais inválidas" }, { status: 401 })
    }

    // Verificar a senha
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return NextResponse.json({ success: false, message: "Credenciais inválidas" }, { status: 401 })
    }

    // Gerar token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret", { expiresIn: "7d" })

    // Remover a senha do objeto de resposta
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      birthdate: user.birthdate,
      program: user.program,
    }

    return NextResponse.json({ success: true, token, user: userResponse }, { status: 200 })
  } catch (error) {
    console.error("Erro ao fazer login:", error)
    return NextResponse.json({ success: false, message: "Erro ao fazer login" }, { status: 500 })
  }
}
