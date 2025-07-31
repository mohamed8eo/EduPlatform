import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { title, description, price, category, thumbnailUrl, previewVideoUrl, sections } = body

    // Validate required fields
    if (!title || !description || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Generate slug from title
    const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    // Get or create category
    let categoryRecord = await prisma.category.findUnique({
      where: { slug: category }
    })

    if (!categoryRecord) {
      categoryRecord = await prisma.category.create({
        data: {
          name: category.charAt(0).toUpperCase() + category.slice(1),
          slug: category,
          description: `${category} courses`
        }
      })
    }

    const course = await prisma.course.create({
      data: {
        title,
        slug,
        description,
        longDescription: description,
        price: price || 0,
        level: 'BEGINNER',
        language: 'en',
        status: 'DRAFT',
        tags: [],
        requirements: [],
        whatYouWillLearn: [],
        features: [],
        creatorId: user.id,
        categoryId: categoryRecord.id,
        thumbnail: thumbnailUrl,
        previewVideo: previewVideoUrl,
        sections: {
          create: sections?.map((section: any, index: number) => ({
            title: section.title,
            description: section.description,
            order: index + 1,
            lessons: {
              create: section.lessons?.map((lesson: any, lessonIndex: number) => ({
                title: lesson.title,
                description: lesson.description,
                content: lesson.content,
                videoUrl: lesson.videoUrl || lesson.videoFile?.url || '',
                duration: lesson.duration || 0,
                order: lessonIndex + 1,
                type: lesson.type || 'VIDEO',
                isPreview: lesson.isPreview || false,
                resources: {
                  cloudinaryData: lesson.cloudinaryData ? JSON.stringify(lesson.cloudinaryData) : null,
                  videoProvider: lesson.videoProvider || lesson.videoFile?.provider || 'cloudinary',
                  ...lesson.resources
                }
              })) || []
            }
          })) || []
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

    return NextResponse.json({ success: true, course })
  } catch (error) {
    console.error('Error creating course:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create course' },
      { status: 500 }
    )
  }
} 