import { Button } from "@/components/ui/actions/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/data-display/card"
import { Input } from "@/components/ui/form/input"
import { Label } from "@/components/ui/form/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/form/select"
import { Edit, Save } from "lucide-react"
import { UserProfile } from "@/hooks/useProfile"

interface PersonalInfoTabProps {
  userData: UserProfile
  isEditing: boolean
  onToggleEdit: () => void
  onSave: () => void
  onDataChange: (data: Partial<UserProfile>) => void
}

export function PersonalInfoTab({
  userData,
  isEditing,
  onToggleEdit,
  onSave,
  onDataChange
}: PersonalInfoTabProps) {
  const handleSaveClick = () => {
    onSave()
    onToggleEdit()
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>Atualize seus dados pessoais</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={isEditing ? handleSaveClick : onToggleEdit}>
            {isEditing ? (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar
              </>
            ) : (
              <>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nome e Email */}
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                value={userData.name}
                onChange={(e) => onDataChange({ name: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={userData.email}
                onChange={(e) => onDataChange({ email: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            
            {/* Telefone e Data de Nascimento */}
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={userData.phone}
                onChange={(e) => onDataChange({ phone: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="birthdate">Data de Nascimento</Label>
              <Input
                id="birthdate"
                type="date"
                value={userData.birthdate}
                onChange={(e) => onDataChange({ birthdate: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            
            {/* Altura e Peso (apenas para programas específicos) */}
            {(userData.program === "sedentary" || userData.program === "training-diet") && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="height">Altura (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={userData.height}
                    onChange={(e) => onDataChange({ height: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="weight">Peso Atual (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={userData.weight}
                    onChange={(e) => onDataChange({ weight: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </>
            )}
          </div>

          {/* Gênero */}
          <div className="space-y-2">
            <Label htmlFor="gender">Gênero</Label>
            <Select
              value={userData.gender}
              onValueChange={(value) => onDataChange({ gender: value })}
              disabled={!isEditing}
            >
              <SelectTrigger id="gender">
                <SelectValue placeholder="Selecione seu gênero" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Masculino</SelectItem>
                <SelectItem value="female">Feminino</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Programa */}
          <div className="space-y-2">
            <Label htmlFor="program">Programa Atual</Label>
            <Select
              value={userData.program}
              onValueChange={(value) => onDataChange({ program: value })}
              disabled={!isEditing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um programa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rehabilitation">Reabilitação</SelectItem>
                <SelectItem value="sedentary">Saindo do Sedentarismo</SelectItem>
                <SelectItem value="training-diet">Treino + Dieta</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-1">
              Alterar o programa pode requerer informações adicionais.
            </p>
          </div>

          {/* Objetivo */}
          <div className="space-y-2">
            <Label htmlFor="goal">Objetivo</Label>
            <Select
              value={userData.goal}
              onValueChange={(value) => onDataChange({ goal: value })}
              disabled={!isEditing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um objetivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lose-weight">Emagrecer</SelectItem>
                <SelectItem value="gain-muscle">Ganhar Massa Muscular</SelectItem>
                <SelectItem value="maintain">Manter Forma Física</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>
      </CardContent>
      
      {isEditing && (
        <CardFooter className="flex justify-end">
          <Button onClick={handleSaveClick} className="bg-emerald-600 hover:bg-emerald-700">
            Salvar Alterações
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}