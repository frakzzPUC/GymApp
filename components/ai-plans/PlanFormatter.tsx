import React from "react"

interface PlanFormatterProps {
  text: string
}

export function PlanFormatter({ text }: PlanFormatterProps) {
  const formatPlanText = (text: string) => {
    return text.split('\n').map((line, index) => {
      // Headers (linhas que começam com #)
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-2xl font-bold mt-6 mb-3 text-gray-800">{line.substring(2)}</h1>
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-xl font-semibold mt-5 mb-2 text-gray-700">{line.substring(3)}</h2>
      }
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-lg font-medium mt-4 mb-2 text-gray-600">{line.substring(4)}</h3>
      }
      
      // Listas (linhas que começam com -)
      if (line.startsWith('- ')) {
        return <li key={index} className="ml-4 mb-1 text-gray-700">{line.substring(2)}</li>
      }
      
      // Texto em negrito (**texto**)
      if (line.includes('**')) {
        const parts = line.split('**')
        return (
          <p key={index} className="mb-2 text-gray-700">
            {parts.map((part, i) => 
              i % 2 === 1 ? <strong key={i}>{part}</strong> : part
            )}
          </p>
        )
      }
      
      // Linhas vazias
      if (line.trim() === '') {
        return <br key={index} />
      }
      
      // Texto normal
      return <p key={index} className="mb-2 text-gray-700">{line}</p>
    })
  }

  return (
    <div className="prose max-w-none">
      {formatPlanText(text)}
    </div>
  )
}