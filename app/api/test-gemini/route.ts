import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    
    if (!apiKey) {
      return NextResponse.json({ 
        error: "GEMINI_API_KEY não encontrada" 
      }, { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    
    // Lista de modelos para testar
    const modelsToTry = [
      "gemini-1.5-pro",
      "gemini-1.5-flash", 
      "gemini-pro-vision",
      "text-bison-001"
    ]

    let lastError = null
    
    for (const modelName of modelsToTry) {
      try {
        console.log(`Testando modelo: ${modelName}`)
        const model = genAI.getGenerativeModel({ model: modelName })
        
        const result = await model.generateContent("Diga olá")
        const response = await result.response
        const text = response.text()

        return NextResponse.json({ 
          success: true, 
          message: "Gemini API funcionando",
          modelUsed: modelName,
          response: text 
        })
      } catch (error) {
        console.log(`Modelo ${modelName} falhou:`, error)
        lastError = error
        continue
      }
    }

    // Se chegou aqui, todos os modelos falharam
    return NextResponse.json({ 
      error: "Nenhum modelo Gemini funcionou",
      details: lastError instanceof Error ? lastError.message : "Erro desconhecido",
      testedModels: modelsToTry
    }, { status: 500 })

  } catch (error) {
    console.error("Erro ao testar Gemini:", error)
    return NextResponse.json({ 
      error: "Erro ao conectar com Gemini API",
      details: error instanceof Error ? error.message : "Erro desconhecido"
    }, { status: 500 })
  }
}