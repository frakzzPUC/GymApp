"use client"

import { RegisterLayout } from "@/components/auth/RegisterLayout"
import { RegisterForm } from "@/components/auth/RegisterForm"
import { useRegister } from "@/hooks/useRegister"

export default function RegisterPage() {
  const {
    formData,
    errors,
    isLoading,
    handleChange,
    handlePhoneChange,
    handleSubmit
  } = useRegister()

  return (
    <RegisterLayout>
      <RegisterForm
        formData={formData}
        errors={errors}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        onChange={handleChange}
        onPhoneChange={handlePhoneChange}
      />
    </RegisterLayout>
  )
}