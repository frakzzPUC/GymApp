import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    return NextResponse.json({ success: true, session });
  } catch (error) {
    console.error('Erro ao obter sessão:', error);
    return NextResponse.json({ success: false, message: 'Erro ao obter sessão' }, { status: 500 });
  }
}