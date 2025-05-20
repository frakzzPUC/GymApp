import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"

export async function POST(req: NextRequest) {
  try {
    await dbConnect()

    const body = await req.json()
    const { name, email, phone, birthdate, password, confirmPassword } = body

    // Validação básica
    if (!name || !email || !phone || !birthdate || !password) {
      return NextResponse.json({ success: false, message: "Todos os campos são obrigatórios" }, { status: 400 })
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ success: false, message: "As senhas não coincidem" }, { status: 400 })
    }

    // Verificar se o email já está em uso
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ success: false, message: "Este email já está em uso" }, { status: 400 })
    }

    // Hash da senha
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Criar novo usuário
    const user = await User.create({
      name,
      email,
      phone,
      birthdate,
      password: hashedPassword,
    })

    // Remover a senha do objeto de resposta
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      birthdate: user.birthdate,
    }

    return NextResponse.json({ success: true, data: userResponse }, { status: 201 })
  } catch (error) {
    console.error("Erro ao registrar usuário:", error)
    return NextResponse.json({ success: false, message: "Erro ao registrar usuário" }, { status: 500 })
  }
}
