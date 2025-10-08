"use client"

import { ProfileLayout } from "@/components/profile/ProfileLayout"
import { useProfile } from "@/hooks/useProfile"
import { useAuthRedirect } from "@/hooks/useAuthRedirect"

export default function ProfilePage() {
  // Check authentication
  const isAuthenticated = useAuthRedirect()
  
  // Profile logic
  const {
    userData,
    userStats,
    isEditing,
    isLoading,
    successMessage,
    handleToggleEdit,
    handleSave,
    handleDataChange,
    handlePhotoChange
  } = useProfile()

  // Show loading if auth is still checking or profile is loading
  if (!isAuthenticated || isLoading) {
    return <ProfileLayout 
      userData={userData}
      userStats={userStats}
      isEditing={isEditing}
      isLoading={true}
      successMessage={successMessage}
      onToggleEdit={handleToggleEdit}
      onSave={handleSave}
      onDataChange={handleDataChange}
      onPhotoChange={handlePhotoChange}
    />
  }

  return (
    <ProfileLayout 
      userData={userData}
      userStats={userStats}
      isEditing={isEditing}
      isLoading={isLoading}
      successMessage={successMessage}
      onToggleEdit={handleToggleEdit}
      onSave={handleSave}
      onDataChange={handleDataChange}
      onPhotoChange={handlePhotoChange}
    />
  )
}