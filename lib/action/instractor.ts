"use server"
import { revalidatePath } from "next/cache"
import prisma from "../db"
import { auth } from "@clerk/nextjs/server"

interface InstructorData {
    firstName: string
    lastName: string
    email: string
    expertise: string
    experience: string
    bio: string
    website?: string
    linkedin?: string
    twitter?: string
    agreeToTerms: boolean
  }
  
  export const createInstructor = async (instructorData: InstructorData) => {
    try {
      const { userId } = await auth()
      if (!userId) throw new Error('Unauthorized')
      
      const user = await prisma.user.findUnique({ where: { clerkId: userId } })
      if (!user) throw new Error('User not found')
  
      // Validate required fields
      if (!instructorData.firstName || !instructorData.lastName || !instructorData.email || 
          !instructorData.expertise || !instructorData.experience || !instructorData.bio) {
        throw new Error('Missing required fields')
      }
  
      // Check if user already has a creator profile
      const existingProfile = await prisma.creatorProfile.findUnique({
        where: { userId: user.id }
      })
  
      if (existingProfile) {
        throw new Error('User already has a creator profile')
      }
  
      // Create creator profile
      const creatorProfile = await prisma.creatorProfile.create({
        data: {
          userId: user.id,
          expertise: [instructorData.expertise],
          experience: instructorData.experience,
          isApproved: false, // Will be reviewed by admin
          totalEarnings: 0,
          totalStudents: 0,
          rating: 0
        }
      }) 
  
      // Update user role to CREATOR
      await prisma.user.update({
        where: { id: user.id },
        data: {
          firstName: instructorData.firstName,
          lastName: instructorData.lastName,
          email: instructorData.email,
          bio: instructorData.bio,
          website: instructorData.website || null,
          linkedin: instructorData.linkedin || null,
          twitter: instructorData.twitter || null,
          role: 'CREATOR'
        }
      })
  
      revalidatePath('/dashboard')
      return { success: true, creatorProfile }
    } catch (error) {
      console.error('Error creating instructor:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Failed to create instructor' }
    }
  }

  export const checkUserCreatorStatus = async () => {
    try {
      const { userId } = await auth()
      if (!userId) return { success: false, isCreator: false, error: 'Unauthorized' }
      
      const user = await prisma.user.findUnique({ 
        where: { clerkId: userId },
        include: {
          creatorProfile: true
        }
      })
      
      if (!user) return { success: false, isCreator: false, error: 'User not found' }
      
      const isCreator = user.role === 'CREATOR' || user.creatorProfile !== null
      
      return { 
        success: true, 
        isCreator,
        userRole: user.role,
        hasCreatorProfile: user.creatorProfile !== null,
        creatorProfile: user.creatorProfile
      }
    } catch (error) {
      console.error('Error checking user creator status:', error)
      return { 
        success: false, 
        isCreator: false, 
        error: error instanceof Error ? error.message : 'Failed to check creator status' 
      }
    }
  }