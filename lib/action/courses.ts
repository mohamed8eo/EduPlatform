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
  totalDuration?: number
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
    const categoryName = courseData.category.charAt(0).toUpperCase() + courseData.category.slice(1)
    
    // First try to find by slug
    let category = await prisma.category.findUnique({
      where: { slug: courseData.category }
    })

    // If not found by slug, try to find by name
    if (!category) {
      category = await prisma.category.findFirst({
        where: { name: categoryName }
      })
    }

    if (!category) {
      // Create default category if it doesn't exist
      category = await prisma.category.create({
        data: {
          name: categoryName,
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
        totalDuration: courseData.totalDuration || 0,
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

    // Get or create category if category is provided
    let categoryId = undefined
    if (courseData.category) {
      const categoryName = courseData.category.charAt(0).toUpperCase() + courseData.category.slice(1)
      
      // First try to find by slug
      let category = await prisma.category.findUnique({
        where: { slug: courseData.category }
      })

      // If not found by slug, try to find by name
      if (!category) {
        category = await prisma.category.findFirst({
          where: { name: categoryName }
        })
      }

      if (!category) {
        // Create default category if it doesn't exist
        category = await prisma.category.create({
          data: {
            name: categoryName,
            slug: courseData.category,
            description: `${courseData.category} courses`
          }
        })
      }
      categoryId = category.id
    }

    // Get thumbnail URL
    const thumbnailUrl = courseData.thumbnailUrl

    // Get preview video URL
    const previewVideoUrl = courseData.previewVideoUrl || ''

    // First update the course basic information
    const course = await prisma.course.update({
      where: { id: courseId },
      data: {
        title: courseData.title,
        description: courseData.description,
        price: courseData.price,
        ...(categoryId && { categoryId }),
        thumbnail: thumbnailUrl,
        previewVideo: previewVideoUrl,
      }
    })

    // Update sections and lessons if provided
    if (courseData.sections) {
      // Delete existing sections and lessons
      await prisma.lesson.deleteMany({
        where: {
          section: {
            courseId: courseId
          }
        }
      })
      
      await prisma.section.deleteMany({
        where: {
          courseId: courseId
        }
      })

      // Create new sections and lessons
      for (let sectionIndex = 0; sectionIndex < courseData.sections.length; sectionIndex++) {
        const section = courseData.sections[sectionIndex]
        
        const createdSection = await prisma.section.create({
          data: {
            title: section.title,
            description: section.description,
            order: sectionIndex + 1,
            courseId: courseId,
          }
        })

        // Create lessons for this section
        for (let lessonIndex = 0; lessonIndex < section.lessons.length; lessonIndex++) {
          const lesson = section.lessons[lessonIndex]
          
          await prisma.lesson.create({
            data: {
              title: lesson.title,
              description: lesson.description,
              content: lesson.content,
              videoUrl: lesson.videoUrl || '',
              duration: lesson.duration || 0,
              order: lessonIndex + 1,
              type: (lesson.type as 'VIDEO' | 'TEXT' | 'QUIZ' | 'ASSIGNMENT') || 'VIDEO',
              isPreview: lesson.isPreview || false,
              sectionId: createdSection.id,
              resources: lesson.cloudinaryData ? lesson.cloudinaryData : null,
            }
          })
        }
      }
    }

    // Fetch the updated course with sections and lessons
    const updatedCourse = await prisma.course.findUnique({
      where: { id: courseId },
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
    return { success: true, course: updatedCourse }
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


export const getRandomCourses = async (limit: number = 6) => {
  try {
    // Get total count of courses
    const totalCourses = await prisma.course.count()
    
    if (totalCourses === 0) {
      return { success: true, courses: [] }
    }

    // Generate random skip value to get random courses
    const skip = Math.floor(Math.random() * Math.max(0, totalCourses - limit))
    
    const courses = await prisma.course.findMany({
      take: limit,
      skip: skip,
      include: {
        category: true,
        creator: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        sections: {
          include: {
            lessons: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return { success: true, courses }
  } catch (error) {
    console.error('Error fetching random courses:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch random courses',
      courses: []
    }
  }
}



export const getNew3Courses = async () => { 
  try {
    const courses = await prisma.course.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        creator: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        sections: {
          include: {
            lessons: true
          }
        }
      }
    })
    return { success: true, courses }
  } catch (error) {
    console.error('Error fetching new 3 courses:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch new 3 courses',
      courses: []
    }
  }
}



export const getFeaturedCourses = async () => { }






export const get4Mentors = async () => {
  try {
    
    // First try to get approved mentors
    let mentors = await prisma.creatorProfile.findMany({
      where: {
        isApproved: true
      },
      take: 4,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true,
            email: true
          }
        }
      }
    })
    
    // If no approved mentors, get all creators (for testing)
    if (mentors.length === 0) {
      mentors = await prisma.creatorProfile.findMany({
        take: 4,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              avatar: true,
              email: true
            }
          }
        }
      })
      console.log('Found all creators:', mentors.length)
    }
    
    return { success: true, mentors }
  } catch (error) {
    console.error('Error fetching 4 mentors:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch 4 mentors',
      mentors: []
    }
  }
}