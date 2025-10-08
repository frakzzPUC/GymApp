import { Button } from "@/components/ui/actions/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/data-display/avatar"
import { Camera } from "lucide-react"

interface UserAvatarProps {
  name: string
  imageUrl?: string
  onPhotoChange?: () => void
  size?: "sm" | "md" | "lg"
}

export function UserAvatar({ 
  name, 
  imageUrl, 
  onPhotoChange,
  size = "md" 
}: UserAvatarProps) {
  const sizeClasses = {
    sm: "h-16 w-16",
    md: "h-24 w-24", 
    lg: "h-32 w-32"
  }

  const buttonSizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10"
  }

  const iconSizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  }

  const getInitials = (fullName: string): string => {
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="relative">
      <Avatar className={sizeClasses[size]}>
        <AvatarImage src={imageUrl || "/placeholder.svg"} alt={name} />
        <AvatarFallback className="text-2xl bg-emerald-100 text-emerald-800">
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>
      
      {onPhotoChange && (
        <Button
          size="icon"
          variant="secondary"
          className={`absolute bottom-0 right-0 ${buttonSizeClasses[size]} rounded-full`}
          onClick={onPhotoChange}
        >
          <Camera className={iconSizeClasses[size]} />
          <span className="sr-only">Alterar foto</span>
        </Button>
      )}
    </div>
  )
}