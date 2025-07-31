"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  CreditCard,
  Wallet,
  BarChart3,
  PieChart,
} from "lucide-react"
import { gsap } from "gsap"

const earningsData = {
  overview: {
    totalEarnings: 125400,
    monthlyEarnings: 26200,
    pendingPayouts: 8500,
    availableBalance: 17700,
    monthlyGrowth: 15.2,
    yearlyGrowth: 42.8,
  },
  monthlyBreakdown: [
    { month: "Jan", earnings: 8500, students: 120, courses: 3 },
    { month: "Feb", earnings: 9200, students: 150, courses: 4 },
    { month: "Mar", earnings: 10800, students: 180, courses: 5 },
    { month: "Apr", earnings: 12400, students: 200, courses: 6 },
    { month: "May", earnings: 14200, students: 250, courses: 7 },
    { month: "Jun", earnings: 15800, students: 280, courses: 8 },
    { month: "Jul", earnings: 17500, students: 320, courses: 9 },
    { month: "Aug", earnings: 19200, students: 350, courses: 10 },
    { month: "Sep", earnings: 21000, students: 380, courses: 11 },
    { month: "Oct", earnings: 22800, students: 420, courses: 12 },
    { month: "Nov", earnings: 24500, students: 450, courses: 12 },
    { month: "Dec", earnings: 26200, students: 480, courses: 12 },
  ],
  courseEarnings: [
    {
      title: "Complete Web Development Bootcamp",
      earnings: 45200,
      students: 15420,
      percentage: 36,
      growth: 12.5,
    },
    {
      title: "Data Science with Python",
      earnings: 38900,
      students: 12350,
      percentage: 31,
      growth: 18.3,
    },
    {
      title: "UI/UX Design Masterclass",
      earnings: 22400,
      students: 8900,
      percentage: 18,
      growth: -2.1,
    },
    {
      title: "Digital Marketing Strategy",
      earnings: 18900,
      students: 7650,
      percentage: 15,
      growth: 5.8,
    },
  ],
  payoutHistory: [
    {
      date: "2023-12-01",
      amount: 15600,
      status: "completed",
      method: "Bank Transfer",
      transactionId: "TXN-2023-001",
    },
    {
      date: "2023-11-01",
      amount: 14200,
      status: "completed",
      method: "PayPal",
      transactionId: "TXN-2023-002",
    },
    {
      date: "2023-10-01",
      amount: 12800,
      status: "completed",
      method: "Bank Transfer",
      transactionId: "TXN-2023-003",
    },
    {
      date: "2023-09-01",
      amount: 11400,
      status: "completed",
      method: "PayPal",
      transactionId: "TXN-2023-004",
    },
  ],
}

export default function EarningsPage() {
  const pageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".earnings-header", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" })

      gsap.fromTo(
        ".earnings-card",
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <div ref={pageRef} className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="earnings-header flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Earnings Dashboard</h1>
            <p className="text-xl text-muted-foreground">Track your revenue and manage payouts</p>
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
            <Button>
              <Wallet className="mr-2 h-4 w-4" />
              Request Payout
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="earnings-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
                  <p className="text-2xl font-bold">${earningsData.overview.totalEarnings.toLocaleString()}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-xs text-green-600">+{earningsData.overview.yearlyGrowth}% this year</span>
                  </div>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="earnings-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">${earningsData.overview.monthlyEarnings.toLocaleString()}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-xs text-green-600">+{earningsData.overview.monthlyGrowth}%</span>
                  </div>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="earnings-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Available Balance</p>
                  <p className="text-2xl font-bold">${earningsData.overview.availableBalance.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Ready for payout</p>
                </div>
                <Wallet className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="earnings-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Payouts</p>
                  <p className="text-2xl font-bold">${earningsData.overview.pendingPayouts.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Processing</p>
                </div>
                <CreditCard className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">By Course</TabsTrigger>
            <TabsTrigger value="payouts">Payout History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Monthly Earnings Chart */}
            <Card className="chart-section">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Monthly Earnings Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between h-64">
                  {earningsData.monthlyBreakdown.map((month, index) => (
                    <div key={index} className="flex flex-col items-center space-y-2">
                      <div
                        className="bg-green-500 rounded-t w-8 transition-all duration-300 hover:bg-green-600"
                        style={{ height: `${(month.earnings / 30000) * 100}%` }}
                      />
                      <span className="text-xs text-muted-foreground">{month.month}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="space-y-8">
            <Card className="chart-section">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="mr-2 h-5 w-5" />
                  Earnings by Course
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {earningsData.courseEarnings.map((course, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{course.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>{course.students.toLocaleString()} students</span>
                            <span>${course.earnings.toLocaleString()} earned</span>
                            <span>{course.percentage}% of total</span>
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
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${course.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payouts" className="space-y-8">
            <Card className="chart-section">
              <CardHeader>
                <CardTitle>Payout History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {earningsData.payoutHistory.map((payout, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <CreditCard className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">${payout.amount.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">{payout.method}</p>
                          <p className="text-xs text-muted-foreground">ID: {payout.transactionId}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(payout.status)}>{payout.status}</Badge>
                        <p className="text-sm text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {payout.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
