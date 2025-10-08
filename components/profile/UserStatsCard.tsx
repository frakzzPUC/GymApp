import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/data-display/card"
import { Badge } from "@/components/ui/feedback/badge"
import { Separator } from "@/components/ui/separator"
import { UserAvatar } from "./UserAvatar"
import { UserProfile, UserStats } from "@/hooks/useProfile"

interface UserStatsCardProps {
  userData: UserProfile
  stats: UserStats
  onPhotoChange?: () => void
}

export function UserStatsCard({ userData, stats, onPhotoChange }: UserStatsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2 text-center">
        <div className="flex justify-center mb-4">
          <UserAvatar 
            name={userData.name}
            onPhotoChange={onPhotoChange}
            size="md"
          />
        </div>
        <CardTitle className="text-xl">{userData.name}</CardTitle>
        <CardDescription>{userData.email}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4 mt-2">
          {/* Programa e Objetivo */}
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Programa:</span>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-800 hover:bg-emerald-100">
              {userData.programName}
            </Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Objetivo:</span>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-800 hover:bg-emerald-100">
              {userData.goalName}
            </Badge>
          </div>
          
          <Separator />
          
          {/* Estatísticas em Grid */}
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.daysActive}</p>
              <p className="text-xs text-muted-foreground">Dias ativos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.workoutsCompleted}</p>
              <p className="text-xs text-muted-foreground">Treinos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.streakDays}</p>
              <p className="text-xs text-muted-foreground">Sequência</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.weightLost} kg</p>
              <p className="text-xs text-muted-foreground">Perdidos</p>
            </div>
          </div>
          
          <Separator />
          
          {/* Data de início */}
          <div className="text-sm text-muted-foreground">
            <p>Membro desde: {stats.startDate}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}