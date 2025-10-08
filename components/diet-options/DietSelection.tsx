import { RadioGroup } from "@/components/ui/form/radio-group"
import { DietOptionCard } from "./DietOptionCard"
import { ShoppingCart, Utensils, Leaf } from "lucide-react"
import { DietType } from "@/hooks/useDietOptions"

interface DietSelectionProps {
  selectedDiet: DietType | null
  onDietChange: (diet: DietType | null) => void
}

export function DietSelection({ selectedDiet, onDietChange }: DietSelectionProps) {
  const dietOptions = [
    {
      id: "economic",
      value: "economic" as DietType,
      title: "Dieta Econômica",
      description: "Alimentos acessíveis e nutritivos",
      icon: <ShoppingCart className="h-5 w-5 text-emerald-600" />,
      features: [
        "Ingredientes de baixo custo",
        "Receitas simples e práticas",
        "Foco em alimentos da estação",
        "Lista de compras otimizada"
      ]
    },
    {
      id: "balanced",
      value: "balanced" as DietType,
      title: "Dieta Balanceada",
      description: "Equilíbrio entre custo e variedade",
      icon: <Utensils className="h-5 w-5 text-emerald-600" />,
      features: [
        "Alimentos de custo médio",
        "Maior variedade de proteínas",
        "Opções para todas as refeições",
        "Receitas mais elaboradas"
      ]
    },
    {
      id: "premium",
      value: "premium" as DietType,
      title: "Dieta Premium",
      description: "Ingredientes de alta qualidade",
      icon: <Leaf className="h-5 w-5 text-emerald-600" />,
      features: [
        "Alimentos orgânicos e premium",
        "Superalimentos e suplementos",
        "Proteínas de alta qualidade",
        "Receitas gourmet e elaboradas"
      ]
    }
  ]

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Opções de Dieta</h1>
        <p className="mt-4 text-muted-foreground">
          Escolha o plano alimentar que melhor se adapta ao seu orçamento e estilo de vida
        </p>
      </div>

      <RadioGroup 
        value={selectedDiet || ""} 
        onValueChange={(value) => onDietChange(value as DietType)} 
        className="grid gap-6 md:grid-cols-3"
      >
        {dietOptions.map((option) => (
          <DietOptionCard
            key={option.id}
            id={option.id}
            value={option.value}
            title={option.title}
            description={option.description}
            icon={option.icon}
            features={option.features}
            isSelected={selectedDiet === option.value}
          />
        ))}
      </RadioGroup>
    </div>
  )
}