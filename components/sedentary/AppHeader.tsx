import React from "react"

interface AppHeaderProps {
  title?: string
}

export function AppHeader({ title = "FitJourney" }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <div className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-xl">{title}</span>
          </div>
        </div>
      </div>
    </header>
  )
}