"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Search, Filter, Plus, Edit, Eye, Trash2, Users, DollarSign, Star, Clock, MoreVertical } from "lucide-react"
import { gsap } from "gsap"
import { getCourses } from "@/lib/action/courses"
import { toast } from "sonner"

interface Course {
  id: string
  title: string
  description: string
  thumbnail?: string
  status: string
  price: number
  level: string
  language: string
  createdAt: string
  updatedAt: string
  studentsCount: number
  rating: number
  reviewsCount: number
  totalDuration: number
  totalLessons: number
  category: {
    name: string
  }
  sections: {
    id: string
    title: string
    lessons: {
      id: string
      title: string
      duration: number
    }[]
  }[]
}

export default function CoursesManagementPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTab, setSelectedTab] = useState("all")
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const pageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const result = await getCourses()
        if (result.success) {
          // Ensure thumbnail is undefined instead of null for type compatibility
          const normalizedCourses = (result.courses || []).map((course: any) => ({
            ...course,
            thumbnail: course.thumbnail === null ? undefined : course.thumbnail,
          }))
          setCourses(normalizedCourses)
        } else {
          toast.error("Failed to fetch courses")
        }
        console.error('Error fetching courses:')
        toast.error("Error loading courses")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourses()
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".courses-header", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" })

      gsap.fromTo(
        ".course-card",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, delay: 0.3, ease: "power2.out" },
      )
    })

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    let filtered = courses

    // Filter by tab
    if (selectedTab !== "all") {
      filtered = filtered.filter((course) => course.status.toLowerCase() === selectedTab)
    }

    // Filter by search
    if (searchTerm) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.category?.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredCourses(filtered)
  }, [searchTerm, selectedTab, courses])

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
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return "1 day ago"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return `${Math.floor(diffDays / 30)} months ago`
  }

  const stats = {
    total: courses.length,
    published: courses.filter((c) => c.status.toLowerCase() === "published").length,
    draft: courses.filter((c) => c.status.toLowerCase() === "draft").length,
    archived: courses.filter((c) => c.status.toLowerCase() === "archived").length,
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading courses...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div ref={pageRef} className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="courses-header flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Course Management</h1>
            <p className="text-xl text-muted-foreground">Create, edit, and manage your courses</p>
          </div>
          <Link href="/dashboard/courses/create">
            <Button size="lg">
              <Plus className="mr-2 h-4 w-4" />
              Create New Course
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Courses</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-2xl font-bold text-green-600">{stats.published}</p>
              <p className="text-sm text-muted-foreground">Published</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-2xl font-bold text-yellow-600">{stats.draft}</p>
              <p className="text-sm text-muted-foreground">Drafts</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-2xl font-bold text-gray-600">{stats.archived}</p>
              <p className="text-sm text-muted-foreground">Archived</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <TabsList className="grid w-full md:w-auto grid-cols-4">
                <TabsTrigger value="all">All Courses</TabsTrigger>
                <TabsTrigger value="published">Published</TabsTrigger>
                <TabsTrigger value="draft">Drafts</TabsTrigger>
                <TabsTrigger value="archived">Archived</TabsTrigger>
              </TabsList>

              <div className="flex gap-4">
                <div className="relative flex-1 md:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
            </div>

            <TabsContent value={selectedTab} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <Card key={course.id} className="course-card hover:shadow-lg transition-all duration-300">
                    <div className="relative">
                      <Image
                        src={course.thumbnail || "/placeholder.svg"}
                        alt={course.title}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover rounded-t-lg"
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
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{course.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                          <Badge variant="outline" className="mt-2 text-xs">
                            {course.category?.name || 'Uncategorized'}
                          </Badge>
                        </div>

                        {course.status.toLowerCase() !== "draft" && (
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span>{course.studentsCount.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <span>${course.price}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                              <span>{course.rating || 0}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{formatDuration(course.totalDuration)}</span>
                            </div>
                          </div>
                        )}

                        <div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                            <span>Course Progress</span>
                            <span>{course.totalLessons} lessons</span>
                          </div>
                          <Progress value={(course.totalLessons / Math.max(course.totalLessons, 1)) * 100} className="h-2" />
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                          <span className="text-xs text-muted-foreground">Updated {formatDate(course.updatedAt)}</span>
                          <div className="flex space-x-2">
                            <Link href={`/dashboard/courses/edit/${course.id}`}>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/dashboard/courses/${course.id}`}>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive hover:text-destructive bg-transparent"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredCourses.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-muted-foreground mb-4">
                    <Plus className="h-12 w-12 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No courses found</h3>
                    <p>
                      {searchTerm
                        ? "Try adjusting your search terms"
                        : selectedTab === "all"
                          ? "Create your first course to get started"
                          : `No ${selectedTab} courses found`}
                    </p>
                  </div>
                  {!searchTerm && selectedTab === "all" && (
                    <Link href="/dashboard/courses/create">
                      <Button>Create Your First Course</Button>
                    </Link>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
