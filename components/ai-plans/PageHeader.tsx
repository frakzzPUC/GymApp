import React from "react"
import { Sparkles } from "lucide-react"

interface PageHeaderProps {
  title: string
  description: string
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
        <Sparkles className="h-8 w-8 text-emerald-600" />
        {title}
      </h1>
      <p className="text-lg text-gray-600">
        {description}
      </p>
    </div>
  )
}