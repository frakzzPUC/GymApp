import type React from "react";
import AuthGuard from "@/components/auth-guard";
import DashboardHeader from "@/components/layout/DashboardHeader";

export default function ProgressLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <main className="flex-1">{children}</main>
      </div>
    </AuthGuard>
  );
}
