import { Button } from "@/components/ui/actions/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/data-display/card"
import { Label } from "@/components/ui/form/label"
import { Switch } from "@/components/ui/form/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/form/radio-group"
import { Separator } from "@/components/ui/separator"

export function NotificationsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notificações</CardTitle>
        <CardDescription>Gerencie suas preferências de notificação</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Notificações por Email */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Notificações por Email</h3>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Lembretes de Treino</Label>
              <p className="text-sm text-muted-foreground">
                Receba lembretes sobre seus treinos agendados
              </p>
            </div>
            <Switch />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Novos Planos de Dieta</Label>
              <p className="text-sm text-muted-foreground">
                Seja notificado quando novos planos estiverem disponíveis
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Progresso Semanal</Label>
              <p className="text-sm text-muted-foreground">
                Receba relatórios semanais do seu progresso
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>

        <Separator />

        {/* Notificações Push */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Notificações Push</h3>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Lembretes de Atividade</Label>
              <p className="text-sm text-muted-foreground">
                Receba lembretes para se manter ativo
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Marcos de Progresso</Label>
              <p className="text-sm text-muted-foreground">
                Celebre suas conquistas importantes
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>

        <Separator />

        {/* Frequência de Notificações */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Frequência de Notificações</h3>
          <RadioGroup defaultValue="daily">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="daily" id="daily" />
              <Label htmlFor="daily">Diário</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="weekly" id="weekly" />
              <Label htmlFor="weekly">Semanal</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="monthly" id="monthly" />
              <Label htmlFor="monthly">Mensal</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="never" id="never" />
              <Label htmlFor="never">Nunca</Label>
            </div>
          </RadioGroup>
        </div>

        <Separator />

        <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
          Salvar Preferências
        </Button>
      </CardContent>
    </Card>
  )
}