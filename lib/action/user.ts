"use server"

import { auth } from "@clerk/nextjs/server"
import prisma from "../db"

interface UserData {
  id: string
  clerkId: string
  email: string
  username: string | null
  firstName: string
  lastName: string
  avatar: string | null
  bio: string | null
  role: string
  createdAt: Date
  updatedAt: Date
}

interface GetUserResult {
  success: boolean
  user?: UserData
  error?: string
}

export const getUserByClerkId = async (clerkId: string): Promise<GetUserResult> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        clerkId: clerkId
      },
      select: {
        id: true,
        clerkId: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        bio: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!user) {
      return {
        success: false,
        error: "User not found"
      }
    }

    return {
      success: true,
      user: user
    }

  } catch (error) {
    console.error('Error fetching user:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch user'
    }
  }
}

export const getCurrentUser = async (): Promise<GetUserResult> => {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return {
        success: false,
        error: "Not authenticated"
      }
    }

    return await getUserByClerkId(userId)

  } catch (error) {
    console.error('Error getting current user:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get current user'
    }
  }
}