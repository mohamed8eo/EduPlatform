"use server"

import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/db"
import { revalidatePath } from "next/cache"

// Types for the new video and image data structure
interface VideoData {
  type: 'file' | 'url'
  file?: File
  url?: string
  provider?: 'cloudinary' | 'youtube' | 'vimeo'
  cloudinaryData?: {
    url: string
    publicId: string
    format: string
    size: number
    width?: number
    height?: number
    duration?: number
    resourceType: string
  }
}

interface ImageData {
  type: 'file' | 'url'
  file?: File
  url?: string
  provider?: 'cloudinary'
  cloudinaryData?: {
    url: string
    publicId: string
    format: string
    size: number
    width?: number
    height?: number
    resourceType: string
  }
}

interface Lesson {
  id?: string
  title: string
  description: string
  content: string
  videoUrl?: string
  videoFile?: VideoData
  videoProvider?: string
  duration?: number
  type?: 'VIDEO' | 'TEXT' | 'QUIZ' | 'ASSIGNMENT'
  isPreview?: boolean
  resources?: any
  cloudinaryData?: any
}

interface Section {
  id?: string
  title: string
  description: string
  lessons: Lesson[]
}

interface CourseData {
  title: string
  description: string
  price: number
  category: string
  thumbnailUrl?: string
  previewVideoUrl?: string
  sections: {
    title: string
    description: string
    lessons: {
      title: string
      description: string
      content: string
      videoUrl?: string
      duration?: number
      type?: string
      isPreview?: boolean
      cloudinaryData?: any
      videoProvider?: string
    }[]
  }[]
}

export const createCourse = async (courseData: CourseData) => {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error('Unauthorized')
    
    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user) throw new Error('User not found')

    // Validate required fields
    if (!courseData.title || !courseData.description || !courseData.category) {
      throw new Error('Missing required fields')
    }

    // Generate slug from title
    const slug = courseData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    // Get or create category
    let category = await prisma.category.findUnique({
      where: { slug: courseData.category }
    })

    if (!category) {
      // Create default category if it doesn't exist
      category = await prisma.category.create({
        data: {
          name: courseData.category.charAt(0).toUpperCase() + courseData.category.slice(1),
          slug: courseData.category,
          description: `${courseData.category} courses`
        }
      })
    }

    // Get thumbnail URL
    const thumbnailUrl = courseData.thumbnailUrl

    // Get preview video URL
    const previewVideoUrl = courseData.previewVideoUrl || ''

    const course = await prisma.course.create({
      data: {
        title: courseData.title,
        slug: slug,
        description: courseData.description,
        longDescription: courseData.description,
        price: courseData.price,
        level: 'BEGINNER',
        language: 'en',
        status: 'DRAFT',
        tags: [],
        requirements: [],
        whatYouWillLearn: [],
        features: [],
        creatorId: user.id,
        categoryId: category.id,
        thumbnail: thumbnailUrl,
        previewVideo: previewVideoUrl,
        sections: {
          create: courseData.sections.map((section, index) => ({
            title: section.title,
            description: section.description,
            order: index + 1,
            lessons: {
              create: section.lessons.map((lesson, lessonIndex) => ({
                title: lesson.title,
                description: lesson.description,
                content: lesson.content,
                videoUrl: lesson.videoUrl || '',
                duration: lesson.duration || 0,
                order: lessonIndex + 1,
                type: (lesson.type as 'VIDEO' | 'TEXT' | 'QUIZ' | 'ASSIGNMENT') || 'VIDEO',
                isPreview: lesson.isPreview || false,
                resources: {
                  cloudinaryData: lesson.cloudinaryData ? JSON.stringify(lesson.cloudinaryData) : null,
                  videoProvider: lesson.videoProvider || 'cloudinary',
                }
              }))
            }
          }))
        }
      },
      include: { 
        sections: { 
          include: { 
            lessons: true 
          } 
        } 
      }
    })

    revalidatePath('/dashboard/courses')
    return { success: true, course }
  } catch (error) {
    console.error('Error creating course:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create course' }
  }
}

export const getCourses = async () => {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error('Unauthorized')

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user) throw new Error('User not found')

    const courses = await prisma.course.findMany({
      where: { creatorId: user.id },
      include: {
        sections: {
          include: {
            lessons: true
          }
        },
        category: true,
        creator: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return { success: true, courses }
  } catch (error) {
    console.error('Error fetching courses:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch courses' }
  }
}

export const getCourse = async (courseId: string) => {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error('Unauthorized')

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        sections: {
          include: {
            lessons: true
          }
        },
        category: true,
        creator: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      }
    })

    if (!course) {
      return { success: false, error: 'Course not found' }
    }

    return { success: true, course }
  } catch (error) {
    console.error('Error fetching course:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch course' }
  }
}

export const updateCourse = async (courseId: string, courseData: Partial<CourseData>) => {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error('Unauthorized')

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user) throw new Error('User not found')

    // Check if user owns the course
    const existingCourse = await prisma.course.findUnique({
      where: { id: courseId },
      select: { creatorId: true }
    })

    if (!existingCourse || existingCourse.creatorId !== user.id) {
      throw new Error('Unauthorized to update this course')
    }

    // Get thumbnail URL
    const thumbnailUrl = courseData.thumbnailUrl

    // Get preview video URL
    const previewVideoUrl = courseData.previewVideoUrl || ''

    const course = await prisma.course.update({
      where: { id: courseId },
      data: {
        title: courseData.title,
        description: courseData.description,
        price: courseData.price,
        categoryId: courseData.category,
        thumbnail: thumbnailUrl,
        previewVideo: previewVideoUrl,
      },
      include: {
        sections: {
          include: {
            lessons: true
          }
        }
      }
    })

    revalidatePath('/dashboard/courses')
    revalidatePath(`/dashboard/courses/${courseId}`)
    return { success: true, course }
  } catch (error) {
    console.error('Error updating course:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update course' }
  }
}

export const deleteCourse = async (courseId: string) => {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error('Unauthorized')

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user) throw new Error('User not found')

    // Check if user owns the course
    const existingCourse = await prisma.course.findUnique({
      where: { id: courseId },
      select: { creatorId: true }
    })

    if (!existingCourse || existingCourse.creatorId !== user.id) {
      throw new Error('Unauthorized to delete this course')
    }

    await prisma.course.delete({
      where: { id: courseId }
    })

    revalidatePath('/dashboard/courses')
    return { success: true }
  } catch (error) {
    console.error('Error deleting course:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete course' }
  }
}