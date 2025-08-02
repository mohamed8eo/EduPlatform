"use server"

import { currentUser } from "@clerk/nextjs/server"
import { prisma } from "../db"
import { revalidatePath } from "next/cache"

interface Review {
  content: string
  courseId: string
  rating: number
}

interface GetReviewsResult {
  success: boolean
  reviews?: any[]
  error?: string
}

export async function createReview(review: Review) {
  try {
    const user = await currentUser()
    if (!user) {
      return {
        success: false,
        message: "User not found",
      }
    }

    // Get the user from our database using clerkId
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id }
    })

    if (!dbUser) {
      return {
        success: false,
        message: "User not found in database",
      }
    }

    // Check if user already reviewed this course
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_courseId: {
          userId: dbUser.id,
          courseId: review.courseId
        }
      }
    })

    if (existingReview) {
      return {
        success: false,
        message: "You have already reviewed this course",
      }
    }

    const newReview = await prisma.review.create({
      data: {
        comment: review.content,
        courseId: review.courseId,
        userId: dbUser.id,
        rating: review.rating,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      }
    })

    // Update course statistics
    const allReviews = await prisma.review.findMany({
      where: { courseId: review.courseId },
      select: { rating: true }
    })

    const totalReviews = allReviews.length
    const averageRating = totalReviews > 0 
      ? allReviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0) / totalReviews
      : 0

    // Update course with new statistics
    await prisma.course.update({
      where: { id: review.courseId },
      data: {
        rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
        reviewsCount: totalReviews,
        studentsCount: {
          increment: 1 // Increment student count
        }
      }
    })

    return {
      success: true,
      message: "Review created successfully",
      review: newReview,
    }
  } catch (error) {
    console.error('Error creating review:', error)
    return {
      success: false,
      message: "Failed to create review",
    } 
  }
}

export async function getReviews(courseId: string): Promise<GetReviewsResult> {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        courseId: courseId
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return {
      success: true,
      reviews: reviews
    }
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch reviews'
    }
  }
}

// For lesson comments (if needed)
export async function createLessonComment(comment: { content: string, lessonId: string }) {
  try {
    const user = await currentUser()
    if (!user) {
      return {
        success: false,
        message: "User not found",
      }
    }

    // Get the user from our database using clerkId
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id }
    })

    if (!dbUser) {
      return {
        success: false,
        message: "User not found in database",
      }
    }

    const newComment = await prisma.comment.create({
      data: {
        content: comment.content,
        lessonId: comment.lessonId,
        userId: dbUser.id,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      }
    })

    return {
      success: true,
      message: "Comment created successfully",
      comment: newComment,
    }
  } catch (error) {
    console.error('Error creating comment:', error)
    return {
      success: false,
      message: "Failed to create comment",
    } 
  }
}

export async function getLessonComments(lessonId: string): Promise<GetReviewsResult> {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        lessonId: lessonId
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return {
      success: true,
      reviews: comments // Using same interface for consistency
    }
  } catch (error) {
    console.error('Error fetching comments:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch comments'
    }
  }
}

export async function deleteReview(reviewId: string) {
  try {
    const user = await currentUser()
    if (!user) {
      return {
        success: false,
        message: "User not found",
      }
    }

    // Get the user from our database using clerkId
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id }
    })

    if (!dbUser) {
      return {
        success: false,
        message: "User not found in database",
      }
    }

    // Check if the review exists and belongs to the current user
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: { course: true }
    })

    if (!review) {
      return {
        success: false,
        message: "Review not found",
      }
    }

    if (review.userId !== dbUser.id) {
      return {
        success: false,
        message: "You can only delete your own reviews",
      }
    }

    // Delete the review
    await prisma.review.delete({
      where: { id: reviewId }
    })

    // Update course statistics
    const allReviews = await prisma.review.findMany({
      where: { courseId: review.courseId },
      select: { rating: true }
    })

    const totalReviews = allReviews.length
    const averageRating = totalReviews > 0 
      ? allReviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0) / totalReviews
      : 0

    // Get current studentsCount and clamp to zero
    const course = await prisma.course.findUnique({
      where: { id: review.courseId },
      select: { studentsCount: true }
    })
    const newCount = Math.max(0, (course?.studentsCount || 0) - 1)

    // Update course with new statistics
    await prisma.course.update({
      where: { id: review.courseId },
      data: {
        rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
        reviewsCount: totalReviews,
        studentsCount: newCount
      }
    })

    return {
      success: true,
      message: "Review deleted successfully",
    }
  } catch (error) {
    console.error('Error deleting review:', error)
    return {
      success: false,
      message: "Failed to delete review",
    } 
  }
}


export async function editReview(reviewId: string, review: Review) {
  try {
    const user = await currentUser()
    if (!user) {
      return {
        success: false,
        message: "User not found",
      }
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id }
    })
    
    if (!dbUser) {
      return {
        success: false,
        message: "User not found in database",
      }
    }
    
    const reviewToUpdate = await prisma.review.findUnique({
      where: { id: reviewId },
      include: { course: true }
    })
    
    if (!reviewToUpdate) {
      return {
        success: false,
        message: "Review not found",
      }
    }
    
    if (reviewToUpdate.userId !== dbUser.id) {
      return {
        success: false,
        message: "You can only edit your own reviews",
      }
    }
    
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        comment: review.content,
        rating: review.rating,
      }
    })

    // Update course statistics
    const allReviews = await prisma.review.findMany({
      where: { courseId: reviewToUpdate.courseId },
      select: { rating: true }
    })

    const totalReviews = allReviews.length
    const averageRating = totalReviews > 0 
      ? allReviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0) / totalReviews
      : 0

    // Update course with new statistics
    await prisma.course.update({
      where: { id: reviewToUpdate.courseId },
      data: {
        rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
        reviewsCount: totalReviews,
      }
    })

    return {
      success: true,
      message: "Review updated successfully",
      review: updatedReview,
    }
  } catch (error) {
    console.error('Error editing review:', error)
    return {
      success: false,
      message: "Failed to edit review",
    } 
  }
}

