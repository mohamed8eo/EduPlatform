"use client"

import { useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, Target, TrendingUp, BookOpen, Award, Activity, Zap, CheckCircle } from "lucide-react"
import { gsap } from "gsap"

export default function CourseAnalyticsPage() {
  const params = useParams()
  const courseId = params.courseId as string
  const pageRef = useRef<HTMLDivElement>(null)

  // Mock analytics data
  const analyticsData = {
    courseName: "Complete Web Development Bootcamp",
    overallProgress: 75,
    timeSpent: "28h 45m",
    totalTime: "40h",
    completedLessons: 34,
    totalLessons: 45,
    averageSessionTime: "45 minutes",
    longestStreak: 7,
    currentStreak: 3,
    lastActive: "2 hours ago",
    weeklyGoal: 5, // hours
    weeklyProgress: 3.5,
    skillsProgress: [
      { skill: "HTML/CSS", progress: 95, level: "Advanced" },
      { skill: "JavaScript", progress: 85, level: "Intermediate" },
      { skill: "React", progress: 60, level: "Beginner" },
      { skill: "Node.js", progress: 30, level: "Beginner" },
      { skill: "Databases", progress: 10, level: "Beginner" },
    ],
    weeklyActivity: [
      { day: "Mon", hours: 1.5 },
      { day: "Tue", hours: 2.0 },
      { day: "Wed", hours: 0 },
      { day: "Thu", hours: 1.2 },
      { day: "Fri", hours: 2.5 },
      { day: "Sat", hours: 0.8 },
      { day: "Sun", hours: 0 },
    ],
    achievements: [
      { name: "First Lesson", description: "Completed your first lesson", earned: true, date: "Nov 15, 2023" },
      { name: "Week Warrior", description: "7-day learning streak", earned: true, date: "Nov 28, 2023" },
      { name: "Speed Learner", description: "Completed 5 lessons in one day", earned: true, date: "Dec 2, 2023" },
      { name: "Halfway Hero", description: "Reached 50% course completion", earned: true, date: "Dec 8, 2023" },
      { name: "Almost There", description: "Reached 75% course completion", earned: true, date: "Dec 15, 2023" },
      { name: "Course Master", description: "Complete the entire course", earned: false, date: null },
    ],
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".analytics-header", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" })

      gsap.fromTo(
        ".analytics-card",
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, delay: 0.3, ease: "power2.out" },
      )

      gsap.fromTo(
        ".skill-item",
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.6, stagger: 0.1, delay: 0.6, ease: "power2.out" },
      )
    })

    return () => ctx.revert()
  }, [])

  const getSkillColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500"
    if (progress >= 60) return "bg-blue-500"
    if (progress >= 40) return "bg-yellow-500"
    return "bg-orange-500"
  }

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case "Advanced":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Intermediate":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      default:
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
    }
  }

  return (
    <div ref={pageRef} className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="analytics-header mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Learning Analytics</h1>
          <p className="text-xl text-muted-foreground">{analyticsData.courseName}</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="analytics-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Overall Progress</p>
                  <p className="text-2xl font-bold">{analyticsData.overallProgress}%</p>
                </div>
                <Target className="h-8 w-8 text-primary" />
              </div>
              <Progress value={analyticsData.overallProgress} className="mt-3" />
            </CardContent>
          </Card>

          <Card className="analytics-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Time Spent</p>
                  <p className="text-2xl font-bold">{analyticsData.timeSpent}</p>
                  <p className="text-xs text-muted-foreground">of {analyticsData.totalTime}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="analytics-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Lessons Completed</p>
                  <p className="text-2xl font-bold">{analyticsData.completedLessons}</p>
                  <p className="text-xs text-muted-foreground">of {analyticsData.totalLessons}</p>
                </div>
                <BookOpen className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="analytics-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Current Streak</p>
                  <p className="text-2xl font-bold">{analyticsData.currentStreak} days</p>
                  <p className="text-xs text-muted-foreground">Best: {analyticsData.longestStreak} days</p>
                </div>
                <Zap className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Weekly Goal */}
          <Card className="analytics-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5" />
                Weekly Goal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">This Week</span>
                  <span className="text-sm text-muted-foreground">
                    {analyticsData.weeklyProgress}h / {analyticsData.weeklyGoal}h
                  </span>
                </div>
                <Progress value={(analyticsData.weeklyProgress / analyticsData.weeklyGoal) * 100} />
                <p className="text-xs text-muted-foreground">
                  {analyticsData.weeklyGoal - analyticsData.weeklyProgress > 0
                    ? `${analyticsData.weeklyGoal - analyticsData.weeklyProgress}h remaining to reach your goal`
                    : "Goal achieved! 🎉"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Activity */}
          <Card className="analytics-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5" />
                Weekly Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between h-32">
                {analyticsData.weeklyActivity.map((day, index) => (
                  <div key={day.day} className="flex flex-col items-center space-y-2">
                    <div
                      className="bg-primary rounded-t w-8 transition-all duration-300 hover:bg-primary/80"
                      style={{ height: `${(day.hours / 3) * 100}%` }}
                    />
                    <span className="text-xs text-muted-foreground">{day.day}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Skills Progress */}
        <Card className="analytics-card mb-12">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Skills Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {analyticsData.skillsProgress.map((skill, index) => (
                <div key={skill.skill} className="skill-item">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium">{skill.skill}</span>
                      <Badge className={getLevelBadgeColor(skill.level)}>{skill.level}</Badge>
                    </div>
                    <span className="text-sm font-semibold">{skill.progress}%</span>
                  </div>
                  <div className="relative">
                    <Progress value={skill.progress} className="h-2" />
                    <div
                      className={`absolute top-0 left-0 h-2 rounded-full ${getSkillColor(skill.progress)} transition-all duration-500`}
                      style={{ width: `${skill.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="analytics-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="mr-2 h-5 w-5" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analyticsData.achievements.map((achievement, index) => (
                <div
                  key={achievement.name}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                    achievement.earned ? "border-primary/20 bg-primary/5" : "border-muted bg-muted/50 opacity-60"
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    {achievement.earned ? (
                      <CheckCircle className="h-6 w-6 text-primary" />
                    ) : (
                      <div className="h-6 w-6 rounded-full border-2 border-muted-foreground" />
                    )}
                    <h3 className="font-semibold">{achievement.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                  {achievement.earned && achievement.date && (
                    <p className="text-xs text-primary font-medium">Earned: {achievement.date}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
