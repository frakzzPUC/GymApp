import type { Metadata } from "next";
import AuthGuard from "@/components/auth-guard";
import DashboardHeader from "@/components/layout/DashboardHeader";

export const metadata: Metadata = {
  title: "Competições - FitJourney",
  description:
    "Desafie seus amigos e motive-se a alcançar seus objetivos fitness",
};

export default function CompetitionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <DashboardHeader />
      <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {children}
      </main>
    </AuthGuard>
  );
}
