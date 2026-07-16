import { useState, useCallback } from 'react'
import { teamMembers as defaultMembers, pendingInvitations as defaultInvitations } from '@/data/mockData'
import type { TeamMember, Invitation, UserRole } from '@/data/mockData'

const MEMBERS_KEY = 'kalit_team_members'
const INVITATIONS_KEY = 'kalit_invitations'

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
  } catch {
    return fallback
  }
}

function saveToStorage<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data))
}

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = 'KLT-'
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export function useTeam() {
  const [members, setMembers] = useState<TeamMember[]>(() =>
    loadFromStorage(MEMBERS_KEY, defaultMembers)
  )
  const [invitations, setInvitations] = useState<Invitation[]>(() =>
    loadFromStorage(INVITATIONS_KEY, defaultInvitations)
  )

  const addInvitation = useCallback(
    (data: { name: string; phone: string; role: UserRole; message: string }) => {
      const newInvitation: Invitation = {
        id: `inv-${Date.now()}`,
        name: data.name,
        phone: data.phone,
        role: data.role,
        message: data.message,
        code: generateCode(),
        createdAt: new Date().toISOString().split('T')[0],
        status: 'pending',
        invitedBy: '1',
      }
      const updated = [newInvitation, ...invitations]
      setInvitations(updated)
      saveToStorage(INVITATIONS_KEY, updated)
      return newInvitation
    },
    [invitations]
  )

  const revokeInvitation = useCallback(
    (id: string) => {
      const updated = invitations.filter((inv) => inv.id !== id)
      setInvitations(updated)
      saveToStorage(INVITATIONS_KEY, updated)
    },
    [invitations]
  )

  const removeMember = useCallback(
    (id: string) => {
      const updated = members.filter((m) => m.id !== id)
      setMembers(updated)
      saveToStorage(MEMBERS_KEY, updated)
    },
    [members]
  )

  const getInvitationByCode = useCallback(
    (code: string) => {
      return invitations.find(
        (inv) => inv.code.toUpperCase() === code.toUpperCase() && inv.status === 'pending'
      )
    },
    [invitations]
  )

  const acceptInvitation = useCallback(
    (code: string, userName: string, userEmail: string) => {
      const invitation = invitations.find(
        (inv) => inv.code.toUpperCase() === code.toUpperCase() && inv.status === 'pending'
      )
      if (!invitation) return null

      const newMember: TeamMember = {
        id: `user-${Date.now()}`,
        name: userName,
        email: userEmail,
        phone: invitation.phone,
        role: invitation.role,
        status: 'active',
        joinedAt: new Date().toISOString().split('T')[0],
        invitedBy: invitation.invitedBy,
      }

      const updatedMembers = [newMember, ...members]
      setMembers(updatedMembers)
      saveToStorage(MEMBERS_KEY, updatedMembers)

      const updatedInvitations = invitations.map((inv) =>
        inv.id === invitation.id ? { ...inv, status: 'accepted' as const } : inv
      )
      setInvitations(updatedInvitations)
      saveToStorage(INVITATIONS_KEY, updatedInvitations)

      return newMember
    },
    [members, invitations]
  )

  const roleLabels: Record<UserRole, string> = {
    owner: 'Owner',
    project_manager: 'Project Manager',
    site_engineer: 'Site Engineer',
    storekeeper: 'Storekeeper',
  }

  return {
    members,
    invitations,
    addInvitation,
    revokeInvitation,
    removeMember,
    getInvitationByCode,
    acceptInvitation,
    roleLabels,
  }
}
