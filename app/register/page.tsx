"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/actions/button"
import { Input } from "@/components/ui/form/input"
import { Label } from "@/components/ui/form/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/data-display/card"
import { Alert, AlertDescription } from "@/components/ui/feedback/alert"
import { AlertCircle } from "lucide-react"
import { signIn } from "next-auth/react"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [birthdate, setBirthdate] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState<{
    name?: string
    email?: string
    phone?: string
    birthdate?: string
    password?: string
    confirmPassword?: string
  }>({})
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const validateForm = () => {
    const newErrors: {
      name?: string
      email?: string
      phone?: string
      birthdate?: string
      password?: string
      confirmPassword?: string
    } = {}

    // Validar nome
    if (!name.trim()) {
      newErrors.name = "Nome é obrigatório"
    }

    // Validar email
    if (!email.trim()) {
      newErrors.email = "Email é obrigatório"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email inválido"
    }

    // Validar telefone
    if (!phone.trim()) {
      newErrors.phone = "Telefone é obrigatório"
    }

    // Validar data de nascimento
    if (!birthdate) {
      newErrors.birthdate = "Data de nascimento é obrigatória"
    }

    // Validar senha
    if (!password) {
      newErrors.password = "Senha é obrigatória"
    } else if (password.length < 6) {
      newErrors.password = "A senha deve ter pelo menos 6 caracteres"
    }

    // Validar confirmação de senha
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      try {
        setIsLoading(true)

        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            phone,
            birthdate,
            password,
            confirmPassword,
          }),
        })

        const data = await response.json()

        if (data.success) {
          console.log("Registro bem-sucedido, fazendo login automático")
          // Registro bem-sucedido, agora vamos fazer login automaticamente
          const loginResult = await signIn("credentials", {
            redirect: false,
            email,
            password,
          })

          if (loginResult?.error) {
            console.error("Erro no login automático:", loginResult.error)
            setErrors({
              ...errors,
              email: "Erro ao fazer login automático. Por favor, faça login manualmente.",
            })
            setIsLoading(false)
            router.push("/login")
          } else {
            console.log("Login automático bem-sucedido, redirecionando para seleção de programa")
            // Login bem-sucedido, redirecionar para a seleção de programa
            router.push("/program-selection")
          }
        } else {
          // Exibir mensagem de erro
          console.error("Erro no registro:", data.message)
          setErrors({
            ...errors,
            email: data.message,
          })
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Erro ao registrar:", error)
        setErrors({
          ...errors,
          email: "Erro ao conectar com o servidor. Tente novamente mais tarde.",
        })
        setIsLoading(false)
      }
    }
  }

  // Função corrigida para formatação do telefone
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    if (value.length <= 11) {
      // Formata o telefone como (XX)XXXXX-XXXX ou (XX)XXXX-XXXX
      if (value.length <= 10) {
        setPhone(value.replace(/^(\d{2})(\d{0,4})(\d{0,4}).*/, "($1)$2-$3").trim())
      } else {
        setPhone(value.replace(/^(\d{2})(\d{0,5})(\d{0,4}).*/, "($1)$2-$3").trim())
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/50 dark:to-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Criar Conta</CardTitle>
          <CardDescription className="text-center">Preencha os dados abaixo para criar sua conta</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={errors.name ? "border-red-500" : ""}
                required
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(00) 00000-0000"
                  value={phone}
                  onChange={handlePhoneChange}
                  className={errors.phone ? "border-red-500" : ""}
                  required
                />
                {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthdate">Data de Nascimento</Label>
                <Input
                  id="birthdate"
                  type="date"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                  className={errors.birthdate ? "border-red-500" : ""}
                  required
                />
                {errors.birthdate && <p className="text-sm text-red-500">{errors.birthdate}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? "border-red-500" : ""}
                required
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={errors.password ? "border-red-500" : ""}
                required
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar Senha</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={errors.confirmPassword ? "border-red-500" : ""}
                required
              />
              {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
            </div>

            {Object.keys(errors).length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Por favor, corrija os erros no formulário antes de continuar.</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
              {isLoading ? "Cadastrando..." : "Cadastrar"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="mt-2 text-center text-sm">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
              Entrar
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
