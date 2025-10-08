import { Button } from "@/components/ui/actions/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/data-display/card"
import { Input } from "@/components/ui/form/input"
import { Label } from "@/components/ui/form/label"
import { Badge } from "@/components/ui/feedback/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/feedback/alert"
import { AlertCircle } from "lucide-react"

export function SecurityTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Segurança</CardTitle>
        <CardDescription>Gerencie sua senha e configurações de segurança</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Alterar Senha */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Alterar Senha</h3>
          <div className="space-y-2">
            <Label htmlFor="current-password">Senha Atual</Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">Nova Senha</Label>
            <Input id="new-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
            <Input id="confirm-password" type="password" />
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            Atualizar Senha
          </Button>
        </div>

        <Separator />

        {/* Sessões Ativas */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Sessões Ativas</h3>
          <div className="rounded-md border p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Este dispositivo</p>
                <p className="text-sm text-muted-foreground">
                  São Paulo, Brasil • Último acesso: Agora
                </p>
              </div>
              <Badge>Atual</Badge>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            Encerrar Todas as Outras Sessões
          </Button>
        </div>

        <Separator />

        {/* Excluir Conta */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Excluir Conta</h3>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Atenção</AlertTitle>
            <AlertDescription>
              Excluir sua conta é uma ação permanente e não pode ser desfeita. 
              Todos os seus dados serão removidos.
            </AlertDescription>
          </Alert>
          <Button variant="destructive">Excluir Minha Conta</Button>
        </div>
      </CardContent>
    </Card>
  )
}