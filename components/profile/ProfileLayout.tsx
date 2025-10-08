import { UserAvatar } from "./UserAvatar"
import { UserStatsCard } from "./UserStatsCard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/navigation/tabs"
import { PersonalInfoTab } from "./PersonalInfoTab"
import { SecurityTab } from "./SecurityTab"
import { NotificationsTab } from "./NotificationsTab"
import { Alert, AlertDescription } from "@/components/ui/feedback/alert"
import { CheckCircle } from "lucide-react"
import { UserProfile, UserStats } from "@/hooks/useProfile"

interface ProfileLayoutProps {
  userData: UserProfile
  userStats: UserStats
  isEditing: boolean
  isLoading?: boolean
  successMessage?: string
  onToggleEdit: () => void
  onSave: () => void
  onDataChange: (data: Partial<UserProfile>) => void
  onPhotoChange?: () => void
}

export function ProfileLayout({ 
  userData, 
  userStats, 
  isEditing,
  isLoading, 
  successMessage,
  onToggleEdit,
  onSave,
  onDataChange,
  onPhotoChange
}: ProfileLayoutProps) {
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            Meu Perfil
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Gerencie suas informações pessoais e configurações da conta
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <Alert className="mb-6 bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            <AlertDescription className="text-emerald-800 dark:text-emerald-200">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}

        {/* Profile Content */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Sidebar - Avatar and Stats */}
          <div className="space-y-6">
            <UserAvatar 
              name={userData.name}
              onPhotoChange={onPhotoChange}
              size="lg" 
            />
            <UserStatsCard userData={userData} stats={userStats} onPhotoChange={onPhotoChange} />
          </div>

          {/* Main Content - Tabs */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal">Informações Pessoais</TabsTrigger>
                <TabsTrigger value="security">Segurança</TabsTrigger>
                <TabsTrigger value="notifications">Notificações</TabsTrigger>
              </TabsList>
              
              <TabsContent value="personal" className="mt-6">
                <PersonalInfoTab 
                  userData={userData}
                  isEditing={isEditing}
                  onToggleEdit={onToggleEdit}
                  onSave={onSave}
                  onDataChange={onDataChange}
                />
              </TabsContent>
              
              <TabsContent value="security" className="mt-6">
                <SecurityTab />
              </TabsContent>
              
              <TabsContent value="notifications" className="mt-6">
                <NotificationsTab />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}