import { Button } from "@/components/ui/actions/button"
import { Input } from "@/components/ui/form/input"
import { Label } from "@/components/ui/form/label"
import { Alert, AlertDescription } from "@/components/ui/feedback/alert"
import { AlertCircle } from "lucide-react"
import { RegisterData, RegisterErrors } from "@/hooks/useRegister"

interface RegisterFormProps {
  formData: RegisterData
  errors: RegisterErrors
  isLoading: boolean
  onSubmit: (e: React.FormEvent) => Promise<void>
  onChange: (field: keyof RegisterData, value: string) => void
  onPhoneChange: (value: string) => void
}

export function RegisterForm({
  formData,
  errors,
  isLoading,
  onSubmit,
  onChange,
  onPhoneChange
}: RegisterFormProps) {
  const hasErrors = Object.keys(errors).length > 0

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Full Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Nome Completo</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => onChange("name", e.target.value)}
          className={errors.name ? "border-red-500" : ""}
          required
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name}</p>
        )}
      </div>

      {/* Phone and Birthdate Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="(00) 00000-0000"
            value={formData.phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            className={errors.phone ? "border-red-500" : ""}
            required
          />
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="birthdate">Data de Nascimento</Label>
          <Input
            id="birthdate"
            type="date"
            value={formData.birthdate}
            onChange={(e) => onChange("birthdate", e.target.value)}
            className={errors.birthdate ? "border-red-500" : ""}
            required
          />
          {errors.birthdate && (
            <p className="text-sm text-red-500">{errors.birthdate}</p>
          )}
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          value={formData.email}
          onChange={(e) => onChange("email", e.target.value)}
          className={errors.email ? "border-red-500" : ""}
          required
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => onChange("password", e.target.value)}
          className={errors.password ? "border-red-500" : ""}
          required
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirmar Senha</Label>
        <Input
          id="confirm-password"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => onChange("confirmPassword", e.target.value)}
          className={errors.confirmPassword ? "border-red-500" : ""}
          required
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500">{errors.confirmPassword}</p>
        )}
      </div>

      {/* Error Alert */}
      {hasErrors && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Por favor, corrija os erros no formulário antes de continuar.
          </AlertDescription>
        </Alert>
      )}

      {/* Submit Button */}
      <Button 
        type="submit" 
        className="w-full bg-emerald-600 hover:bg-emerald-700" 
        disabled={isLoading}
      >
        {isLoading ? "Cadastrando..." : "Cadastrar"}
      </Button>
    </form>
  )
}