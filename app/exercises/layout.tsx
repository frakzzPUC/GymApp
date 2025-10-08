import type React from "react"
import DashboardHeader from "@/components/layout/DashboardHeader"

export default function ExercisesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}