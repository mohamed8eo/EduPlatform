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
  Unlock,
  HelpCircle,
  ClipboardList,
  BookOpen
} from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { toast } from "sonner"
import ImageUpload from "@/components/image-upload"
import VideoUpload from "@/components/video-upload"
import { getCourse, updateCourse } from '@/lib/action/courses'

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
  duration?: number
  type?: string
  isPreview?: boolean
  videoFile?: any
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
  previewVideoUrl?: string
  thumbnailFile?: any
  previewVideo?: any
  sections: Section[]
}

export default function EditCoursePage() {
  const params = useParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const [expandedLessons, setExpandedLessons] = useState<Record<string, string[]>>({})
  const [courseData, setCourseData] = useState<CourseData>({
    title: '',
    description: '',
    price: 0,
    category: '',
    whatYouWillLearn: [],
    requirements: [],
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
            whatYouWillLearn: course.whatYouWillLearn || [],
            requirements: course.requirements || [],
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
    // Auto-expand the new section
    const newSectionIndex = courseData.sections.length
    setExpandedSections(prev => [...prev, `section-${newSectionIndex}`])
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
                isPreview: false,
                assignmentTitle: '',
                assignmentDescription: '',
                assignmentDueDate: '',
                assignmentPoints: '',
                assignmentInstructions: '',
                assignmentGradingCriteria: ''
              }]
            }
          : section
      )
    }))
    // Auto-expand the new lesson
    const newLessonIndex = courseData.sections[sectionIndex]?.lessons.length || 0
    const lessonId = `lesson-${sectionIndex}-${newLessonIndex}`
    const sectionKey = `section-${sectionIndex}`
    setExpandedLessons(prev => ({
      ...prev,
      [sectionKey]: [...(prev[sectionKey] || []), lessonId]
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

  // Accordion helper functions
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
    const lessonId = `lesson-${sectionIndex}-${lessonIndex}`
    const sectionKey = `section-${sectionIndex}`
    setExpandedLessons(prev => {
      const currentLessons = prev[sectionKey] || []
      const updatedLessons = currentLessons.includes(lessonId)
        ? currentLessons.filter(id => id !== lessonId)
        : [...currentLessons, lessonId]
      return { ...prev, [sectionKey]: updatedLessons }
    })
  }

  const isLessonExpanded = (sectionIndex: number, lessonIndex: number) => {
    const sectionKey = `section-${sectionIndex}`
    const lessonId = `lesson-${sectionIndex}-${lessonIndex}`
    return (expandedLessons[sectionKey] || []).includes(lessonId)
  }

  const expandAllLessonsInSection = (sectionIndex: number) => {
    const section = courseData.sections[sectionIndex]
    if (!section) return
    
    const lessonIds = section.lessons.map((_, lessonIndex) => `lesson-${sectionIndex}-${lessonIndex}`)
    const sectionKey = `section-${sectionIndex}`
    setExpandedLessons(prev => ({ ...prev, [sectionKey]: lessonIds }))
  }

  const collapseAllLessonsInSection = (sectionIndex: number) => {
    const sectionKey = `section-${sectionIndex}`
    setExpandedLessons(prev => ({ ...prev, [sectionKey]: [] }))
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
            videoProvider: lesson.videoFile?.provider || 'cloudinary',
            quizQuestions: lesson.quizQuestions || []
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

        {/* What You'll Learn */}
        <Card className="mb-8">
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
        <Card className="mb-8">
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
                        <Input
                          value={section.description}
                          onChange={(e) => updateSection(sectionIndex, 'description', e.target.value)}
                          placeholder="Brief description of this section"
                        />
                  </div>

                      {/* Lessons Accordion */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Lessons</h4>
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
                        onClick={() => addLesson(sectionIndex)}
                        variant="outline"
                        size="sm"
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
                                           if (!videoData) return
                                           
                                           updateLesson(sectionIndex, lessonIndex, 'videoFile', videoData)
                                           
                                           if (videoData.type === 'url' && videoData.url) {
                                             // Extract YouTube video ID
                                             const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
                                             const match = videoData.url.match(youtubeRegex)
                                             
                                             if (match) {
                                               const videoId = match[1]
                                               try {
                                                 const response = await fetch(`/api/youtube-duration?videoId=${videoId}`)
                                                 if (response.ok) {
                                                   const data = await response.json()
                                                   if (data.duration) {
                                                     console.log('YouTube duration:', data.duration, 'minutes')
                                                     updateLesson(sectionIndex, lessonIndex, 'duration', data.duration)
                                                   }
                                                 } else {
                                                   console.error('Failed to fetch YouTube duration')
                                                   toast.error('Failed to get video duration from YouTube')
                                                 }
                                               } catch (error) {
                                                 console.error('Error fetching YouTube duration:', error)
                                                 toast.error('Error getting video duration')
                                               }
                                             }
                                           } else if (videoData.cloudinaryData?.duration) {
                                             const durationInSeconds = videoData.cloudinaryData.duration
                                             const durationInMinutes = Math.max(1, Math.round(durationInSeconds / 60))
                                             console.log('Setting lesson duration:', durationInMinutes, 'minutes')
                                             updateLesson(sectionIndex, lessonIndex, 'duration', durationInMinutes)
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
                              <input
                                type="checkbox"
                                id={`preview-${sectionIndex}-${lessonIndex}`}
                                checked={lesson.isPreview}
                                onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'isPreview', e.target.checked)}
                                className="rounded"
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
    </div>
  )
}