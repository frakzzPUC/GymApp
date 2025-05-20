import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import User from "@/models/User"
import dbConnect from "@/lib/mongodb"

export async function GET() {
  try {
    await dbConnect()

    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ success: false, message: "Não autenticado" }, { status: 401 })
    }

    // Buscar o usuário atualizado do banco de dados
    const user = await User.findById(session.user.id)

    if (!user) {
      return NextResponse.json({ success: false, message: "Usuário não encontrado" }, { status: 404 })
    }

    // Retornar os dados atualizados do usuário
    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        program: user.program,
      },
    })
  } catch (error) {
    console.error("Erro ao atualizar sessão:", error)
    return NextResponse.json({ success: false, message: "Erro ao atualizar sessão" }, { status: 500 })
  }
}

// Adicionar um handler para POST para evitar erros de método não permitido
export async function POST() {
  return NextResponse.json({ success: true })
}
