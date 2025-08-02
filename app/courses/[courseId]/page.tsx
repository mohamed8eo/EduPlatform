"use client"

import { useEffect, useRef, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import CourseProgressBar from "@/components/course-progress-bar"
import CourseReviews from "@/components/course-reviews"
import {
  Clock,
  Users,
  Star,
  Play,
  CheckCircle,
  Download,
  Share2,
  Bookmark,
  BookmarkCheck,
  Award,
  BarChart3,
  Globe,
  Shield,
  Smartphone,
  HelpCircle,
  ClipboardList,
  BookOpen,
  Check,
  MessageSquare,
  User,
  Trash2,
  Edit,
} from "lucide-react"
import { gsap } from "gsap"
import { useLanguage } from "@/contexts/language-context"
import { getCourse, getInstructorStats } from "@/lib/action/courses"
import { getCurrentUser } from "@/lib/action/user"
import { createReview, getReviews, deleteReview, editReview } from "@/lib/action/comments"
import VideoPlayer from "@/components/video-player"
import { toast } from "sonner"

interface Lesson {
  id: string
  title: string
  description: string | null
  content: string | null
  videoUrl: string | null
  duration: number
  order: number
  type: string
  isPreview: boolean
  resources: any
}

interface Section {
  id: string
  title: string
  description: string | null
  order: number
  duration: number
  lessons: Lesson[]
}

interface Course {
  id: string
  title: string
  slug: string
  description: string
  longDescription: string | null
  thumbnail: string | null
  previewVideo: string | null
  price: number
  level: string
  language: string
  status: string
  tags: string[]
  requirements: string[]
  whatYouWillLearn: string[]
  features: string[]
  totalDuration: number
  totalLessons: number
  studentsCount: number
  rating: number | null
  reviewsCount: number
  createdAt: string
  updatedAt: string
  hasLifetimeAccess: boolean
  hasMobileAccess: boolean
  hasDownloads: boolean
  hasCertificate: boolean
  hasDiscussions: boolean
  category: {
    name: string
  }
  instructor: {
    name: string
    avatar: string | null
    bio: string
  }
  creatorId: string
  sections: Section[]
}

export default function CourseDetailPage() {
  const params = useParams()
  const courseId = params.courseId as string
  const [course, setCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const [newComment, setNewComment] = useState("")
  const [newRating, setNewRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [reviews, setReviews] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null)
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null)
  const [editComment, setEditComment] = useState("")
  const [editRating, setEditRating] = useState(0)
  const [editHoveredRating, setEditHoveredRating] = useState(0)
  const [showVideoPlayer, setShowVideoPlayer] = useState(false)
  const [instructorStats, setInstructorStats] = useState<{
    totalCourses: number
    totalStudents: number
    averageRating: number
  } | null>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const { t, isRTL } = useLanguage()

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const result = await getCourse(courseId)
        if (result.success && result.course) {
          // Transform the course data to match our interface
          const transformedCourse: Course = {
            id: result.course.id,
            title: result.course.title,
            slug: result.course.slug,
            description: result.course.description,
            longDescription: result.course.description,
            thumbnail: result.course.thumbnail,
            previewVideo: result.course.previewVideo,
            price: result.course.price,
            level: result.course.level,
            language: result.course.language,
            status: result.course.status,
            tags: result.course.tags || [],
            requirements: result.course.requirements || [],
            whatYouWillLearn: result.course.whatYouWillLearn || [],
            features: [],
            totalDuration: result.course.totalDuration || 0,
            totalLessons: result.course.totalLessons || 0,
            studentsCount: result.course.studentsCount || 0,
            rating: result.course.rating,
            reviewsCount: result.course.reviewsCount || 0,
            createdAt: result.course.createdAt.toISOString(),
            updatedAt: result.course.updatedAt.toISOString(),
            hasLifetimeAccess: result.course.hasLifetimeAccess,
            hasMobileAccess: result.course.hasMobileAccess,
            hasDownloads: result.course.hasDownloads,
            hasCertificate: result.course.hasCertificate,
            hasDiscussions: result.course.hasDiscussions,
            category: {
              name: result.course.category.name
            },
            instructor: {
              name: `${result.course.creator.firstName} ${result.course.creator.lastName}`,
              avatar: result.course.creator.avatar,
              bio: `${result.course.creator.firstName} ${result.course.creator.lastName} is an expert instructor with years of experience in this field.`
            },
            creatorId: result.course.creatorId,
            sections: result.course.sections.map(section => ({
              id: section.id,
              title: section.title,
              description: section.description,
              order: section.order,
              duration: section.duration || 0,
              lessons: section.lessons.map(lesson => ({
                id: lesson.id,
                title: lesson.title,
                description: lesson.description,
                content: lesson.content,
                videoUrl: lesson.videoUrl,
                duration: lesson.duration || 0,
                order: lesson.order,
                type: lesson.type,
                isPreview: lesson.isPreview,
                resources: lesson.resources
              }))
            }))
          }
          setCourse(transformedCourse)
        } else {
          toast.error("Failed to fetch course")
        }
      } catch (error) {
        console.error('Error fetching course:', error)
        toast.error("Error loading course")
      } finally {
        setIsLoading(false)
      }
    }

    if (courseId) {
      fetchCourse()
    }
  }, [courseId])

  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const result = await getCurrentUser()
        if (result.success && result.user) {
          setCurrentUser(result.user)
        }
      } catch (error) {
        console.error('Error fetching current user:', error)
      } finally {
        setIsLoadingUser(false)
      }
    }

    fetchCurrentUser()
  }, [])

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      if (course) {
        try {
          const result = await getReviews(course.id)
          if (result.success && result.reviews) {
            setReviews(result.reviews)
          }
        } catch (error) {
          console.error('Error fetching reviews:', error)
        }
      }
    }

    fetchReviews()
  }, [course])

  // Fetch instructor statistics
  useEffect(() => {
    const fetchInstructorStats = async () => {
      if (course) {
        try {
          // Get the instructor ID from the course creator
          const instructorId = course.creatorId
          if (instructorId) {
            const result = await getInstructorStats(instructorId)
            if (result.success && result.stats) {
              setInstructorStats(result.stats)
            }
          }
        } catch (error) {
          console.error('Error fetching instructor stats:', error)
        }
      }
    }

    fetchInstructorStats()
  }, [course])

  useEffect(() => {
    if (course) {
      const ctx = gsap.context(() => {
        gsap.fromTo(".course-hero", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" })

        gsap.fromTo(
          ".course-content",
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: "power2.out" },
        )

        gsap.fromTo(
          ".syllabus-item",
          { opacity: 0, x: -30 },
          { opacity: 1, x: 0, duration: 0.6, stagger: 0.1, delay: 0.4, ease: "power2.out" },
        )
      })

      return () => ctx.revert()
    }
  }, [course])

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    // Here you would typically save to backend
  }

  const handleSubmitReview = async () => {
    if (!course || !currentUser || !newComment.trim() || newRating === 0) {
      return
    }

    setIsSubmitting(true)
    try {
      const result = await createReview({
        content: newComment,
        courseId: course.id,
        rating: newRating
      })

      if (result.success) {
        toast.success("Review submitted successfully!")
        setNewComment("")
        setNewRating(0)
        
        // Refresh reviews
        const reviewsResult = await getReviews(course.id)
        if (reviewsResult.success && reviewsResult.reviews) {
          setReviews(reviewsResult.reviews)
        }

        // Refresh course data to get updated statistics
        const courseResult = await getCourse(course.id)
        if (courseResult.success && courseResult.course) {
          // Transform the course data to match our interface
          const transformedCourse: Course = {
            id: courseResult.course.id,
            title: courseResult.course.title,
            slug: courseResult.course.slug,
            description: courseResult.course.description,
            longDescription: courseResult.course.description,
            thumbnail: courseResult.course.thumbnail,
            previewVideo: courseResult.course.previewVideo,
            price: courseResult.course.price,
            level: courseResult.course.level,
            language: courseResult.course.language,
            status: courseResult.course.status,
            tags: courseResult.course.tags || [],
            requirements: courseResult.course.requirements || [],
            whatYouWillLearn: courseResult.course.whatYouWillLearn || [],
            features: [],
            totalDuration: courseResult.course.totalDuration || 0,
            totalLessons: courseResult.course.totalLessons || 0,
            studentsCount: courseResult.course.studentsCount || 0,
            rating: courseResult.course.rating,
            reviewsCount: courseResult.course.reviewsCount || 0,
            createdAt: courseResult.course.createdAt.toISOString(),
            updatedAt: courseResult.course.updatedAt.toISOString(),
            hasLifetimeAccess: courseResult.course.hasLifetimeAccess,
            hasMobileAccess: courseResult.course.hasMobileAccess,
            hasDownloads: courseResult.course.hasDownloads,
            hasCertificate: courseResult.course.hasCertificate,
            hasDiscussions: courseResult.course.hasDiscussions,
            category: {
              name: courseResult.course.category?.name || ''
            },
            instructor: {
              name: `${courseResult.course.creator?.firstName || ''} ${courseResult.course.creator?.lastName || ''}`,
              avatar: courseResult.course.creator?.avatar || null,
              bio: ''
            },
            sections: courseResult.course.sections?.map(section => ({
              id: section.id,
              title: section.title,
              description: section.description,
              order: section.order,
              duration: section.duration || 0,
              lessons: section.lessons?.map(lesson => ({
                id: lesson.id,
                title: lesson.title,
                description: lesson.description,
                content: lesson.content,
                videoUrl: lesson.videoUrl,
                duration: lesson.duration || 0,
                order: lesson.order,
                type: lesson.type,
                isPreview: lesson.isPreview,
                resources: lesson.resources
              })) || []
            })) || []
          }
          setCourse(transformedCourse)
          
          // Refresh instructor stats
          const instructorResult = await getInstructorStats(transformedCourse.creatorId)
          if (instructorResult.success && instructorResult.stats) {
            setInstructorStats(instructorResult.stats)
          }
        }
      } else {
        toast.error(result.message || "Failed to submit review")
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      toast.error("An error occurred while submitting your review")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteReview = async (reviewId: string) => {
    if (!course || !currentUser) {
      return
    }

    setDeletingReviewId(reviewId)
    setIsSubmitting(true)
    try {
      const result = await deleteReview(reviewId)

      if (result.success) {
        toast.success("Review deleted successfully!")
        
        // Refresh reviews
        const reviewsResult = await getReviews(course.id)
        if (reviewsResult.success && reviewsResult.reviews) {
          setReviews(reviewsResult.reviews)
        }

        // Refresh course data to get updated statistics
        const courseResult = await getCourse(course.id)
        if (courseResult.success && courseResult.course) {
          // Transform the course data to match our interface
          const transformedCourse: Course = {
            id: courseResult.course.id,
            title: courseResult.course.title,
            slug: courseResult.course.slug,
            description: courseResult.course.description,
            longDescription: courseResult.course.description,
            thumbnail: courseResult.course.thumbnail,
            previewVideo: courseResult.course.previewVideo,
            price: courseResult.course.price,
            level: courseResult.course.level,
            language: courseResult.course.language,
            status: courseResult.course.status,
            tags: courseResult.course.tags || [],
            requirements: courseResult.course.requirements || [],
            whatYouWillLearn: courseResult.course.whatYouWillLearn || [],
            features: [],
            totalDuration: courseResult.course.totalDuration || 0,
            totalLessons: courseResult.course.totalLessons || 0,
            studentsCount: courseResult.course.studentsCount || 0,
            rating: courseResult.course.rating,
            reviewsCount: courseResult.course.reviewsCount || 0,
            createdAt: courseResult.course.createdAt.toISOString(),
            updatedAt: courseResult.course.updatedAt.toISOString(),
            hasLifetimeAccess: courseResult.course.hasLifetimeAccess,
            hasMobileAccess: courseResult.course.hasMobileAccess,
            hasDownloads: courseResult.course.hasDownloads,
            hasCertificate: courseResult.course.hasCertificate,
            hasDiscussions: courseResult.course.hasDiscussions,
            category: {
              name: courseResult.course.category?.name || ''
            },
            instructor: {
              name: `${courseResult.course.creator?.firstName || ''} ${courseResult.course.creator?.lastName || ''}`,
              avatar: courseResult.course.creator?.avatar || null,
              bio: ''
            },
            sections: courseResult.course.sections?.map(section => ({
              id: section.id,
              title: section.title,
              description: section.description,
              order: section.order,
              duration: section.duration || 0,
              lessons: section.lessons?.map(lesson => ({
                id: lesson.id,
                title: lesson.title,
                description: lesson.description,
                content: lesson.content,
                videoUrl: lesson.videoUrl,
                duration: lesson.duration || 0,
                order: lesson.order,
                type: lesson.type,
                isPreview: lesson.isPreview,
                resources: lesson.resources
              })) || []
            })) || []
          }
          setCourse(transformedCourse)
          
          // Refresh instructor stats
          const instructorResult = await getInstructorStats(transformedCourse.creatorId)
          if (instructorResult.success && instructorResult.stats) {
            setInstructorStats(instructorResult.stats)
          }
        }
      } else {
        toast.error(result.message || "Failed to delete review")
      }
    } catch (error) {
      console.error('Error deleting review:', error)
      toast.error("An error occurred while deleting your review")
    } finally {
      setIsSubmitting(false)
      setDeletingReviewId(null)
    }
  }

  const handleEditReview = async (reviewId: string) => {
    if (!course || !currentUser || !editComment.trim() || editRating === 0) {
      return
    }

    setIsSubmitting(true)
    try {
      const result = await editReview(reviewId, {
        content: editComment,
        courseId: course.id,
        rating: editRating
      })

      if (result.success) {
        toast.success("Review updated successfully!")
        setEditComment("")
        setEditRating(0)
        setEditingReviewId(null)
        
        // Refresh reviews
        const reviewsResult = await getReviews(course.id)
        if (reviewsResult.success && reviewsResult.reviews) {
          setReviews(reviewsResult.reviews)
        }

        // Refresh course data to get updated statistics
        const courseResult = await getCourse(course.id)
        if (courseResult.success && courseResult.course) {
          // Transform the course data to match our interface
          const transformedCourse: Course = {
            id: courseResult.course.id,
            title: courseResult.course.title,
            slug: courseResult.course.slug,
            description: courseResult.course.description,
            longDescription: courseResult.course.description,
            thumbnail: courseResult.course.thumbnail,
            previewVideo: courseResult.course.previewVideo,
            price: courseResult.course.price,
            level: courseResult.course.level,
            language: courseResult.course.language,
            status: courseResult.course.status,
            tags: courseResult.course.tags || [],
            requirements: courseResult.course.requirements || [],
            whatYouWillLearn: courseResult.course.whatYouWillLearn || [],
            features: [],
            totalDuration: courseResult.course.totalDuration || 0,
            totalLessons: courseResult.course.totalLessons || 0,
            studentsCount: courseResult.course.studentsCount || 0,
            rating: courseResult.course.rating,
            reviewsCount: courseResult.course.reviewsCount || 0,
            createdAt: courseResult.course.createdAt.toISOString(),
            updatedAt: courseResult.course.updatedAt.toISOString(),
            hasLifetimeAccess: courseResult.course.hasLifetimeAccess,
            hasMobileAccess: courseResult.course.hasMobileAccess,
            hasDownloads: courseResult.course.hasDownloads,
            hasCertificate: courseResult.course.hasCertificate,
            hasDiscussions: courseResult.course.hasDiscussions,
            category: {
              name: courseResult.course.category?.name || ''
            },
            instructor: {
              name: `${courseResult.course.creator?.firstName || ''} ${courseResult.course.creator?.lastName || ''}`,
              avatar: courseResult.course.creator?.avatar || null,
              bio: ''
            },
            creatorId: courseResult.course.creatorId,
            sections: courseResult.course.sections?.map(section => ({
              id: section.id,
              title: section.title,
              description: section.description,
              order: section.order,
              duration: section.duration || 0,
              lessons: section.lessons?.map(lesson => ({
                id: lesson.id,
                title: lesson.title,
                description: lesson.description,
                content: lesson.content,
                videoUrl: lesson.videoUrl,
                duration: lesson.duration || 0,
                order: lesson.order,
                type: lesson.type,
                isPreview: lesson.isPreview,
                resources: lesson.resources
              })) || []
            })) || []
          }
          setCourse(transformedCourse)
          
          // Refresh instructor stats
          const instructorResult = await getInstructorStats(transformedCourse.creatorId)
          if (instructorResult.success && instructorResult.stats) {
            setInstructorStats(instructorResult.stats)
          }
        }
      } else {
        toast.error(result.message || "Failed to update review")
      }
    } catch (error) {
      console.error('Error updating review:', error)
      toast.error("An error occurred while updating your review")
    } finally {
      setIsSubmitting(false)
    }
  }

  const startEditing = (review: any) => {
    setEditingReviewId(review.id)
    setEditComment(review.comment)
    setEditRating(review.rating)
  }

  const cancelEditing = () => {
    setEditingReviewId(null)
    setEditComment("")
    setEditRating(0)
  }

  const handlePreviewVideo = () => {
    if (course?.previewVideo) {
      setShowVideoPlayer(true)
    } else {
      toast.error("No preview video available for this course")
    }
  }

  const getVideoType = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return 'youtube'
    } else if (url.includes('vimeo.com')) {
      return 'vimeo'
    } else if (url.includes('cloudinary.com')) {
      return 'cloudinary'
    }
    return 'external'
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const calculateTotalLessons = (sections: Section[] | undefined) => {
    return sections?.reduce((total, section) => total + section.lessons.length, 0) || 0
  }

  const calculateTotalDuration = (sections: Section[] | undefined) => {
    return sections?.reduce((total, section) => 
      total + section.lessons.reduce((sectionTotal, lesson) => 
        sectionTotal + (lesson.duration || 0), 0), 0) || 0
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading course...</p>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
          <p className="text-muted-foreground mb-6">The course you're looking for doesn't exist.</p>
          <Link href="/courses">
            <Button>Browse All Courses</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Ensure course is properly typed
  const courseData = course as Course

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section ref={heroRef} className="course-hero bg-gradient-to-br from-primary/10 to-secondary/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap gap-2 mb-4">
                {courseData.tags?.map((tag: string) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">{courseData.title}</h1>
              <p className="text-lg text-muted-foreground mb-6">{courseData.longDescription || courseData.description}</p>

              <div className={`flex items-center space-x-6 mb-8 text-sm ${isRTL ? "space-x-reverse" : ""}`}>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-2 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{courseData.rating ? courseData.rating.toFixed(1) : '0.0'}</span>
                  <span className="text-muted-foreground ml-1">
                    ({courseData.reviewsCount || 0} {t("course.reviews")})
                  </span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  <span>
                    {courseData.studentsCount?.toLocaleString()} {t("course.students")}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{formatDuration(calculateTotalDuration(courseData.sections))}</span>
                </div>
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-2" />
                  <span>{courseData.language}</span>
                </div>
              </div>

              <div className={`flex items-center space-x-4 mb-6 ${isRTL ? "space-x-reverse" : ""}`}>
                <Image
                  src={courseData.instructor.avatar || "/placeholder.svg"}
                  alt={courseData.instructor.name}
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <div>
                  <p className="font-semibold">{courseData.instructor.name}</p>
                  <p className="text-sm text-muted-foreground">{t("course.instructor")}</p>
                </div>
              </div>
            </div>

            {/* Course Preview Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <div className="relative">
                  <Image
                    src={course.thumbnail || "/placeholder.svg"}
                    alt={course.title}
                    width={400}
                    height={225}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Button
                    size="lg"
                    onClick={handlePreviewVideo}
                    className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-white/90 hover:bg-white text-primary hover:text-primary"
                  >
                    <Play className="h-6 w-6 ml-1" />
                  </Button>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-3xl font-bold">${course.price}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleBookmark}
                      className="text-muted-foreground hover:text-primary"
                    >
                      {isBookmarked ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
                    </Button>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="space-y-2">
                      <Link href="/payment">
                        <Button size="lg" className="w-full">
                          {t("course.enrollNow")}
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="w-full bg-transparent"
                        onClick={handlePreviewVideo}
                      >
                        <Play className={`h-4 w-4 ${isRTL ? "ml-2 mr-0" : "mr-2"}`} />
                        {t("course.previewCourse")}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 mr-2 text-green-500" />
                      <span>{t("course.moneyBackGuarantee")}</span>
                    </div>
                    {course.hasLifetimeAccess && (
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-blue-500" />
                        <span>{t("course.lifetimeAccess")}</span>
                      </div>
                    )}
                    {course.hasMobileAccess && (
                      <div className="flex items-center">
                        <Smartphone className="h-4 w-4 mr-2 text-purple-500" />
                        <span>{t("course.mobileAccess")}</span>
                      </div>
                    )}
                    {course.hasCertificate && (
                      <div className="flex items-center">
                        <Award className="h-4 w-4 mr-2 text-yellow-500" />
                        <span>Certificate of completion</span>
                      </div>
                    )}
                  </div>

                  <Separator className="my-4" />

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Share2 className={`h-4 w-4 ${isRTL ? "ml-2 mr-0" : "mr-2"}`} />
                      {t("common.share")}
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Download className={`h-4 w-4 ${isRTL ? "ml-2 mr-0" : "mr-2"}`} />
                      {t("common.download")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section ref={contentRef} className="course-content py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">{t("course.overview")}</TabsTrigger>
                  <TabsTrigger value="curriculum">{t("course.curriculum")}</TabsTrigger>
                  <TabsTrigger value="instructor">{t("course.instructor")}</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-4">{t("course.whatYouWillLearn")}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {course.whatYouWillLearn?.map((item, index) => (
                        <div key={index} className={`flex items-start space-x-3 ${isRTL ? "space-x-reverse" : ""}`}>
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-4">{t("course.requirements")}</h2>
                    <ul className="space-y-2">
                      {course.requirements?.map((requirement, index) => (
                        <li key={index} className={`flex items-start space-x-3 ${isRTL ? "space-x-reverse" : ""}`}>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                          <span>{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="curriculum" className="space-y-4">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">{t("course.curriculum")}</h2>
                    <div className="text-sm text-muted-foreground">
                      {calculateTotalLessons(course.sections)} lessons • {formatDuration(calculateTotalDuration(course.sections))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {course.sections?.map((section, index) => (
                      <Card key={section.id} className="syllabus-item bg-white border border-gray-200 shadow-sm">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className={`flex items-center space-x-3 ${isRTL ? "space-x-reverse" : ""}`}>
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 border border-blue-300 text-blue-600 font-semibold text-sm">
                                {index + 1}
                              </div>
                              <div>
                                <CardTitle className="text-lg text-gray-900">{section.title}</CardTitle>
                                <p className="text-sm text-gray-600">{section.description}</p>
                              </div>
                            </div>
                            <div
                              className={`flex items-center space-x-4 text-sm text-gray-500 ${isRTL ? "space-x-reverse" : ""}`}
                            >
                              <span>{section.lessons.length} lessons</span>
                              <span>{formatDuration(section.lessons.reduce((total, lesson) => total + (lesson.duration || 0), 0))}</span>
                              <Play className="h-5 w-5 text-gray-400" />
                            </div>
                          </div>
                        </CardHeader>
                        
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value={`section-${section.id}`} className="border-none">
                            <AccordionTrigger className="px-6 py-2 hover:bg-gray-50 rounded-lg mx-4 mb-2 text-gray-700">
                              <span className="text-sm">View Lessons</span>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-4">
                              <div className="space-y-3">
                                {section.lessons?.map((lesson, lessonIndex) => (
                                  <div key={lesson.id} className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex items-center space-x-3">
                                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-gray-300 shadow-sm">
                                        {lesson.type === 'VIDEO' ? (
                                          <Play className="h-4 w-4 text-blue-600" />
                                        ) : lesson.type === 'QUIZ' ? (
                                          <HelpCircle className="h-4 w-4 text-yellow-600" />
                                        ) : lesson.type === 'ASSIGNMENT' ? (
                                          <ClipboardList className="h-4 w-4 text-purple-600" />
                                        ) : lesson.type === 'TEXT' ? (
                                          <BookOpen className="h-4 w-4 text-green-600" />
                                        ) : (
                                          <Play className="h-4 w-4 text-blue-600" />
                                        )}
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium text-gray-900">{lesson.title}</p>
                                        <p className="text-xs text-gray-600">{lesson.description}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      {lesson.isPreview && (
                                        <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-700">
                                          Preview
                                        </Badge>
                                      )}
                                      <span className="text-xs text-gray-500">
                                        {formatDuration(lesson.duration)}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>

                        {index === 0 && (
                          <CardContent className="pt-0">
                            <div className="bg-blue-50 rounded-lg p-3 mx-4 mb-4 border border-blue-200">
                              <p className="text-xs text-blue-600 mb-1">Current Lesson:</p>
                              <p className="text-sm font-medium text-gray-900">{section.lessons[0]?.title || "Introduction to the Course"}</p>
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="instructor" className="space-y-6">
                  <div className={`flex items-start space-x-6 ${isRTL ? "space-x-reverse" : ""}`}>
                    <Image
                      src={courseData.instructor.avatar || "/placeholder.svg"}
                      alt={courseData.instructor.name}
                      width={120}
                      height={120}
                      className="rounded-full"
                    />
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-2">{courseData.instructor.name}</h2>
                      <p className="text-muted-foreground mb-4">{courseData.instructor.bio}</p>

                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold">
                            {instructorStats ? instructorStats.averageRating.toFixed(1) : '0.0'}
                          </div>
                          <div className="text-sm text-muted-foreground">{t("course.rating")}</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold">
                            {instructorStats ? instructorStats.totalStudents.toLocaleString() : '0'}
                          </div>
                          <div className="text-sm text-muted-foreground">{t("course.students")}</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold">
                            {instructorStats ? instructorStats.totalCourses : '0'}
                          </div>
                          <div className="text-sm text-muted-foreground">Courses</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="space-y-6">
                  <CourseReviews
                    courseId={course.id}
                    reviews={[]}
                    averageRating={course.rating || 0}
                    totalReviews={course.reviewsCount || 0}
                    canReview={false}
                  />
                  
                  {/* Comment Section */}
                  <div className="mt-8 space-y-6">
                    {/* Write Comment */}
                    {currentUser && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Write a Review</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center space-x-4">
                            <Image
                              src={currentUser.avatar || "/placeholder.svg"}
                              alt={`${currentUser.firstName} ${currentUser.lastName}`}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                            <div>
                              <h4 className="font-semibold">{`${currentUser.firstName} ${currentUser.lastName}`}</h4>
                              <p className="text-sm text-muted-foreground">Share your experience with this course</p>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Your Rating</label>
                            <div className="flex space-x-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-5 w-5 cursor-pointer hover:scale-110 transition-transform ${
                                    star <= (hoveredRating || newRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                  }`}
                                  onClick={() => setNewRating(star)}
                                  onMouseEnter={() => setHoveredRating(star)}
                                  onMouseLeave={() => setHoveredRating(0)}
                                />
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Your Comment</label>
                            <Textarea
                              placeholder="Share your experience with this course..."
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              rows={4}
                              className="min-h-[100px]"
                            />
                          </div>
                                           <Button
                   disabled={!newComment.trim() || newRating === 0 || isSubmitting}
                   onClick={handleSubmitReview}
                 >
                   {isSubmitting ? "Submitting..." : "Submit Review"}
                 </Button>
                        </CardContent>
                      </Card>
                    )}

                               {/* Reviews List */}
           <Card>
             <CardHeader>
               <div className="flex items-center justify-between">
                 <CardTitle>Reviews ({reviews.length})</CardTitle>
                 <select className="text-sm border rounded px-3 py-1">
                   <option value="newest">Newest First</option>
                   <option value="oldest">Oldest First</option>
                   <option value="helpful">Most Helpful</option>
                 </select>
               </div>
             </CardHeader>
             <CardContent className="space-y-6">
               {!currentUser && !isLoadingUser ? (
                 <div className="text-center py-8">
                   <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                   <h4 className="text-lg font-medium mb-2">Sign in to review</h4>
                   <p className="text-sm text-muted-foreground mb-4">Join the discussion by signing in to your account</p>
                   <Link href="/sign-in">
                     <Button>Sign In</Button>
                   </Link>
                 </div>
               ) : reviews.length === 0 ? (
                 <div className="text-center py-8">
                   <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                   <h4 className="text-lg font-medium mb-2">No reviews yet</h4>
                   <p className="text-sm text-muted-foreground">Be the first to share your thoughts about this course!</p>
                 </div>
               ) : (
                 <div className="space-y-6">
                   {reviews.map((review) => (
                     <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                       <div className="flex items-start space-x-4">
                         <Image
                           src={review.user.avatar || "/placeholder.svg"}
                           alt={`${review.user.firstName} ${review.user.lastName}`}
                           width={40}
                           height={40}
                           className="rounded-full"
                         />
                         <div className="flex-1">
                           <div className="flex items-center justify-between mb-2">
                             <div className="flex items-center space-x-2">
                               <h4 className="font-semibold">{`${review.user.firstName} ${review.user.lastName}`}</h4>
                               <div className="flex space-x-1">
                                 {[1, 2, 3, 4, 5].map((star) => (
                                   <Star
                                     key={star}
                                     className={`h-4 w-4 ${
                                       star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                     }`}
                                   />
                                 ))}
                               </div>
                             </div>
                             {/* Show edit/delete buttons only for current user's reviews */}
                             {currentUser && 
                              `${currentUser.firstName} ${currentUser.lastName}` === `${review.user.firstName} ${review.user.lastName}` && (
                               <div className="flex space-x-2">
                                 <Button
                                   variant="ghost"
                                   size="sm"
                                   onClick={() => startEditing(review)}
                                   disabled={isSubmitting || editingReviewId === review.id}
                                   className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                 >
                                   <Edit className="h-4 w-4" />
                                 </Button>
                                 <AlertDialog>
                                   <AlertDialogTrigger asChild>
                                     <Button
                                       variant="ghost"
                                       size="sm"
                                       disabled={isSubmitting || deletingReviewId === review.id}
                                       className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                     >
                                       {deletingReviewId === review.id ? (
                                         <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                                       ) : (
                                         <Trash2 className="h-4 w-4" />
                                       )}
                                     </Button>
                                   </AlertDialogTrigger>
                                   <AlertDialogContent>
                                     <AlertDialogHeader>
                                       <AlertDialogTitle>Delete Review</AlertDialogTitle>
                                       <AlertDialogDescription>
                                         Are you sure you want to delete your review? This action cannot be undone.
                                       </AlertDialogDescription>
                                     </AlertDialogHeader>
                                     <AlertDialogFooter>
                                       <AlertDialogCancel>Cancel</AlertDialogCancel>
                                       <AlertDialogAction
                                         onClick={() => handleDeleteReview(review.id)}
                                         disabled={isSubmitting || deletingReviewId === review.id}
                                         className="bg-red-500 hover:bg-red-600"
                                       >
                                         {deletingReviewId === review.id ? "Deleting..." : "Delete Review"}
                                       </AlertDialogAction>
                                     </AlertDialogFooter>
                                   </AlertDialogContent>
                                 </AlertDialog>
                               </div>
                             )}
                           </div>
                           {editingReviewId === review.id ? (
                             <div className="space-y-4 mt-4">
                               <div>
                                 <label className="text-sm font-medium mb-2 block">Your Rating</label>
                                 <div className="flex space-x-1">
                                   {[1, 2, 3, 4, 5].map((star) => (
                                     <Star
                                       key={star}
                                       className={`h-5 w-5 cursor-pointer hover:scale-110 transition-transform ${
                                         star <= (editHoveredRating || editRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                       }`}
                                       onClick={() => setEditRating(star)}
                                       onMouseEnter={() => setEditHoveredRating(star)}
                                       onMouseLeave={() => setEditHoveredRating(0)}
                                     />
                                   ))}
                                 </div>
                               </div>
                               <div>
                                 <label className="text-sm font-medium mb-2 block">Your Comment</label>
                                 <Textarea
                                   placeholder="Share your experience with this course..."
                                   value={editComment}
                                   onChange={(e) => setEditComment(e.target.value)}
                                   rows={4}
                                   className="min-h-[100px]"
                                 />
                               </div>
                               <div className="flex space-x-2">
                                 <Button
                                   size="sm"
                                   onClick={() => handleEditReview(review.id)}
                                   disabled={!editComment.trim() || editRating === 0 || isSubmitting}
                                 >
                                   {isSubmitting ? "Updating..." : "Update Review"}
                                 </Button>
                                 <Button
                                   variant="outline"
                                   size="sm"
                                   onClick={cancelEditing}
                                   disabled={isSubmitting}
                                 >
                                   Cancel
                                 </Button>
                               </div>
                             </div>
                           ) : (
                             <>
                               <p className="text-sm text-gray-600 mb-2">{review.comment}</p>
                               <p className="text-xs text-gray-400">
                                 {new Date(review.createdAt).toLocaleDateString()}
                               </p>
                             </>
                           )}
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
               )}
             </CardContent>
           </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Level:</span>
                      <span className="font-medium">{course.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("course.duration")}:</span>
                      <span className="font-medium">{formatDuration(calculateTotalDuration(course.sections))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lessons:</span>
                      <span className="font-medium">{calculateTotalLessons(course.sections)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Language:</span>
                      <span className="font-medium">{course.language}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category:</span>
                      <span className="font-medium">{course.category?.name}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Link href="/payment">
                      <Button className="w-full" size="sm">
                        <Play className={`h-4 w-4 ${isRTL ? "ml-2 mr-0" : "mr-2"}`} />
                        Enroll Now
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full bg-transparent" size="sm">
                      <Bookmark className={`h-4 w-4 ${isRTL ? "ml-2 mr-0" : "mr-2"}`} />
                      Add to Bookmarks
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent" size="sm">
                      <Share2 className={`h-4 w-4 ${isRTL ? "ml-2 mr-0" : "mr-2"}`} />
                      Share Course
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Player Modal */}
      {showVideoPlayer && course?.previewVideo && (
        <VideoPlayer
          videoUrl={course.previewVideo}
          videoType={getVideoType(course.previewVideo)}
          onClose={() => setShowVideoPlayer(false)}
          title={`${course.title} - Preview`}
        />
      )}
    </div>
  )
}

