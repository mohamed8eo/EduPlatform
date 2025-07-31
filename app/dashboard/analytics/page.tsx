"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, TrendingUp, TrendingDown, Users, DollarSign, Star, Globe, Target, Award, Eye } from "lucide-react"
import { gsap } from "gsap"

const analyticsData = {
  overview: {
    totalRevenue: 125400,
    revenueGrowth: 15.2,
    totalStudents: 45280,
    studentGrowth: 8.7,
    totalCourses: 12,
    averageRating: 4.7,
    completionRate: 78,
    refundRate: 2.3,
  },
  monthlyData: {
    revenue: [8500, 9200, 10800, 12400, 14200, 15800, 17500, 19200, 21000, 22800, 24500, 26200],
    enrollments: [120, 150, 180, 200, 250, 280, 320, 350, 380, 420, 450, 480],
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  },
  topCourses: [
    {
      title: "Complete Web Development Bootcamp",
      students: 15420,
      revenue: 45200,
      rating: 4.8,
      completion: 82,
      growth: 12.5,
    },
    {
      title: "Data Science with Python",
      students: 12350,
      revenue: 38900,
      rating: 4.9,
      completion: 79,
      growth: 18.3,
    },
    {
      title: "UI/UX Design Masterclass",
      students: 8900,
      revenue: 22400,
      rating: 4.7,
      completion: 75,
      growth: -2.1,
    },
    {
      title: "Digital Marketing Strategy",
      students: 7650,
      revenue: 18900,
      rating: 4.6,
      completion: 71,
      growth: 5.8,
    },
  ],
  demographics: {
    countries: [
      { name: "United States", percentage: 35, students: 15848 },
      { name: "United Kingdom", percentage: 18, students: 8150 },
      { name: "Canada", percentage: 12, students: 5434 },
      { name: "Australia", percentage: 8, students: 3622 },
      { name: "Germany", percentage: 7, students: 3170 },
      { name: "Others", percentage: 20, students: 9056 },
    ],
    ageGroups: [
      { range: "18-24", percentage: 25 },
      { range: "25-34", percentage: 40 },
      { range: "35-44", percentage: 20 },
      { range: "45-54", percentage: 10 },
      { range: "55+", percentage: 5 },
    ],
  },
  engagement: {
    averageWatchTime: "68%",
    discussionPosts: 2340,
    questionsAnswered: 1890,
    certificatesIssued: 3420,
    averageRating: 4.7,
    reviewsCount: 5680,
  },
}

export default function AnalyticsPage() {
  const pageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".analytics-header", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" })

      gsap.fromTo(
        ".analytics-card",
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, delay: 0.3, ease: "power2.out" },
      )

      gsap.fromTo(
        ".chart-section",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, delay: 0.6, ease: "power2.out" },
      )
    })

    return () => ctx.revert()
  }, [])

  return (
    <div ref={pageRef} className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="analytics-header mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Analytics Dashboard</h1>
          <p className="text-xl text-muted-foreground">Comprehensive insights into your course performance</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="analytics-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">${analyticsData.overview.totalRevenue.toLocaleString()}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-xs text-green-600">+{analyticsData.overview.revenueGrowth}%</span>
                  </div>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="analytics-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                  <p className="text-2xl font-bold">{analyticsData.overview.totalStudents.toLocaleString()}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-xs text-green-600">+{analyticsData.overview.studentGrowth}%</span>
                  </div>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="analytics-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                  <p className="text-2xl font-bold">{analyticsData.overview.completionRate}%</p>
                  <p className="text-xs text-muted-foreground">Industry avg: 65%</p>
                </div>
                <Target className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="analytics-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
                  <p className="text-2xl font-bold">{analyticsData.overview.averageRating}</p>
                  <div className="flex items-center mt-1">
                    <Star className="h-3 w-3 text-yellow-500 mr-1 fill-yellow-500" />
                    <span className="text-xs text-muted-foreground">Excellent</span>
                  </div>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="performance" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="courses">Top Courses</TabsTrigger>
            <TabsTrigger value="demographics">Demographics</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-8">
            {/* Revenue & Enrollment Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="chart-section">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Monthly Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between h-64">
                    {analyticsData.monthlyData.revenue.map((value, index) => (
                      <div key={index} className="flex flex-col items-center space-y-2">
                        <div
                          className="bg-green-500 rounded-t w-8 transition-all duration-300 hover:bg-green-600"
                          style={{ height: `${(value / 30000) * 100}%` }}
                        />
                        <span className="text-xs text-muted-foreground">{analyticsData.monthlyData.months[index]}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="chart-section">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    Monthly Enrollments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between h-64">
                    {analyticsData.monthlyData.enrollments.map((value, index) => (
                      <div key={index} className="flex flex-col items-center space-y-2">
                        <div
                          className="bg-blue-500 rounded-t w-8 transition-all duration-300 hover:bg-blue-600"
                          style={{ height: `${(value / 500) * 100}%` }}
                        />
                        <span className="text-xs text-muted-foreground">{analyticsData.monthlyData.months[index]}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="courses" className="space-y-8">
            <Card className="chart-section">
              <CardHeader>
                <CardTitle>Top Performing Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {analyticsData.topCourses.map((course, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{course.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>{course.students.toLocaleString()} students</span>
                            <span>${course.revenue.toLocaleString()} revenue</span>
                            <div className="flex items-center">
                              <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                              {course.rating}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {course.growth > 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-500" />
                          )}
                          <span
                            className={`text-sm font-medium ${course.growth > 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            {course.growth > 0 ? "+" : ""}
                            {course.growth}%
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span>Completion Rate</span>
                          <span>{course.completion}%</span>
                        </div>
                        <Progress value={course.completion} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="demographics" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="chart-section">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="mr-2 h-5 w-5" />
                    Students by Country
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.demographics.countries.map((country, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{country.name}</span>
                          <span className="text-muted-foreground">
                            {country.students.toLocaleString()} ({country.percentage}%)
                          </span>
                        </div>
                        <Progress value={country.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="chart-section">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    Age Demographics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.demographics.ageGroups.map((group, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{group.range} years</span>
                          <span className="text-muted-foreground">{group.percentage}%</span>
                        </div>
                        <Progress value={group.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="engagement" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="chart-section">
                <CardContent className="p-6 text-center">
                  <Eye className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{analyticsData.engagement.averageWatchTime}</p>
                  <p className="text-sm text-muted-foreground">Average Watch Time</p>
                </CardContent>
              </Card>

              <Card className="chart-section">
                <CardContent className="p-6 text-center">
                  <Award className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{analyticsData.engagement.certificatesIssued.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Certificates Issued</p>
                </CardContent>
              </Card>

              <Card className="chart-section">
                <CardContent className="p-6 text-center">
                  <Star className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{analyticsData.engagement.reviewsCount.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Reviews</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
