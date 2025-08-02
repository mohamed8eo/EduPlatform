"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Plus, Trash2, Save, ArrowLeft, Play, HelpCircle, ClipboardList, BookOpen } from "lucide-react"
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

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
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
  quizQuestions?: QuizQuestion[]
  assignmentTitle?: string
  assignmentDescription?: string
  assignmentDueDate?: string
  assignmentPoints?: string
  assignmentInstructions?: string
  assignmentGradingCriteria?: string
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
  whatYouWillLearn: string[]
  requirements: string[]
  thumbnailUrl?: string
  thumbnailFile?: ImageData | null
  previewVideo?: VideoData | null
  sections: Section[]
}

export default function CreateCoursePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const [expandedLessons, setExpandedLessons] = useState<Record<string, string[]>>({})
  const [courseData, setCourseData] = useState<CourseData>({
    title: "",
    description: "",
    price: 0,
    category: "",
    whatYouWillLearn: [],
    requirements: [],
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
    // Auto-expand the new section
    const newSectionIndex = courseData.sections.length
    setExpandedSections(prev => [...prev, `section-${newSectionIndex}`])
  }

  const toggleSection = (sectionIndex: number) => {
    const sectionId = `section-${sectionIndex}`
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const isSectionExpanded = (sectionIndex: number) => {
    return expandedSections.includes(`section-${sectionIndex}`)
  }

  const toggleLesson = (sectionIndex: number, lessonIndex: number) => {
    const sectionId = `section-${sectionIndex}`
    const lessonId = `lesson-${sectionIndex}-${lessonIndex}`
    
    setExpandedLessons(prev => {
      const sectionLessons = prev[sectionId] || []
      const isExpanded = sectionLessons.includes(lessonId)
      
      return {
        ...prev,
        [sectionId]: isExpanded 
          ? sectionLessons.filter(id => id !== lessonId)
          : [...sectionLessons, lessonId]
      }
    })
  }

  const isLessonExpanded = (sectionIndex: number, lessonIndex: number) => {
    const sectionId = `section-${sectionIndex}`
    const lessonId = `lesson-${sectionIndex}-${lessonIndex}`
    return (expandedLessons[sectionId] || []).includes(lessonId)
  }

  const expandAllLessonsInSection = (sectionIndex: number) => {
    const section = courseData.sections[sectionIndex]
    const sectionId = `section-${sectionIndex}`
    const lessonIds = section.lessons.map((_, lessonIndex) => `lesson-${sectionIndex}-${lessonIndex}`)
    
    setExpandedLessons(prev => ({
      ...prev,
      [sectionId]: lessonIds
    }))
  }

  const collapseAllLessonsInSection = (sectionIndex: number) => {
    const sectionId = `section-${sectionIndex}`
    setExpandedLessons(prev => ({
      ...prev,
      [sectionId]: []
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
            isPreview: false,
            assignmentTitle: "",
            assignmentDescription: "",
            assignmentDueDate: "",
            assignmentPoints: "",
            assignmentInstructions: "",
            assignmentGradingCriteria: ""
          }]
        } : section
      )
    }))
    
    // Auto-expand the new lesson
    const newLessonIndex = courseData.sections[sectionIndex]?.lessons.length || 0
    const sectionId = `section-${sectionIndex}`
    const lessonId = `lesson-${sectionIndex}-${newLessonIndex}`
    
    setExpandedLessons(prev => ({
      ...prev,
      [sectionId]: [...(prev[sectionId] || []), lessonId]
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

  // Helper functions for what you'll learn and requirements
  const addWhatYouWillLearn = () => {
    setCourseData(prev => ({
      ...prev,
      whatYouWillLearn: [...prev.whatYouWillLearn, ""]
    }))
  }

  const updateWhatYouWillLearn = (index: number, value: string) => {
    setCourseData(prev => ({
      ...prev,
      whatYouWillLearn: prev.whatYouWillLearn.map((item, i) => i === index ? value : item)
    }))
  }

  const removeWhatYouWillLearn = (index: number) => {
    setCourseData(prev => ({
      ...prev,
      whatYouWillLearn: prev.whatYouWillLearn.filter((_, i) => i !== index)
    }))
  }

  const addRequirement = () => {
    setCourseData(prev => ({
      ...prev,
      requirements: [...prev.requirements, ""]
    }))
  }

  const updateRequirement = (index: number, value: string) => {
    setCourseData(prev => ({
      ...prev,
      requirements: prev.requirements.map((item, i) => i === index ? value : item)
    }))
  }

  const removeRequirement = (index: number) => {
    setCourseData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }))
  }

  // Quiz helper functions
  const addQuizQuestion = (sectionIndex: number, lessonIndex: number) => {
    setCourseData(prev => ({
      ...prev,
      sections: prev.sections.map((section, sIndex) =>
        sIndex === sectionIndex
          ? {
              ...section,
              lessons: section.lessons.map((lesson, lIndex) =>
                lIndex === lessonIndex
                  ? {
                      ...lesson,
                      quizQuestions: [
                        ...(lesson.quizQuestions || []),
                        {
                          id: `q${Date.now()}`,
                          question: '',
                          options: ['', '', '', ''],
                          correctAnswer: 0
                        }
                      ]
                    }
                  : lesson
              )
            }
          : section
      )
    }))
  }

  const updateQuizQuestion = (sectionIndex: number, lessonIndex: number, questionIndex: number, field: keyof QuizQuestion, value: any) => {
    setCourseData(prev => ({
      ...prev,
      sections: prev.sections.map((section, sIndex) =>
        sIndex === sectionIndex
          ? {
              ...section,
              lessons: section.lessons.map((lesson, lIndex) =>
                lIndex === lessonIndex
                  ? {
                      ...lesson,
                      quizQuestions: lesson.quizQuestions?.map((question, qIndex) =>
                        qIndex === questionIndex
                          ? { ...question, [field]: value }
                          : question
                      ) || []
                    }
                  : lesson
              )
            }
          : section
      )
    }))
  }

  const updateQuizOption = (sectionIndex: number, lessonIndex: number, questionIndex: number, optionIndex: number, value: string) => {
    setCourseData(prev => ({
      ...prev,
      sections: prev.sections.map((section, sIndex) =>
        sIndex === sectionIndex
          ? {
              ...section,
              lessons: section.lessons.map((lesson, lIndex) =>
                lIndex === lessonIndex
                  ? {
                      ...lesson,
                      quizQuestions: lesson.quizQuestions?.map((question, qIndex) =>
                        qIndex === questionIndex
                          ? {
                              ...question,
                              options: question.options.map((option, oIndex) =>
                                oIndex === optionIndex ? value : option
                              )
                            }
                          : question
                      ) || []
                    }
                  : lesson
              )
            }
          : section
      )
    }))
  }

  const removeQuizQuestion = (sectionIndex: number, lessonIndex: number, questionIndex: number) => {
    setCourseData(prev => ({
      ...prev,
      sections: prev.sections.map((section, sIndex) =>
        sIndex === sectionIndex
          ? {
              ...section,
              lessons: section.lessons.map((lesson, lIndex) =>
                lIndex === lessonIndex
                  ? {
                      ...lesson,
                      quizQuestions: lesson.quizQuestions?.filter((_, qIndex) => qIndex !== questionIndex) || []
                    }
                  : lesson
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
        whatYouWillLearn: courseData.whatYouWillLearn.filter(item => item.trim() !== ''),
        requirements: courseData.requirements.filter(item => item.trim() !== ''),
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
            videoProvider: lesson.videoFile?.provider || 'cloudinary',
            quizQuestions: lesson.quizQuestions || []
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

              <div className="grid grid-cols-2 gap-4">
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

          {/* What You'll Learn */}
          <Card>
            <CardHeader>
              <CardTitle>What You'll Learn</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {courseData.whatYouWillLearn.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={item}
                    onChange={(e) => updateWhatYouWillLearn(index, e.target.value)}
                    placeholder="Enter what students will learn"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeWhatYouWillLearn(index)}
                    className="hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button onClick={addWhatYouWillLearn} variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Learning Objective
              </Button>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {courseData.requirements.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={item}
                    onChange={(e) => updateRequirement(index, e.target.value)}
                    placeholder="Enter course requirement"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRequirement(index)}
                    className="hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button onClick={addRequirement} variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Requirement
              </Button>
            </CardContent>
          </Card>

          {/* Course Content */}
          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Accordion type="multiple" value={expandedSections} onValueChange={setExpandedSections}>
              {courseData.sections.map((section, sectionIndex) => (
                  <AccordionItem key={sectionIndex} value={`section-${sectionIndex}`} className="border rounded-lg">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold">
                            Section {sectionIndex + 1}
                            {section.title && `: ${section.title}`}
                          </h3>
                          <span className="text-sm text-muted-foreground">
                            ({section.lessons.length} lessons)
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeSection(sectionIndex)
                            }}
                            className="hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="space-y-4 pt-2">
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
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => expandAllLessonsInSection(sectionIndex)}
                              >
                                Expand All
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => collapseAllLessonsInSection(sectionIndex)}
                              >
                                Collapse All
                              </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addLesson(sectionIndex)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Lesson
                        </Button>
                            </div>
                      </div>

                          <Accordion 
                            type="multiple" 
                            value={expandedLessons[`section-${sectionIndex}`] || []} 
                            onValueChange={(value) => setExpandedLessons(prev => ({ ...prev, [`section-${sectionIndex}`]: value }))}
                          >
                      {section.lessons.map((lesson, lessonIndex) => (
                              <AccordionItem key={lessonIndex} value={`lesson-${sectionIndex}-${lessonIndex}`} className="border rounded">
                                <AccordionTrigger className="px-3 py-2 hover:no-underline">
                                  <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-3">
                                      <h4 className="font-medium">
                                        Lesson {lessonIndex + 1}
                                        {lesson.title && `: ${lesson.title}`}
                                      </h4>
                                      <span className="text-xs text-muted-foreground">
                                        {lesson.type}
                                      </span>
                                      {lesson.isPreview && (
                                        <Badge variant="outline" className="text-xs">Preview</Badge>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          removeLesson(sectionIndex, lessonIndex)
                                        }}
                                        className="hover:bg-destructive hover:text-destructive-foreground"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-3 pb-3">
                                  <div className="space-y-4 pt-2">
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
                                              console.log('Cloudinary duration:', durationInSeconds, 'seconds ->', duration, 'minutes')
                                              updateLesson(sectionIndex, lessonIndex, 'duration', duration)
                                            } else if (videoData?.url) {
                                              // For YouTube URLs, extract video ID and fetch duration
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

                                                                         {lesson.type === 'QUIZ' && (
                                       <div className="space-y-4">
                                         <div className="flex items-center justify-between">
                                           <Label>Quiz Questions</Label>
                                           <Button
                                             onClick={() => addQuizQuestion(sectionIndex, lessonIndex)}
                                             variant="outline"
                                             size="sm"
                                           >
                                             <Plus className="h-4 w-4 mr-2" />
                                             Add Question
                                           </Button>
                                         </div>
                                         
                                         <Accordion type="multiple" className="space-y-2">
                                           {lesson.quizQuestions?.map((question, questionIndex) => (
                                             <AccordionItem key={question.id} value={`question-${questionIndex}`} className="border rounded-lg">
                                               <AccordionTrigger className="px-4 py-3 hover:no-underline">
                                                 <div className="flex items-center justify-between w-full">
                                                   <div className="flex items-center gap-3">
                                                     <h5 className="font-medium">
                                                       Question {questionIndex + 1}
                                                       {question.question && `: ${question.question.substring(0, 50)}${question.question.length > 50 ? '...' : ''}`}
                                                     </h5>
                                                     {question.correctAnswer !== undefined && (
                                                       <Badge variant="outline" className="text-xs">
                                                         Option {question.correctAnswer + 1} Correct
                                                       </Badge>
                                                     )}
                                                   </div>
                                                   <div className="flex items-center gap-2">
                                                     <Button
                                                       variant="ghost"
                                                       size="sm"
                                                       onClick={(e) => {
                                                         e.stopPropagation()
                                                         removeQuizQuestion(sectionIndex, lessonIndex, questionIndex)
                                                       }}
                                                       className="hover:bg-destructive hover:text-destructive-foreground"
                                                     >
                                                       <Trash2 className="h-4 w-4" />
                                                     </Button>
                                                   </div>
                                                 </div>
                                               </AccordionTrigger>
                                               <AccordionContent className="px-4 pb-4">
                                                 <div className="space-y-4 pt-2">
                                                   <div className="space-y-2">
                                                     <Label>Question</Label>
                                                     <Input
                                                       value={question.question}
                                                       onChange={(e) => updateQuizQuestion(sectionIndex, lessonIndex, questionIndex, 'question', e.target.value)}
                                                       placeholder="Enter your question"
                                                     />
                                                   </div>
                                                   
                                                   <div className="space-y-3">
                                                     <Label>Options</Label>
                                                     {question.options.map((option, optionIndex) => (
                                                       <div key={optionIndex} className="flex items-center gap-3">
                                                         <input
                                                           type="radio"
                                                           name={`correct-${question.id}`}
                                                           checked={question.correctAnswer === optionIndex}
                                                           onChange={() => updateQuizQuestion(sectionIndex, lessonIndex, questionIndex, 'correctAnswer', optionIndex)}
                                                           className="text-primary"
                                                         />
                                                         <Input
                                                           value={option}
                                                           onChange={(e) => updateQuizOption(sectionIndex, lessonIndex, questionIndex, optionIndex, e.target.value)}
                                                           placeholder={`Option ${optionIndex + 1}`}
                                                           className="flex-1"
                                                         />
                                                         {question.correctAnswer === optionIndex && (
                                                           <Badge variant="secondary" className="text-xs">
                                                             Correct
                                                           </Badge>
                                                         )}
                                                       </div>
                                                     ))}
                                                   </div>
                                                 </div>
                                               </AccordionContent>
                                             </AccordionItem>
                                           ))}
                                         </Accordion>
                                         
                                         {(!lesson.quizQuestions || lesson.quizQuestions.length === 0) && (
                                           <div className="text-center py-8 text-muted-foreground">
                                             <HelpCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                             <p>No quiz questions yet. Click "Add Question" to get started.</p>
                                           </div>
                                         )}
                                       </div>
                                     )}

                                     {lesson.type === 'ASSIGNMENT' && (
                                       <div className="space-y-4">
                                         <div className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
                                           <div className="flex items-center gap-2 mb-4">
                                             <ClipboardList className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                             <h4 className="font-semibold text-blue-900 dark:text-blue-100">Assignment Details</h4>
                                           </div>
                                           
                                           <div className="space-y-4">
                                             <div className="space-y-2">
                                               <Label className="text-blue-800 dark:text-blue-200">Assignment Title</Label>
                                               <Input
                                                 value={lesson.assignmentTitle || ''}
                                                 onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'assignmentTitle', e.target.value)}
                                                 placeholder="Enter assignment title"
                                                 className="border-blue-200 focus:border-blue-500"
                                               />
                                             </div>
                                             
                                             <div className="space-y-2">
                                               <Label className="text-blue-800 dark:text-blue-200">Assignment Description</Label>
                                               <Textarea
                                                 value={lesson.assignmentDescription || ''}
                                                 onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'assignmentDescription', e.target.value)}
                                                 placeholder="Describe what students need to do for this assignment"
                                                 rows={3}
                                                 className="border-blue-200 focus:border-blue-500"
                                               />
                                             </div>
                                             
                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                               <div className="space-y-2">
                                                 <Label className="text-blue-800 dark:text-blue-200">Due Date</Label>
                                                 <Input
                                                   type="date"
                                                   value={lesson.assignmentDueDate || ''}
                                                   onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'assignmentDueDate', e.target.value)}
                                                   className="border-blue-200 focus:border-blue-500"
                                                 />
                                               </div>
                                               
                                               <div className="space-y-2">
                                                 <Label className="text-blue-800 dark:text-blue-200">Points</Label>
                                                 <Input
                                                   type="number"
                                                   min="1"
                                                   max="100"
                                                   value={lesson.assignmentPoints || ''}
                                                   onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'assignmentPoints', e.target.value)}
                                                   placeholder="100"
                                                   className="border-blue-200 focus:border-blue-500"
                                                 />
                                               </div>
                                             </div>
                                             
                                             <div className="space-y-2">
                                               <Label className="text-blue-800 dark:text-blue-200">Submission Instructions</Label>
                                               <Textarea
                                                 value={lesson.assignmentInstructions || ''}
                                                 onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'assignmentInstructions', e.target.value)}
                                                 placeholder="Provide clear instructions on how students should submit their work"
                                                 rows={3}
                                                 className="border-blue-200 focus:border-blue-500"
                                               />
                                             </div>
                                             
                                             <div className="space-y-2">
                                               <Label className="text-blue-800 dark:text-blue-200">Grading Criteria</Label>
                                               <Textarea
                                                 value={lesson.assignmentGradingCriteria || ''}
                                                 onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'assignmentGradingCriteria', e.target.value)}
                                                 placeholder="Explain how the assignment will be graded"
                                                 rows={3}
                                                 className="border-blue-200 focus:border-blue-500"
                                               />
                                             </div>
                                           </div>
                                         </div>
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
                                </AccordionContent>
                              </AccordionItem>
                      ))}
                          </Accordion>
                    </div>
                  </div>
                    </AccordionContent>
                  </AccordionItem>
              ))}

              <Button onClick={addSection} variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Section
              </Button>
              </Accordion>
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
                  {courseData.sections.reduce((total, section) => 
                    total + section.lessons.reduce((sectionTotal, lesson) => 
                      sectionTotal + (lesson.duration || 0), 0), 0
                  )}m
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
