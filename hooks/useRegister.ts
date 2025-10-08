import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"

export interface RegisterData {
  name: string
  email: string
  phone: string
  birthdate: string
  password: string
  confirmPassword: string
}

export interface RegisterErrors {
  name?: string
  email?: string
  phone?: string
  birthdate?: string
  password?: string
  confirmPassword?: string
}

interface UseRegisterReturn {
  // Form data
  formData: RegisterData
  errors: RegisterErrors
  isLoading: boolean
  
  // Form handlers
  handleChange: (field: keyof RegisterData, value: string) => void
  handlePhoneChange: (value: string) => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
  
  // Validation
  validateForm: () => boolean
  clearErrors: () => void
}

export function useRegister(): UseRegisterReturn {
  const router = useRouter()
  
  const [formData, setFormData] = useState<RegisterData>({
    name: "",
    email: "",
    phone: "",
    birthdate: "",
    password: "",
    confirmPassword: ""
  })
  
  const [errors, setErrors] = useState<RegisterErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = useCallback((field: keyof RegisterData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }, [errors])

  const handlePhoneChange = useCallback((inputValue: string) => {
    const value = inputValue.replace(/\D/g, "")
    
    if (value.length <= 11) {
      let formattedPhone = ""
      
      // Format phone as (XX)XXXXX-XXXX or (XX)XXXX-XXXX
      if (value.length <= 10) {
        formattedPhone = value.replace(/^(\d{2})(\d{0,4})(\d{0,4}).*/, "($1)$2-$3").trim()
      } else {
        formattedPhone = value.replace(/^(\d{2})(\d{0,5})(\d{0,4}).*/, "($1)$2-$3").trim()
      }
      
      setFormData(prev => ({ ...prev, phone: formattedPhone }))
      
      // Clear phone error when user starts typing
      if (errors.phone) {
        setErrors(prev => ({ ...prev, phone: undefined }))
      }
    }
  }, [errors.phone])

  const validateForm = useCallback((): boolean => {
    const newErrors: RegisterErrors = {}

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório"
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido"
    }

    // Validate phone
    if (!formData.phone.trim()) {
      newErrors.phone = "Telefone é obrigatório"
    }

    // Validate birthdate
    if (!formData.birthdate) {
      newErrors.birthdate = "Data de nascimento é obrigatória"
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = "Senha é obrigatória"
    } else if (formData.password.length < 6) {
      newErrors.password = "A senha deve ter pelo menos 6 caracteres"
    }

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setIsLoading(true)

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        console.log("Registro bem-sucedido, fazendo login automático")
        
        // Auto login after successful registration
        const loginResult = await signIn("credentials", {
          redirect: false,
          email: formData.email,
          password: formData.password,
        })

        if (loginResult?.error) {
          console.error("Erro no login automático:", loginResult.error)
          setErrors({
            email: "Erro ao fazer login automático. Por favor, faça login manualmente.",
          })
          setIsLoading(false)
          router.push("/login")
        } else {
          console.log("Login automático bem-sucedido, redirecionando para seleção de programa")
          router.push("/program-selection")
        }
      } else {
        console.error("Erro no registro:", data.message)
        setErrors({
          email: data.message,
        })
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Erro ao registrar:", error)
      setErrors({
        email: "Erro ao conectar com o servidor. Tente novamente mais tarde.",
      })
      setIsLoading(false)
    }
  }, [formData, validateForm, router])

  const clearErrors = useCallback(() => {
    setErrors({})
  }, [])

  return {
    formData,
    errors,
    isLoading,
    handleChange,
    handlePhoneChange,
    handleSubmit,
    validateForm,
    clearErrors
  }
}