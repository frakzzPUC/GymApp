import { ReactNode } from "react"
import { RadioGroupItem } from "@/components/ui/form/radio-group"
import { Label } from "@/components/ui/form/label"
import { CardTitle } from "@/components/ui/data-display/card"
import { Check } from "lucide-react"

interface DietOptionCardProps {
  id: string
  value: string
  title: string
  description: string
  icon: ReactNode
  features: string[]
  isSelected: boolean
}

export function DietOptionCard({
  id,
  value,
  title,
  description,
  icon,
  features,
  isSelected
}: DietOptionCardProps) {
  return (
    <div className="relative">
      <RadioGroupItem value={value} id={id} className="sr-only" />
      <Label
        htmlFor={id}
        className={`flex h-full cursor-pointer flex-col rounded-lg border p-6 shadow-sm transition-all hover:shadow-md ${
          isSelected ? "border-emerald-600 ring-2 ring-emerald-600" : "hover:border-emerald-300"
        }`}
      >
        {isSelected && (
          <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white">
            <Check className="h-4 w-4" />
          </div>
        )}
        
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
          {icon}
        </div>
        
        <CardTitle className="text-xl">{title}</CardTitle>
        <div className="mt-1 text-sm text-muted-foreground">{description}</div>
        
        <ul className="mt-6 space-y-2 text-sm">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-emerald-600 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </Label>
    </div>
  )
}