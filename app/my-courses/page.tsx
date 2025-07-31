"use client"

import { useEffect, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MyCourseCard from "@/components/my-course-card"
import { Search, Filter, BookOpen, Clock, Award, TrendingUp } from "lucide-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const myCourses = [
  {
    id: "1",
    title: "Complete Web Development Bootcamp",
    description: "Learn HTML, CSS, JavaScript, React, Node.js, and more in this comprehensive course.",
    image: "/placeholder.svg?height=300&width=400",
    instructor: "John Smith",
    category: "Web Development",
    progress: 75,
    totalLessons: 45,
    completedLessons: 34,
    timeSpent: "28h 45m",
    lastAccessed: "2 hours ago",
    purchaseDate: "Jan 15, 2024",
    nextLesson: "Building REST APIs with Node.js",
  },
  {
    id: "2",
    title: "Data Science with Python",
    description: "Master data analysis, machine learning, and visualization with Python.",
    image: "/placeholder.svg?height=300&width=400",
    instructor: "Sarah Johnson",
    category: "Data Science",
    progress: 45,
    totalLessons: 38,
    completedLessons: 17,
    timeSpent: "15h 20m",
    lastAccessed: "1 day ago",
    purchaseDate: "Dec 20, 2023",
    nextLesson: "Introduction to Machine Learning",
  },
  {
    id: "3",
    title: "UI/UX Design Masterclass",
    description: "Create beautiful and user-friendly designs with modern design principles.",
    image: "/placeholder.svg?height=300&width=400",
    instructor: "Mike Chen",
    category: "Design",
    progress: 100,
    totalLessons: 32,
    completedLessons: 32,
    timeSpent: "22h 10m",
    lastAccessed: "3 days ago",
    purchaseDate: "Nov 8, 2023",
  },
  {
    id: "4",
    title: "Digital Marketing Strategy",
    description: "Learn to create effective digital marketing campaigns and grow your business online.",
    image: "/placeholder.svg?height=300&width=400",
    instructor: "Emily Davis",
    category: "Marketing",
    progress: 20,
    totalLessons: 28,
    completedLessons: 6,
    timeSpent: "4h 30m",
    lastAccessed: "1 week ago",
    purchaseDate: "Feb 1, 2024",
    nextLesson: "Understanding Your Target Audience",
  },
]

export default function MyCoursesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTab, setSelectedTab] = useState("all")
  const [filteredCourses, setFilteredCourses] = useState(myCourses)
  const pageRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const coursesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Page entrance animation
      gsap.fromTo(".page-header", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" })

      // Stats animation
      gsap.fromTo(
        ".stat-card",
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, delay: 0.3, ease: "power2.out" },
      )

      // Courses animation
      gsap.fromTo(
        ".my-course-card",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          delay: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: coursesRef.current,
            start: "top 80%",
            end: "bottom 20%",
          },
        },
      )
    })

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    let filtered = myCourses

    // Filter by tab
    if (selectedTab === "in-progress") {
      filtered = filtered.filter((course) => course.progress > 0 && course.progress < 100)
    } else if (selectedTab === "completed") {
      filtered = filtered.filter((course) => course.progress === 100)
    } else if (selectedTab === "not-started") {
      filtered = filtered.filter((course) => course.progress === 0)
    }

    // Filter by search
    if (searchTerm) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredCourses(filtered)
  }, [searchTerm, selectedTab])

  const stats = {
    totalCourses: myCourses.length,
    completedCourses: myCourses.filter((c) => c.progress === 100).length,
    inProgressCourses: myCourses.filter((c) => c.progress > 0 && c.progress < 100).length,
    totalTimeSpent: myCourses.reduce((total, course) => {
      const [hours, minutes] = course.timeSpent.split("h ")
      return total + Number.parseInt(hours) + Number.parseInt(minutes.replace("m", "")) / 60
    }, 0),
  }

  return (
    <div ref={pageRef} className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="page-header mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">My Courses</h1>
          <p className="text-xl text-muted-foreground">Continue your learning journey</p>
        </div>

        {/* Stats */}
        <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="stat-card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Courses</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.totalCourses}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          <div className="stat-card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Completed</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.completedCourses}</p>
              </div>
              <Award className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </div>

          <div className="stat-card bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">In Progress</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{stats.inProgressCourses}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
          </div>

          <div className="stat-card bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Time Spent</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {Math.round(stats.totalTimeSpent)}h
                </p>
              </div>
              <Clock className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <TabsList className="grid w-full md:w-auto grid-cols-4">
                <TabsTrigger value="all">All Courses</TabsTrigger>
                <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="not-started">Not Started</TabsTrigger>
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
              <div ref={coursesRef} className="space-y-6">
                {filteredCourses.map((course) => (
                  <div key={course.id} className="my-course-card">
                    <MyCourseCard course={course} />
                  </div>
                ))}

                {filteredCourses.length === 0 && (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No courses found</h3>
                    <p className="text-muted-foreground">
                      {searchTerm ? "Try adjusting your search terms" : "No courses match the selected filter"}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
