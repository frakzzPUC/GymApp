import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export function useAuthRedirect() {
  const { status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") {
      setIsLoading(true)
      return
    }

    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    if (status === "authenticated") {
      setIsLoading(false)
    }
  }, [status, router])

  return isLoading
}