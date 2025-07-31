"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Search, Filter, Users, Mail, MessageSquare, Award, Clock, TrendingUp, MoreVertical } from "lucide-react"
import { gsap } from "gsap"

const studentsData = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    avatar: "/placeholder.svg?height=40&width=40",
    enrolledCourses: 3,
    completedCourses: 2,
    totalProgress: 78,
    joinDate: "2023-09-15",
    lastActive: "2 hours ago",
    totalSpent: 267,
    currentCourse: "Data Science with Python",
    courseProgress: 65,
    status: "active",
  },
  {
    id: "2",
    name: "Mike Chen",
    email: "mike.chen@email.com",
    avatar: "/placeholder.svg?height=40&width=40",
    enrolledCourses: 2,
    completedCourses: 1,
    totalProgress: 45,
    joinDate: "2023-10-20",
    lastActive: "1 day ago",
    totalSpent: 168,
    currentCourse: "Web Development Bootcamp",
    courseProgress: 32,
    status: "active",
  },
  {
    id: "3",
    name: "Emily Davis",
    email: "emily.davis@email.com",
    avatar: "/placeholder.svg?height=40&width=40",
    enrolledCourses: 4,
    completedCourses: 3,
    totalProgress: 92,
    joinDate: "2023-08-10",
    lastActive: "3 hours ago",
    totalSpent: 356,
    currentCourse: "Advanced React Patterns",
    courseProgress: 88,
    status: "active",
  },
  {
    id: "4",
    name: "David Wilson",
    email: "david.wilson@email.com",
    avatar: "/placeholder.svg?height=40&width=40",
    enrolledCourses: 1,
    completedCourses: 0,
    totalProgress: 15,
    joinDate: "2023-11-05",
    lastActive: "1 week ago",
    totalSpent: 89,
    currentCourse: "UI/UX Design Masterclass",
    courseProgress: 15,
    status: "inactive",
  },
  {
    id: "5",
    name: "Lisa Brown",
    email: "lisa.brown@email.com",
    avatar: "/placeholder.svg?height=40&width=40",
    enrolledCourses: 2,
    completedCourses: 2,
    totalProgress: 100,
    joinDate: "2023-07-22",
    lastActive: "5 days ago",
    totalSpent: 158,
    currentCourse: "Completed all courses",
    courseProgress: 100,
    status: "completed",
  },
]

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTab, setSelectedTab] = useState("all")
  const [filteredStudents, setFilteredStudents] = useState(studentsData)
  const pageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".students-header", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" })

      gsap.fromTo(
        ".student-card",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, delay: 0.3, ease: "power2.out" },
      )
    })

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    let filtered = studentsData

    // Filter by tab
    if (selectedTab !== "all") {
      filtered = filtered.filter((student) => student.status === selectedTab)
    }

    // Filter by search
    if (searchTerm) {
      filtered = filtered.filter(
        (student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredStudents(filtered)
  }, [searchTerm, selectedTab])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "inactive":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const stats = {
    total: studentsData.length,
    active: studentsData.filter((s) => s.status === "active").length,
    inactive: studentsData.filter((s) => s.status === "inactive").length,
    completed: studentsData.filter((s) => s.status === "completed").length,
    totalRevenue: studentsData.reduce((sum, student) => sum + student.totalSpent, 0),
  }

  return (
    <div ref={pageRef} className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="students-header mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Student Management</h1>
          <p className="text-xl text-muted-foreground">Monitor and engage with your students</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Students</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{stats.active}</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{stats.inactive}</p>
              <p className="text-sm text-muted-foreground">Inactive</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Award className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{stats.completed}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-2xl font-bold">${stats.totalRevenue}</p>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <TabsList className="grid w-full md:w-auto grid-cols-4">
                <TabsTrigger value="all">All Students</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="inactive">Inactive</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>

              <div className="flex gap-4">
                <div className="relative flex-1 md:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search students..."
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
              <div className="space-y-4">
                {filteredStudents.map((student) => (
                  <Card key={student.id} className="student-card hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.name} />
                            <AvatarFallback>
                              {student.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold">{student.name}</h3>
                              <Badge className={getStatusColor(student.status)}>{student.status}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{student.email}</p>
                            <p className="text-xs text-muted-foreground">
                              Joined {student.joinDate} • Last active {student.lastActive}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-8">
                          <div className="text-center">
                            <p className="text-sm font-medium">{student.enrolledCourses}</p>
                            <p className="text-xs text-muted-foreground">Enrolled</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium">{student.completedCourses}</p>
                            <p className="text-xs text-muted-foreground">Completed</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium">${student.totalSpent}</p>
                            <p className="text-xs text-muted-foreground">Spent</p>
                          </div>
                          <div className="w-32">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span>Progress</span>
                              <span>{student.totalProgress}%</span>
                            </div>
                            <Progress value={student.totalProgress} className="h-2" />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Mail className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {student.currentCourse !== "Completed all courses" && (
                        <div className="mt-4 pt-4 border-t">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium">Current Course: {student.currentCourse}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Progress value={student.courseProgress} className="w-32 h-2" />
                                <span className="text-xs text-muted-foreground">{student.courseProgress}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredStudents.length === 0 && (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No students found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm ? "Try adjusting your search terms" : "No students match the selected filter"}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
