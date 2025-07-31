"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BarChart3,
  BookOpen,
  Users,
  DollarSign,
  TrendingUp,
  Star,
  MessageSquare,
  Plus,
  Eye,
  Edit,
  Award,
} from "lucide-react"
import { gsap } from "gsap"

const dashboardData = {
  overview: {
    totalCourses: 12,
    totalStudents: 45280,
    totalRevenue: 125400,
    averageRating: 4.7,
    monthlyGrowth: 15.2,
    activeStudents: 8940,
    completionRate: 78,
    totalReviews: 3240,
  },
  recentCourses: [
    {
      id: "1",
      title: "Complete Web Development Bootcamp",
      students: 15420,
      revenue: 45200,
      rating: 4.8,
      status: "published",
      lastUpdated: "2 days ago",
      progress: 95,
    },
    {
      id: "2",
      title: "Data Science with Python",
      students: 12350,
      revenue: 38900,
      rating: 4.9,
      status: "published",
      lastUpdated: "1 week ago",
      progress: 100,
    },
    {
      id: "3",
      title: "Advanced React Patterns",
      students: 2340,
      revenue: 12800,
      rating: 4.9,
      status: "draft",
      lastUpdated: "3 days ago",
      progress: 60,
    },
  ],
  recentActivity: [
    {
      type: "enrollment",
      message: "Sarah Johnson enrolled in Web Development Bootcamp",
      time: "2 hours ago",
      icon: Users,
    },
    {
      type: "review",
      message: "New 5-star review for Data Science with Python",
      time: "4 hours ago",
      icon: Star,
    },
    {
      type: "completion",
      message: "Mike Chen completed UI/UX Design Masterclass",
      time: "6 hours ago",
      icon: Award,
    },
    {
      type: "question",
      message: "New question posted in React course discussion",
      time: "8 hours ago",
      icon: MessageSquare,
    },
  ],
  monthlyStats: {
    enrollments: [120, 150, 180, 200, 250, 280, 320, 350, 380, 420, 450, 480],
    revenue: [8500, 9200, 10800, 12400, 14200, 15800, 17500, 19200, 21000, 22800, 24500, 26200],
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  },
}

export default function DashboardPage() {
  const pageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".dashboard-header", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" })

      gsap.fromTo(
        ".stat-card",
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, delay: 0.3, ease: "power2.out" },
      )

      gsap.fromTo(
        ".dashboard-section",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, delay: 0.6, ease: "power2.out" },
      )
    })

    return () => ctx.revert()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
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

  return (
    <div ref={pageRef} className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="dashboard-header flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Creator Dashboard</h1>
            <p className="text-xl text-muted-foreground">Manage your courses and track your success</p>
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/dashboard/courses/create">
              <Button size="lg">
                <Plus className="mr-2 h-4 w-4" />
                Create Course
              </Button>
            </Link>
            <Link href="/dashboard/analytics">
              <Button variant="outline" size="lg">
                <BarChart3 className="mr-2 h-4 w-4" />
                Analytics
              </Button>
            </Link>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="stat-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">${dashboardData.overview.totalRevenue.toLocaleString()}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />+{dashboardData.overview.monthlyGrowth}% this month
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                  <p className="text-2xl font-bold">{dashboardData.overview.totalStudents.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">
                    {dashboardData.overview.activeStudents.toLocaleString()} active
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Courses</p>
                  <p className="text-2xl font-bold">{dashboardData.overview.totalCourses}</p>
                  <p className="text-xs text-muted-foreground">
                    {dashboardData.overview.completionRate}% completion rate
                  </p>
                </div>
                <BookOpen className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
                  <p className="text-2xl font-bold">{dashboardData.overview.averageRating}</p>
                  <p className="text-xs text-muted-foreground">{dashboardData.overview.totalReviews} reviews</p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Recent Courses */}
          <div className="lg:col-span-2">
            <Card className="dashboard-section">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Courses</CardTitle>
                <Link href="/dashboard/courses">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.recentCourses.map((course) => (
                    <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold">{course.title}</h3>
                          <Badge className={getStatusColor(course.status)}>{course.status}</Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{course.students.toLocaleString()} students</span>
                          <span>${course.revenue.toLocaleString()} revenue</span>
                          <div className="flex items-center">
                            <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                            {course.rating}
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                            <span>Course Progress</span>
                            <span>{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-1" />
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Link href={`/dashboard/courses/${course.id}`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/courses/${course.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card className="dashboard-section">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.recentActivity.map((activity, index) => {
                    const IconComponent = activity.icon
                    return (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <IconComponent className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">{activity.message}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-section mb-12">
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/dashboard/courses/create">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Plus className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Create Course</h3>
                  <p className="text-sm text-muted-foreground">Start building a new course</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/students">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Manage Students</h3>
                  <p className="text-sm text-muted-foreground">View and manage enrollments</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/reviews">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <MessageSquare className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Reviews & Feedback</h3>
                  <p className="text-sm text-muted-foreground">Respond to student reviews</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/earnings">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <DollarSign className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Earnings Report</h3>
                  <p className="text-sm text-muted-foreground">Track your revenue</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Performance Chart */}
        <Card className="dashboard-section">
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Enrollments Chart */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Monthly Enrollments</h3>
                <div className="flex items-end justify-between h-40">
                  {dashboardData.monthlyStats.enrollments.map((value, index) => (
                    <div key={index} className="flex flex-col items-center space-y-2">
                      <div
                        className="bg-blue-500 rounded-t w-6 transition-all duration-300 hover:bg-blue-600"
                        style={{ height: `${(value / 500) * 100}%` }}
                      />
                      <span className="text-xs text-muted-foreground">{dashboardData.monthlyStats.months[index]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Revenue Chart */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Monthly Revenue</h3>
                <div className="flex items-end justify-between h-40">
                  {dashboardData.monthlyStats.revenue.map((value, index) => (
                    <div key={index} className="flex flex-col items-center space-y-2">
                      <div
                        className="bg-green-500 rounded-t w-6 transition-all duration-300 hover:bg-green-600"
                        style={{ height: `${(value / 30000) * 100}%` }}
                      />
                      <span className="text-xs text-muted-foreground">{dashboardData.monthlyStats.months[index]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
