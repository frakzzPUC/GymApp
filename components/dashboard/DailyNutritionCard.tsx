import { Badge } from "@/components/ui/feedback/badge"
import { Button } from "@/components/ui/actions/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/data-display/card"
import { Utensils, Clock, ChefHat, Target, ArrowRight, Eye } from "lucide-react"

interface MealPlan {
  mealTime: string
  foods: string[]
  calories?: string
  time?: string
}

interface DailyNutritionCardProps {
  meals: MealPlan[]
  onViewFullPlan: () => void
}

const mealIcons: { [key: string]: any } = {
  "café da manhã": ChefHat,
  "lanche da manhã": Clock,
  "almoço": Utensils,
  "lanche da tarde": Clock,
  "jantar": Utensils,
  "ceia": Clock,
  default: Utensils
}

export function DailyNutritionCard({ meals, onViewFullPlan }: DailyNutritionCardProps) {
  const getMealIcon = (mealTime: string) => {
    const key = mealTime.toLowerCase()
    const IconComponent = mealIcons[key] || mealIcons.default
    return <IconComponent className="h-4 w-4 text-green-600" />
  }

  const formatMealTime = (time: string) => {
    const normalizedTime = time.toLowerCase()
    if (normalizedTime.includes("café")) return "Café da Manhã"
    if (normalizedTime.includes("lanche") && normalizedTime.includes("manhã")) return "Lanche Manhã"
    if (normalizedTime.includes("almoço")) return "Almoço"
    if (normalizedTime.includes("lanche") && normalizedTime.includes("tarde")) return "Lanche Tarde"
    if (normalizedTime.includes("jantar")) return "Jantar"
    if (normalizedTime.includes("ceia")) return "Ceia"
    return time
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            Nutrição de Hoje
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onViewFullPlan}
            className="text-primary hover:text-primary-foreground hover:bg-primary"
          >
            <Eye className="h-4 w-4 mr-1" />
            Ver Plano Completo
          </Button>
        </CardTitle>
        <CardDescription>
          Suas refeições planejadas para hoje
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {meals.length === 0 ? (
            <div className="text-center py-6">
              <Target className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground text-sm">Nenhuma refeição programada</p>
              <p className="text-xs text-muted-foreground mt-1">
                Gere seu plano nutricional para ver suas refeições
              </p>
            </div>
          ) : (
            <>
              {meals.slice(0, 3).map((meal, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4 border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getMealIcon(meal.mealTime)}
                  <span className="font-medium text-sm">
                    {formatMealTime(meal.mealTime)}
                  </span>
                </div>
                {meal.time && (
                  <Badge variant="outline" className="text-xs">
                    {meal.time}
                  </Badge>
                )}
              </div>
              <div className="space-y-1">
                {meal.foods.slice(0, 2).map((food, foodIndex) => (
                  <div key={foodIndex} className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className="text-green-600">•</span>
                    {food}
                  </div>
                ))}
                {meal.foods.length > 2 && (
                  <div className="text-xs text-muted-foreground">
                    +{meal.foods.length - 2} mais alimentos
                  </div>
                )}
              </div>
              {meal.calories && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <span className="text-xs font-medium text-green-600">
                    {meal.calories}
                  </span>
                </div>
              )}
            </div>
          ))}
          
              {meals.length > 3 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onViewFullPlan}
                  className="w-full mt-2"
                >
                  Ver mais {meals.length - 3} refeições
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}