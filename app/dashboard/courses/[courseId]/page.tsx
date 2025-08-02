"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  Edit, 
  Eye, 
  Trash2, 
  Users, 
  DollarSign, 
  Star, 
  Clock, 
  BookOpen, 
  Play, 
  FileText, 
  CheckCircle,
  MoreVertical,
  Settings,
  Share,
  Download,
  EyeOff,
  Calendar,
  Tag,
  Globe,
  Target,
  Award,
  MessageCircle,
  Video,
  FileVideo,
  Lock,
  Unlock,
  Copy,
  ExternalLink,
  HelpCircle,
  ClipboardList
} from "lucide-react"
import { getCourse } from '@/lib/action/courses'
import { toast } from "sonner"
import VideoPlayer from '@/components/video-player'
import { toggleCourseFeature } from '@/lib/action/courses'

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
  sections: Section[]
}

export default function CourseDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [course, setCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState<{ url: string; type: string; title: string } | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const result = await getCourse(params.courseId as string)
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
              name: result.course.category?.name || ''
            },
            sections: result.course.sections?.map((section: Section) => ({
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
        } else {
          toast.error("Failed to fetch course")
          router.push('/dashboard/courses')
        }
      } catch (error) {
        console.error('Error fetching course:', error)
        toast.error("Error loading course")
        router.push('/dashboard/courses')
      } finally {
        setIsLoading(false)
      }
    }

    if (params.courseId) {
      fetchCourse()
    }
  }, [params.courseId, router])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "published":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "draft":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "archived":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    }
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  // Helper functions to calculate course totals
  const calculateTotalLessons = (sections: Section[] | undefined) => {
    return sections?.reduce((total, section) => total + section.lessons.length, 0) || 0
  }

  const calculateTotalDuration = (sections: Section[] | undefined) => {
    return sections?.reduce((total, section) => 
      total + section.lessons.reduce((sectionTotal, lesson) => 
        sectionTotal + (lesson.duration || 0), 0), 0) || 0
  }

  const handleEditCourse = () => {
    if (course) {
      router.push(`/dashboard/courses/edit/${course.id}`)
    }
  }

  const handlePreviewCourse = () => {
    if (course) {
      // Open course preview in new tab
      window.open(`/courses/${course.id}`, '_blank')
    }
  }

  const handleShareCourse = async () => {
    if (course) {
      const courseUrl = `${window.location.origin}/courses/${course.slug}`
      try {
        await navigator.clipboard.writeText(courseUrl)
        toast.success("Course URL copied to clipboard!")
      } catch (error) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = courseUrl
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        toast.success("Course URL copied to clipboard!")
      }
    }
  }

  const handleExportData = () => {
    if (course) {
      // Create course data for export
      const courseData = {
        title: course.title,
        description: course.description,
        price: course.price,
        category: course.category?.name,
        status: course.status,
        studentsCount: course.studentsCount,
        rating: course.rating,
        totalLessons: calculateTotalLessons(course.sections),
        totalDuration: calculateTotalDuration(course.sections),
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
        sections: course.sections?.map(section => ({
          title: section.title,
          description: section.description,
          lessons: section.lessons?.map(lesson => ({
            title: lesson.title,
            description: lesson.description,
            duration: lesson.duration,
            type: lesson.type,
            isPreview: lesson.isPreview
          }))
        }))
      }

      // Create and download JSON file
      const dataStr = JSON.stringify(courseData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${course.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_export.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      toast.success("Course data exported successfully!")
    }
  }

  const handleVideoClick = (lesson: Lesson) => {
    if (!lesson.videoUrl) {
      toast.error("No video available for this lesson")
      return
    }

    // Determine video type
    let videoType: 'cloudinary' | 'youtube' | 'vimeo' | 'external' = 'external'
    if (lesson.videoUrl.includes('youtube.com') || lesson.videoUrl.includes('youtu.be')) {
      videoType = 'youtube'
    } else if (lesson.videoUrl.includes('vimeo.com')) {
      videoType = 'vimeo'
    } else if (lesson.videoUrl.includes('cloudinary.com')) {
      videoType = 'cloudinary'
    }

    setSelectedVideo({
      url: lesson.videoUrl,
      type: videoType,
      title: lesson.title
    })
  }

  const handleToggleFeature = async (feature: 'hasCertificate' | 'hasDownloads' | 'hasDiscussions' | 'hasLifetimeAccess' | 'hasMobileAccess') => {
    if (!course) return

    try {
      const result = await toggleCourseFeature(course.id, feature)
      
      if (result.success) {
        // Update the course state with the new feature value
        setCourse(prev => prev ? {
          ...prev,
          [feature]: (result as any)[feature]
        } : null)
        
        toast.success(result.message)
      } else {
        toast.error(result.error || 'Failed to toggle feature')
      }
    } catch (error) {
      console.error('Error toggling feature:', error)
      toast.error('An error occurred while updating the feature')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading course...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Course not found</h2>
            <Button onClick={() => router.push('/dashboard/courses')}>
              Back to Courses
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{course.title}</h1>
            <p className="text-muted-foreground">{course.category?.name}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePreviewCourse}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button onClick={handleEditCourse}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Course
            </Button>
          </div>
        </div>

        {/* Course Hero */}
        <Card className="mb-8">
          <div className="relative">
            <Image
              src={course.thumbnail || "/placeholder.svg"}
              alt={course.title}
              width={1200}
              height={400}
              className="w-full h-64 object-cover rounded-t-lg"
            />
            <div className="absolute top-4 left-4">
              <Badge className={getStatusColor(course.status)}>{course.status}</Badge>
            </div>
            <div className="absolute top-4 right-4">
              <Button variant="ghost" size="sm" className="bg-background/80 hover:bg-background">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{course.studentsCount}</p>
                  <p className="text-xs text-muted-foreground">Students</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">${course.price}</p>
                  <p className="text-xs text-muted-foreground">Price</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <div>
                  <p className="text-sm font-medium">{course.rating || 0}</p>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{formatDuration(calculateTotalDuration(course.sections))}</p>
                  <p className="text-xs text-muted-foreground">Duration</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Course Details */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{course.longDescription || course.description}</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30">
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-green-900 dark:text-green-100">What You'll Learn</CardTitle>
                        <p className="text-sm text-green-700 dark:text-green-300">Master these essential skills and concepts</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {course.whatYouWillLearn?.map((item, index) => (
                        <div 
                          key={index} 
                          className="flex items-start gap-3 p-4 rounded-lg bg-white/60 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 transition-colors duration-200"
                        >
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white text-xs font-semibold flex-shrink-0 mt-0.5">
                            {index + 1}
                          </div>
                          <span className="text-green-900 dark:text-green-100 font-medium">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30">
                        <div className="w-5 h-5 rounded-full bg-blue-600 dark:bg-blue-400"></div>
                      </div>
                      <div>
                        <CardTitle className="text-xl text-blue-900 dark:text-blue-100">Requirements</CardTitle>
                        <p className="text-sm text-blue-700 dark:text-blue-300">What you need to get started</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {course.requirements?.map((req, index) => (
                        <div 
                          key={index} 
                          className="flex items-start gap-3 p-4 rounded-lg bg-white/60 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 transition-colors duration-200"
                        >
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-semibold flex-shrink-0 mt-0.5">
                            {index + 1}
                          </div>
                          <span className="text-blue-900 dark:text-blue-100 font-medium">{req}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="curriculum" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Content</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {calculateTotalLessons(course.sections)} lessons • {formatDuration(calculateTotalDuration(course.sections))}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {course.sections?.map((section, sectionIndex) => (
                        <div key={section.id} className="border rounded-lg">
                          <div className="p-4 bg-muted/50">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-semibold">Section {sectionIndex + 1}: {section.title}</h3>
                                <p className="text-sm text-muted-foreground">{section.description}</p>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {section.lessons.length} lessons • {formatDuration(section.lessons.reduce((total, lesson) => total + (lesson.duration || 0), 0))}
                              </div>
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="space-y-2">
                              {section.lessons?.map((lesson, lessonIndex) => (
                                <div key={lesson.id} className="flex items-center justify-between py-2">
                                  <div className="flex items-center space-x-3">
                                    <div 
                                      className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center ${
                                        lesson.type === 'VIDEO' && lesson.videoUrl ? 'cursor-pointer hover:bg-muted-foreground/20' : ''
                                      }`}
                                      onClick={() => lesson.type === 'VIDEO' && lesson.videoUrl && handleVideoClick(lesson)}
                                    >
                                      {lesson.type === 'VIDEO' ? (
                                        <Play className="h-4 w-4" />
                                      ) :
                                      lesson.type === 'QUIZ' ? (
                                        <HelpCircle className="h-4 w-4" />
                                      ) :
                                      lesson.type === 'ASSIGNMENT' ? (
                                        <ClipboardList className="h-4 w-4" />
                                      ) :
                                      lesson.type === 'TEXT' ? (
                                        <BookOpen className="h-4 w-4" />
                                      ) : null}
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">{lesson.title}</p>
                                      <p className="text-xs text-muted-foreground">{lesson.description}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    {lesson.isPreview && (
                                      <Badge variant="outline" className="text-xs">Preview</Badge>
                                    )}
                                    <span className="text-xs text-muted-foreground">
                                      {formatDuration(lesson.duration)}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Student Engagement</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-2xl font-bold">{course.studentsCount}</p>
                          <p className="text-sm text-muted-foreground">Total Students</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{course.rating || 0}</p>
                          <p className="text-sm text-muted-foreground">Average Rating</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{course.reviewsCount}</p>
                          <p className="text-sm text-muted-foreground">Total Reviews</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-2xl font-bold">${(course.price * course.studentsCount).toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">Total Revenue</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">${course.price}</p>
                          <p className="text-sm text-muted-foreground">Price per Student</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Course Status</p>
                          <p className="text-sm text-muted-foreground">Control course visibility</p>
                        </div>
                        <Badge className={getStatusColor(course.status)}>{course.status}</Badge>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Certificate</p>
                          <p className="text-sm text-muted-foreground">Allow completion certificates</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleToggleFeature('hasCertificate')}>
                          {course.hasCertificate ? <CheckCircle className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                        </Button>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Downloads</p>
                          <p className="text-sm text-muted-foreground">Allow resource downloads</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleToggleFeature('hasDownloads')}>
                          {course.hasDownloads ? <CheckCircle className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{course.category?.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{course.level}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{course.language}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Created {formatDate(course.createdAt)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={handleEditCourse}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Course
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={handlePreviewCourse}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Preview Course
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={handleShareCourse}>
                  <Copy className="h-4 w-4 mr-2" />
                  Share Course
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={handleExportData}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Course Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Certificate</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleToggleFeature('hasCertificate')}
                    className="h-6 w-6 p-0"
                  >
                    {course.hasCertificate ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Lock className="h-4 w-4 text-muted-foreground" />}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Download className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Downloads</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleToggleFeature('hasDownloads')}
                    className="h-6 w-6 p-0"
                  >
                    {course.hasDownloads ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Lock className="h-4 w-4 text-muted-foreground" />}
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Discussions</span>
                  {course.hasDiscussions ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Lock className="h-4 w-4 text-muted-foreground" />}
                </div>
                <div className="flex items-center space-x-2">
                  <Video className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Lifetime Access</span>
                  {course.hasLifetimeAccess ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Lock className="h-4 w-4 text-muted-foreground" />}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Video Player Modal */}
      {selectedVideo && (
        <VideoPlayer
          videoUrl={selectedVideo.url}
          videoType={selectedVideo.type as 'cloudinary' | 'youtube' | 'vimeo' | 'external'}
          title={selectedVideo.title}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  )
}