"use client"

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Save, 
  Eye,
  Upload,
  Video,
  Image as ImageIcon,
  FileText,
  Play,
  Lock,
  Unlock
} from "lucide-react"
import { toast } from "sonner"
import ImageUpload from "@/components/image-upload"
import VideoUpload from "@/components/video-upload"
import { getCourse, updateCourse } from '@/lib/action/courses'

interface Lesson {
  id?: string
  title: string
  description: string
  content: string
  videoUrl?: string
  duration?: number
  type?: string
  isPreview?: boolean
  videoFile?: any
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
  thumbnailFile?: any
  previewVideo?: any
  sections: Section[]
}

export default function EditCoursePage() {
  const params = useParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [courseData, setCourseData] = useState<CourseData>({
    title: '',
    description: '',
    price: 0,
    category: '',
    sections: []
  })

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const result = await getCourse(params.editId as string)
        if (result.success && result.course) {
          const course = result.course as any
          setCourseData({
            title: course.title || '',
            description: course.description || '',
            price: course.price || 0,
            category: course.category?.name || '',
            thumbnailUrl: course.thumbnail || '',
            previewVideoUrl: course.previewVideo || '',
            sections: course.sections?.map((section: any) => ({
              id: section.id,
              title: section.title || '',
              description: section.description || '',
              lessons: section.lessons?.map((lesson: any) => ({
                id: lesson.id,
                title: lesson.title || '',
                description: lesson.description || '',
                content: lesson.content || '',
                videoUrl: lesson.videoUrl || '',
                duration: lesson.duration || 0,
                type: lesson.type || 'VIDEO',
                isPreview: lesson.isPreview || false
              })) || []
            })) || []
          })
        } else {
          toast.error("Failed to fetch course")
          router.push('/dashboard/courses')
        }
      } catch (error) {
        console.error('Error fetching course:', error)
        toast.error("Error loading course")
        router.push('/dashboard/courses')
      }
    }

    if (params.editId) {
      fetchCourse()
    }
  }, [params.editId, router])

  const addSection = () => {
    setCourseData(prev => ({
      ...prev,
      sections: [...prev.sections, {
        title: '',
        description: '',
        lessons: []
      }]
    }))
  }

  const removeSection = (sectionIndex: number) => {
    setCourseData(prev => ({
      ...prev,
      sections: prev.sections.filter((_, index) => index !== sectionIndex)
    }))
  }

  const updateSection = (sectionIndex: number, field: keyof Section, value: string) => {
    setCourseData(prev => ({
      ...prev,
      sections: prev.sections.map((section, index) =>
        index === sectionIndex ? { ...section, [field]: value } : section
      )
    }))
  }

  const addLesson = (sectionIndex: number) => {
    setCourseData(prev => ({
      ...prev,
      sections: prev.sections.map((section, index) =>
        index === sectionIndex
          ? {
              ...section,
              lessons: [...section.lessons, {
                title: '',
                description: '',
                content: '',
                type: 'VIDEO',
                isPreview: false
              }]
            }
          : section
      )
    }))
  }

  const removeLesson = (sectionIndex: number, lessonIndex: number) => {
    setCourseData(prev => ({
      ...prev,
      sections: prev.sections.map((section, sIndex) =>
        sIndex === sectionIndex
          ? {
              ...section,
              lessons: section.lessons.filter((_, lIndex) => lIndex !== lessonIndex)
            }
          : section
      )
    }))
  }

  const updateLesson = (sectionIndex: number, lessonIndex: number, field: keyof Lesson, value: any) => {
    setCourseData(prev => ({
      ...prev,
      sections: prev.sections.map((section, sIndex) =>
        sIndex === sectionIndex
          ? {
              ...section,
              lessons: section.lessons.map((lesson, lIndex) =>
                lIndex === lessonIndex ? { ...lesson, [field]: value } : lesson
              )
            }
          : section
      )
    }))
  }

  const handleSave = async () => {
    if (!courseData.title || !courseData.description || !courseData.category) {
      toast.error("Please fill in all required fields")
      return
    }

    if (courseData.sections.length === 0) {
      toast.error("Please add at least one section")
      return
    }

    setIsLoading(true)
    try {
      // Clean the data before sending to server action
      const cleanCourseData = {
        title: courseData.title,
        description: courseData.description,
        price: courseData.price,
        category: courseData.category,
        thumbnailUrl: courseData.thumbnailFile?.url || courseData.thumbnailUrl,
        previewVideoUrl: courseData.previewVideo?.url,
        sections: courseData.sections.map(section => ({
          id: section.id,
          title: section.title,
          description: section.description,
          lessons: section.lessons.map(lesson => ({
            id: lesson.id,
            title: lesson.title,
            description: lesson.description,
            content: lesson.content,
            videoUrl: lesson.videoUrl || lesson.videoFile?.url || '',
            duration: lesson.duration || 0,
            type: lesson.type || 'VIDEO',
            isPreview: lesson.isPreview || false,
            cloudinaryData: lesson.videoFile?.cloudinaryData,
            videoProvider: lesson.videoFile?.provider || 'cloudinary'
          }))
        }))
      }
      
      console.log('Updating course with clean data:', cleanCourseData)
      console.log('Video URLs in lessons:', cleanCourseData.sections.map(section => 
        section.lessons.map(lesson => ({ title: lesson.title, videoUrl: lesson.videoUrl }))
      ))
      
      const result = await updateCourse(params.editId as string, cleanCourseData)
      console.log('Course update result:', result)
      
      if (result.success) {
        toast.success("Course updated successfully!")
        router.push('/dashboard/courses')
      } else {
        console.error('Course update failed:', result.error)
        toast.error(result.error || "Failed to update course")
      }
    } catch (error) {
      console.error('Error in handleSave:', error)
      toast.error("An error occurred while updating the course")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex lg:flex-row flex-col items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => router.back()} className='w-full lg:w-auto justify-start '>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Edit Course</h1>
            <p className="text-muted-foreground">Update your course information and content</p>
          </div>
                     <div className="flex gap-2">
             <Button variant="outline">
               <Eye className="h-4 w-4 mr-2" />
               Preview
             </Button>
             <Button
               variant="outline"
               onClick={() => {
                 setCourseData(prev => ({
                   ...prev,
                   sections: prev.sections.map(section => ({
                     ...section,
                     lessons: section.lessons.map(lesson => ({
                       ...lesson,
                       duration: lesson.duration || 0
                     }))
                   }))
                 }))
                 toast.success("Section durations recalculated!")
               }}
             >
               Recalculate Durations
             </Button>
             <Button onClick={handleSave} disabled={isLoading}>
               <Save className="h-4 w-4 mr-2" />
               {isLoading ? "Saving..." : "Save Changes"}
             </Button>
           </div>
        </div>

        {/* Course Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Course Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Course Title *</Label>
                <Input
                  id="title"
                  value={courseData.title}
                  onChange={(e) => setCourseData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter course title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  value={courseData.category}
                  onChange={(e) => setCourseData(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="e.g., Programming, Design, Business"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={courseData.description}
                onChange={(e) => setCourseData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of your course"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  value={courseData.price}
                  onChange={(e) => setCourseData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  placeholder="0.00"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Media Upload */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Course Media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Course Thumbnail</Label>
                <ImageUpload
                  onImageChange={(imageData) => setCourseData(prev => ({ ...prev, thumbnailFile: imageData }))}
                  currentImage={courseData.thumbnailUrl ? { type: 'url', url: courseData.thumbnailUrl } : undefined}
                  label="Upload Thumbnail"
                  description="Upload course thumbnail (JPEG, PNG, WebP - Max 10MB)"
                />
              </div>
              <div className="space-y-2">
                <Label>Preview Video</Label>
                <VideoUpload
                  onVideoChange={(videoData) => setCourseData(prev => ({ ...prev, previewVideo: videoData }))}
                  currentVideo={courseData.previewVideoUrl ? { type: 'url', url: courseData.previewVideoUrl } : undefined}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Content */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Course Content</CardTitle>
              <Button onClick={addSection} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Section
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {courseData.sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Section {sectionIndex + 1}</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeSection(sectionIndex)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Section Title</Label>
                        <Input
                          value={section.title}
                          onChange={(e) => updateSection(sectionIndex, 'title', e.target.value)}
                          placeholder="Enter section title"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Section Description</Label>
                        <Input
                          value={section.description}
                          onChange={(e) => updateSection(sectionIndex, 'description', e.target.value)}
                          placeholder="Brief description of this section"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Lessons */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Lessons</h4>
                      <Button
                        onClick={() => addLesson(sectionIndex)}
                        variant="outline"
                        size="sm"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Lesson
                      </Button>
                    </div>

                    {section.lessons.map((lesson, lessonIndex) => (
                      <div key={lessonIndex} className="border rounded-lg p-4 bg-muted/30">
                        <div className="flex items-center justify-between mb-4">
                          <h5 className="font-medium">Lesson {lessonIndex + 1}</h5>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeLesson(sectionIndex, lessonIndex)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Lesson Title</Label>
                              <Input
                                value={lesson.title}
                                onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'title', e.target.value)}
                                placeholder="Enter lesson title"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Lesson Type</Label>
                              <select
                                value={lesson.type}
                                onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'type', e.target.value)}
                                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                              >
                                <option value="VIDEO">Video</option>
                                <option value="TEXT">Text</option>
                                <option value="QUIZ">Quiz</option>
                                <option value="ASSIGNMENT">Assignment</option>
                              </select>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Lesson Description</Label>
                            <Input
                              value={lesson.description}
                              onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'description', e.target.value)}
                              placeholder="Brief description of this lesson"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Lesson Content</Label>
                            <Textarea
                              value={lesson.content}
                              onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'content', e.target.value)}
                              placeholder="Detailed content for this lesson"
                              rows={3}
                            />
                          </div>

                          {lesson.type === 'VIDEO' && (
                            <div className="space-y-2">
                              <Label>Video Upload</Label>
                              <VideoUpload
                                onVideoChange={async (videoData) => {
                                  console.log('Video upload data:', videoData)
                                  
                                  // Update video file
                                  updateLesson(sectionIndex, lessonIndex, 'videoFile', videoData)
                                  
                                  // Also update the videoUrl field for proper saving
                                  if (videoData?.url) {
                                    console.log('Updating videoUrl to:', videoData.url)
                                    updateLesson(sectionIndex, lessonIndex, 'videoUrl', videoData.url)
                                  }
                                  
                                  // Extract and update duration automatically
                                  let duration = 0
                                  
                                  if (videoData?.cloudinaryData?.duration) {
                                    // For uploaded videos, extract duration from Cloudinary data
                                    // Cloudinary returns duration in seconds, convert to minutes
                                    const durationInSeconds = videoData.cloudinaryData.duration
                                    duration = Math.max(1, Math.round(durationInSeconds / 60))
                                    console.log('Raw duration from Cloudinary (seconds):', durationInSeconds)
                                    console.log('Calculated duration (minutes):', duration)
                                    // Update duration immediately for uploaded videos
                                    updateLesson(sectionIndex, lessonIndex, 'duration', duration)
                                  } else if (videoData?.url) {
                                    // For YouTube URLs, extract video ID and get duration
                                    const youtubeMatch = videoData.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
                                    if (youtubeMatch) {
                                      const videoId = youtubeMatch[1]
                                      console.log('YouTube video ID:', videoId)
                                      
                                      try {
                                        const response = await fetch(`/api/youtube-duration?videoId=${videoId}`)
                                        const data = await response.json()
                                        
                                        if (data.duration) {
                                          const durationInMinutes = Math.round(data.duration / 60)
                                          console.log('YouTube duration:', durationInMinutes, 'minutes')
                                          updateLesson(sectionIndex, lessonIndex, 'duration', durationInMinutes)
                                        } else {
                                          console.error('YouTube API error:', data.error)
                                          toast.error(`YouTube API error: ${data.error || 'Unknown error'}`)
                                          updateLesson(sectionIndex, lessonIndex, 'duration', 5)
                                        }
                                      } catch (error) {
                                        console.error('Error fetching YouTube duration:', error)
                                        toast.error('Failed to fetch YouTube video duration')
                                        updateLesson(sectionIndex, lessonIndex, 'duration', 5)
                                      }
                                    } else {
                                      // For other URLs, set a default duration
                                      updateLesson(sectionIndex, lessonIndex, 'duration', 5)
                                    }
                                  } else {
                                    // If no duration found, set a default
                                    updateLesson(sectionIndex, lessonIndex, 'duration', 5)
                                  }
                                }}
                                currentVideo={lesson.videoUrl ? { type: 'url', url: lesson.videoUrl } : undefined}
                              />
                              
                              {/* Duration Display */}
                              {lesson.duration && lesson.duration > 0 && (
                                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                                  <p className="text-sm text-green-700 flex items-center gap-2">
                                    <Play className="h-4 w-4" />
                                    Duration: {lesson.duration} minutes
                                  </p>
                                </div>
                              )}
                            </div>
                          )}

                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`preview-${sectionIndex}-${lessonIndex}`}
                              checked={lesson.isPreview}
                              onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'isPreview', e.target.checked)}
                              className="rounded"
                            />
                            <Label htmlFor={`preview-${sectionIndex}-${lessonIndex}`}>Preview Lesson</Label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}