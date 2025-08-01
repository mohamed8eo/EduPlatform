"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, Save, ArrowLeft, Play } from "lucide-react"
import { createCourse } from "@/lib/action/courses"
import VideoUpload from "@/components/video-upload"
import ImageUpload from "@/components/image-upload"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

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
  totalDuration: number
  thumbnailUrl?: string
  thumbnailFile?: ImageData | null
  previewVideo?: VideoData | null
  sections: Section[]
}

export default function CreateCoursePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [courseData, setCourseData] = useState<CourseData>({
    title: "",
    description: "",
    price: 0,
    category: "",
    totalDuration: 0,
    sections: []
  })

  // Helper function to handle number-only input
  const handleNumberInput = (value: string, setter: (value: number) => void) => {
    // Only allow numbers and decimal point
    const numericValue = value.replace(/[^0-9.]/g, '')
    
    // Prevent multiple decimal points
    const parts = numericValue.split('.')
    if (parts.length > 2) {
      return
    }
    
    // Allow empty string or valid number
    if (numericValue === '' || numericValue === '.') {
      setter(0)
    } else {
      const numValue = parseFloat(numericValue)
      if (!isNaN(numValue)) {
        setter(numValue)
      }
    }
  }

  const addSection = () => {
    setCourseData(prev => ({
      ...prev,
      sections: [...prev.sections, {
        title: "",
        description: "",
        lessons: []
      }]
    }))
  }

  const updateSection = (index: number, field: keyof Section, value: string) => {
    setCourseData(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) => 
        i === index ? { ...section, [field]: value } : section
      )
    }))
  }

  const removeSection = (index: number) => {
    setCourseData(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }))
  }

  const addLesson = (sectionIndex: number) => {
    setCourseData(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) => 
        i === sectionIndex ? {
          ...section,
          lessons: [...section.lessons, {
            title: "",
            description: "",
            content: "",
            type: 'VIDEO',
            isPreview: false
          }]
        } : section
      )
    }))
  }

  const updateLesson = (sectionIndex: number, lessonIndex: number, field: keyof Lesson, value: any) => {
    setCourseData(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) => 
        i === sectionIndex ? {
          ...section,
          lessons: section.lessons.map((lesson, j) => 
            j === lessonIndex ? { ...lesson, [field]: value } : lesson
          )
        } : section
      )
    }))
  }

  const removeLesson = (sectionIndex: number, lessonIndex: number) => {
    setCourseData(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) => 
        i === sectionIndex ? {
          ...section,
          lessons: section.lessons.filter((_, j) => j !== lessonIndex)
        } : section
      )
    }))
  }

  const handleSave = async () => {
    if (!courseData.title || !courseData.description || !courseData.category || courseData.totalDuration <= 0) {
      toast.error("Please fill in all required fields including total duration")
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
        totalDuration: courseData.totalDuration,
        thumbnailUrl: courseData.thumbnailFile?.url || courseData.thumbnailUrl,
        previewVideoUrl: courseData.previewVideo?.url,
        sections: courseData.sections.map(section => ({
          title: section.title,
          description: section.description,
          lessons: section.lessons.map(lesson => ({
            title: lesson.title,
            description: lesson.description,
            content: lesson.content,
            videoUrl: lesson.videoFile?.url || lesson.videoUrl,
            duration: lesson.duration || 0,
            type: lesson.type || 'VIDEO',
            isPreview: lesson.isPreview || false,
            cloudinaryData: lesson.videoFile?.cloudinaryData,
            videoProvider: lesson.videoFile?.provider || 'cloudinary'
          }))
        }))
      }
      
      console.log('Creating course with clean data:', cleanCourseData)
      
      const result = await createCourse(cleanCourseData)
      console.log('Course creation result:', result)
      
      if (result.success) {
        toast.success("Course created successfully!")
        router.push('/dashboard/courses')
      } else {
        console.error('Course creation failed:', result.error)
        toast.error(result.error || "Failed to create course")
      }
    } catch (error) {
      console.error('Error in handleSave:', error)
      toast.error("An error occurred while creating the course")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Create New Course</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={courseData.description}
                  onChange={(e) => setCourseData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter course description"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={courseData.category} onValueChange={(value) => setCourseData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="programming">Programming</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="music">Music</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (USD) *</Label>
                  <Input
                    id="price"
                    type="text"
                    value={courseData.price || ''}
                    onChange={(e) => handleNumberInput(e.target.value, (value) => setCourseData(prev => ({ ...prev, price: value })))}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="totalDuration">Total Duration (minutes) *</Label>
                  <Input
                    id="totalDuration"
                    type="text"
                    value={courseData.totalDuration || ''}
                    onChange={(e) => handleNumberInput(e.target.value, (value) => setCourseData(prev => ({ ...prev, totalDuration: Math.floor(value) })))}
                    placeholder="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Media */}
          <Card>
            <CardHeader>
              <CardTitle>Course Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Course Thumbnail</Label>
                <ImageUpload
                  onImageChange={(imageData) => setCourseData(prev => ({ ...prev, thumbnailFile: imageData }))}
                  currentImage={courseData.thumbnailFile}
                  label="Upload Course Thumbnail"
                  description="Upload a thumbnail image (JPEG, PNG, WebP - Max 10MB)"
                />
              </div>

              <div className="space-y-4">
                <Label>Preview Video</Label>
                <VideoUpload
                  onVideoChange={(videoData) => setCourseData(prev => ({ ...prev, previewVideo: videoData }))}
                  currentVideo={courseData.previewVideo}
                />
              </div>
            </CardContent>
          </Card>

          {/* Course Content */}
          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {courseData.sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Section {sectionIndex + 1}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSection(sectionIndex)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
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
                      <Textarea
                        value={section.description}
                        onChange={(e) => updateSection(sectionIndex, 'description', e.target.value)}
                        placeholder="Enter section description"
                        rows={2}
                      />
                    </div>

                    {/* Lessons */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Lessons</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addLesson(sectionIndex)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Lesson
                        </Button>
                      </div>

                      {section.lessons.map((lesson, lessonIndex) => (
                        <div key={lessonIndex} className="border rounded p-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">Lesson {lessonIndex + 1}</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeLesson(sectionIndex, lessonIndex)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

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
                              <Select 
                                value={lesson.type} 
                                onValueChange={(value) => updateLesson(sectionIndex, lessonIndex, 'type', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="VIDEO">Video</SelectItem>
                                  <SelectItem value="TEXT">Text</SelectItem>
                                  <SelectItem value="QUIZ">Quiz</SelectItem>
                                  <SelectItem value="ASSIGNMENT">Assignment</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Lesson Description</Label>
                            <Textarea
                              value={lesson.description}
                              onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'description', e.target.value)}
                              placeholder="Enter lesson description"
                              rows={2}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Lesson Content</Label>
                            <Textarea
                              value={lesson.content}
                              onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'content', e.target.value)}
                              placeholder="Enter lesson content"
                              rows={3}
                            />
                          </div>

                          {lesson.type === 'VIDEO' && (
                            <div className="space-y-4">
                              <Label>Video Content</Label>
                              <VideoUpload
                                onVideoChange={async (videoData) => {
                                  console.log('Video upload data:', videoData)
                                  console.log('Cloudinary data:', videoData?.cloudinaryData)
                                  console.log('Duration from cloudinaryData:', videoData?.cloudinaryData?.duration)
                                  
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
                                currentVideo={lesson.videoFile}
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
                            <Switch
                              id={`preview-${sectionIndex}-${lessonIndex}`}
                              checked={lesson.isPreview}
                              onCheckedChange={(checked) => updateLesson(sectionIndex, lessonIndex, 'isPreview', checked)}
                            />
                            <Label htmlFor={`preview-${sectionIndex}-${lessonIndex}`}>
                              Preview Lesson
                            </Label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              <Button onClick={addSection} variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Section
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleSave} 
                disabled={isLoading}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Creating..." : "Create Course"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Course Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Sections:</span>
                <Badge variant="secondary">{courseData.sections.length}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Total Lessons:</span>
                <Badge variant="secondary">
                  {courseData.sections.reduce((total, section) => total + section.lessons.length, 0)}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Total Duration:</span>
                <Badge variant="secondary">
                  {courseData.totalDuration > 0 ? `${Math.floor(courseData.totalDuration / 60)}h ${courseData.totalDuration % 60}m` : '0m'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Preview Lessons:</span>
                <Badge variant="secondary">
                  {courseData.sections.reduce((total, section) => 
                    total + section.lessons.filter(lesson => lesson.isPreview).length, 0
                  )}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
