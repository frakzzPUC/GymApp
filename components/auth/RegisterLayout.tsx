import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/data-display/card"

interface RegisterLayoutProps {
  children: React.ReactNode
}

export function RegisterLayout({ children }: RegisterLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/50 dark:to-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Criar Conta
          </CardTitle>
          <CardDescription className="text-center">
            Preencha os dados abaixo para criar sua conta
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {children}
        </CardContent>
        
        <CardFooter className="flex flex-col">
          <div className="mt-2 text-center text-sm">
            Já tem uma conta?{" "}
            <Link 
              href="/login" 
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Entrar
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}