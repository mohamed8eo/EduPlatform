"use client"

import { useEffect, useRef, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import CourseProgressBar from "@/components/course-progress-bar"
import CourseReviews from "@/components/course-reviews"
import {
  Clock,
  Users,
  Star,
  Play,
  CheckCircle,
  Download,
  Share2,
  Bookmark,
  BookmarkCheck,
  Award,
  BarChart3,
  Globe,
  Shield,
  Smartphone,
} from "lucide-react"
import { gsap } from "gsap"
import { useLanguage } from "@/contexts/language-context"

const courseData = {
  "1": {
    id: "1",
    title: "Complete Web Development Bootcamp",
    description:
      "Learn HTML, CSS, JavaScript, React, Node.js, and more in this comprehensive course that will take you from beginner to professional web developer.",
    longDescription:
      "This comprehensive bootcamp covers everything you need to know to become a full-stack web developer. Starting with the fundamentals of HTML and CSS, you'll progress through JavaScript, React, Node.js, databases, and deployment strategies. By the end of this course, you'll have built multiple real-world projects and have the skills to land your first developer job.",
    image: "/placeholder.svg?height=400&width=600",
    instructor: {
      name: "John Smith",
      bio: "Senior Full Stack Developer with 10+ years of experience at top tech companies including Google and Facebook. John has taught over 100,000 students worldwide.",
      avatar: "/placeholder.svg?height=100&width=100",
      rating: 4.9,
      students: 25000,
      courses: 8,
    },
    duration: "40 hours",
    students: 15420,
    rating: 4.8,
    reviews: 3240,
    price: 89,
    originalPrice: 129,
    tags: ["Web Development", "JavaScript", "React", "Node.js"],
    level: "Beginner to Advanced",
    language: "English",
    lastUpdated: "December 2023",
    certificate: true,
    downloadable: true,
    mobileAccess: true,
    lifetimeAccess: true,
    progress: 75,
    totalLessons: 45,
    completedLessons: 34,
    timeSpent: "28h 45m",
    lastAccessed: "2 hours ago",
    isBookmarked: false,
    isEnrolled: true,
    syllabus: [
      {
        id: 1,
        title: "HTML & CSS Fundamentals",
        duration: "8 hours",
        lessons: 12,
        completed: true,
        description: "Learn the building blocks of web development",
      },
      {
        id: 2,
        title: "JavaScript Essentials",
        duration: "10 hours",
        lessons: 15,
        completed: true,
        description: "Master JavaScript programming concepts",
      },
      {
        id: 3,
        title: "React.js Development",
        duration: "12 hours",
        lessons: 18,
        completed: false,
        description: "Build modern user interfaces with React",
        currentLesson: "React Hooks and State Management",
      },
      {
        id: 4,
        title: "Node.js & Express",
        duration: "8 hours",
        lessons: 12,
        completed: false,
        description: "Server-side development with Node.js",
      },
      {
        id: 5,
        title: "Database Integration",
        duration: "6 hours",
        lessons: 8,
        completed: false,
        description: "Working with databases and APIs",
      },
    ],
    features: [
      "40 hours of on-demand video",
      "15 coding exercises",
      "10 real-world projects",
      "Certificate of completion",
      "Lifetime access",
      "Mobile and desktop access",
      "30-day money-back guarantee",
    ],
    requirements: [
      "Basic computer skills",
      "No prior programming experience required",
      "A computer with internet connection",
    ],
    whatYouWillLearn: [
      "Build responsive websites with HTML, CSS, and JavaScript",
      "Create modern web applications with React.js",
      "Develop server-side applications with Node.js",
      "Work with databases and APIs",
      "Deploy applications to the cloud",
      "Follow industry best practices and coding standards",
    ],
  },
  "2": {
    id: "2",
    title: "Data Science with Python",
    description: "Master data analysis, machine learning, and visualization with Python.",
    longDescription:
      "Dive deep into the world of data science with this comprehensive Python course. Learn to analyze data, create visualizations, build machine learning models, and extract insights from complex datasets.",
    image: "/placeholder.svg?height=400&width=600",
    instructor: {
      name: "Sarah Johnson",
      bio: "Lead Data Scientist at Microsoft with PhD in Computer Science. Expert in machine learning and data analysis with 8+ years of industry experience.",
      avatar: "/placeholder.svg?height=100&width=100",
      rating: 4.8,
      students: 18500,
      courses: 6,
    },
    duration: "35 hours",
    students: 12350,
    rating: 4.9,
    reviews: 2180,
    price: 99,
    originalPrice: 149,
    tags: ["Data Science", "Python", "Machine Learning", "Analytics"],
    level: "Intermediate",
    language: "English",
    lastUpdated: "November 2023",
    certificate: true,
    downloadable: true,
    mobileAccess: true,
    lifetimeAccess: true,
    progress: 45,
    totalLessons: 38,
    completedLessons: 17,
    timeSpent: "15h 20m",
    lastAccessed: "1 day ago",
    isBookmarked: true,
    isEnrolled: true,
    syllabus: [
      {
        id: 1,
        title: "Python for Data Science",
        duration: "8 hours",
        lessons: 10,
        completed: true,
        description: "Python fundamentals for data analysis",
      },
      {
        id: 2,
        title: "Data Analysis with Pandas",
        duration: "10 hours",
        lessons: 12,
        completed: true,
        description: "Data manipulation and analysis",
      },
      {
        id: 3,
        title: "Data Visualization",
        duration: "8 hours",
        lessons: 10,
        completed: false,
        description: "Creating charts and graphs",
        currentLesson: "Advanced Matplotlib Techniques",
      },
      {
        id: 4,
        title: "Machine Learning Basics",
        duration: "12 hours",
        lessons: 15,
        completed: false,
        description: "Introduction to ML algorithms",
      },
    ],
    features: [
      "35 hours of video content",
      "20 hands-on projects",
      "Real datasets to work with",
      "Certificate of completion",
      "Lifetime access",
      "Mobile and desktop access",
    ],
    requirements: ["Basic Python knowledge helpful", "High school level mathematics", "Computer with Python installed"],
    whatYouWillLearn: [
      "Analyze data with Python and Pandas",
      "Create stunning visualizations",
      "Build machine learning models",
      "Work with real-world datasets",
      "Statistical analysis techniques",
    ],
  },
}

export default function CourseDetailPage() {
  const params = useParams()
  const courseId = params.courseId as string
  const course = courseData[courseId as keyof typeof courseData]
  const [isBookmarked, setIsBookmarked] = useState(course?.isBookmarked || false)
  const heroRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const { t, isRTL } = useLanguage()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".course-hero", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" })

      gsap.fromTo(
        ".course-content",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: "power2.out" },
      )

      gsap.fromTo(
        ".syllabus-item",
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.6, stagger: 0.1, delay: 0.4, ease: "power2.out" },
      )
    })

    return () => ctx.revert()
  }, [])

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    // Here you would typically save to backend
  }

  if (!course) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
          <p className="text-muted-foreground mb-6">The course you're looking for doesn't exist.</p>
          <Link href="/courses">
            <Button>Browse All Courses</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section ref={heroRef} className="course-hero bg-gradient-to-br from-primary/10 to-secondary/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap gap-2 mb-4">
                {course.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">{course.title}</h1>
              <p className="text-lg text-muted-foreground mb-6">{course.longDescription}</p>

              <div className={`flex items-center space-x-6 mb-8 text-sm ${isRTL ? "space-x-reverse" : ""}`}>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-2 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{course.rating}</span>
                  <span className="text-muted-foreground ml-1">
                    ({course.reviews} {t("course.reviews")})
                  </span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  <span>
                    {course.students.toLocaleString()} {t("course.students")}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-2" />
                  <span>{course.language}</span>
                </div>
              </div>

              <div className={`flex items-center space-x-4 mb-6 ${isRTL ? "space-x-reverse" : ""}`}>
                <Image
                  src={course.instructor.avatar || "/placeholder.svg"}
                  alt={course.instructor.name}
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <div>
                  <p className="font-semibold">{course.instructor.name}</p>
                  <p className="text-sm text-muted-foreground">{t("course.instructor")}</p>
                </div>
              </div>

              {course.isEnrolled && (
                <div className="mb-6">
                  <CourseProgressBar
                    progress={course.progress}
                    totalLessons={course.totalLessons}
                    completedLessons={course.completedLessons}
                    timeSpent={course.timeSpent}
                    lastAccessed={course.lastAccessed}
                  />
                </div>
              )}
            </div>

            {/* Course Preview Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <div className="relative">
                  <Image
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    width={400}
                    height={225}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Button
                    size="lg"
                    className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-white/90 hover:bg-white text-primary hover:text-primary"
                  >
                    <Play className="h-6 w-6 ml-1" />
                  </Button>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-3xl font-bold">${course.price}</span>
                      {course.originalPrice && (
                        <span className="text-lg text-muted-foreground line-through ml-2">${course.originalPrice}</span>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleBookmark}
                      className="text-muted-foreground hover:text-primary"
                    >
                      {isBookmarked ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
                    </Button>
                  </div>

                  <div className="space-y-3 mb-6">
                    {course.isEnrolled ? (
                      <div className="space-y-2">
                        <Link href={`/courses/${course.id}/learn`}>
                          <Button size="lg" className="w-full">
                            <Play className={`h-4 w-4 ${isRTL ? "ml-2 mr-0" : "mr-2"}`} />
                            {t("course.continuelearning")}
                          </Button>
                        </Link>
                        <div className="grid grid-cols-2 gap-2">
                          <Link href={`/courses/${course.id}/analytics`}>
                            <Button variant="outline" size="sm" className="w-full bg-transparent">
                              <BarChart3 className={`h-4 w-4 ${isRTL ? "ml-2 mr-0" : "mr-2"}`} />
                              {t("course.analytics")}
                            </Button>
                          </Link>
                          {course.progress === 100 && (
                            <Link href={`/courses/${course.id}/certificate`}>
                              <Button variant="outline" size="sm" className="w-full bg-transparent">
                                <Award className={`h-4 w-4 ${isRTL ? "ml-2 mr-0" : "mr-2"}`} />
                                {t("course.certificate")}
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Link href="/payment">
                          <Button size="lg" className="w-full">
                            {t("course.enrollNow")}
                          </Button>
                        </Link>
                        <Button variant="outline" size="lg" className="w-full bg-transparent">
                          <Play className={`h-4 w-4 ${isRTL ? "ml-2 mr-0" : "mr-2"}`} />
                          {t("course.previewCourse")}
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 mr-2 text-green-500" />
                      <span>{t("course.moneyBackGuarantee")}</span>
                    </div>
                    {course.lifetimeAccess && (
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-blue-500" />
                        <span>{t("course.lifetimeAccess")}</span>
                      </div>
                    )}
                    {course.mobileAccess && (
                      <div className="flex items-center">
                        <Smartphone className="h-4 w-4 mr-2 text-purple-500" />
                        <span>{t("course.mobileAccess")}</span>
                      </div>
                    )}
                    {course.certificate && (
                      <div className="flex items-center">
                        <Award className="h-4 w-4 mr-2 text-yellow-500" />
                        <span>Certificate of completion</span>
                      </div>
                    )}
                  </div>

                  <Separator className="my-4" />

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Share2 className={`h-4 w-4 ${isRTL ? "ml-2 mr-0" : "mr-2"}`} />
                      {t("common.share")}
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Download className={`h-4 w-4 ${isRTL ? "ml-2 mr-0" : "mr-2"}`} />
                      {t("common.download")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section ref={contentRef} className="course-content py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="overview">{t("course.overview")}</TabsTrigger>
                  <TabsTrigger value="curriculum">{t("course.curriculum")}</TabsTrigger>
                  <TabsTrigger value="instructor">{t("course.instructor")}</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-4">{t("course.whatYouWillLearn")}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {course.whatYouWillLearn.map((item, index) => (
                        <div key={index} className={`flex items-start space-x-3 ${isRTL ? "space-x-reverse" : ""}`}>
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-4">{t("course.requirements")}</h2>
                    <ul className="space-y-2">
                      {course.requirements.map((requirement, index) => (
                        <li key={index} className={`flex items-start space-x-3 ${isRTL ? "space-x-reverse" : ""}`}>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                          <span>{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-4">{t("course.courseFeatures")}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {course.features.map((feature, index) => (
                        <div key={index} className={`flex items-start space-x-3 ${isRTL ? "space-x-reverse" : ""}`}>
                          <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="curriculum" className="space-y-4">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">{t("course.curriculum")}</h2>
                    <div className="text-sm text-muted-foreground">
                      {course.totalLessons} lessons • {course.duration}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {course.syllabus.map((section, index) => (
                      <Card key={section.id} className="syllabus-item">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className={`flex items-center space-x-3 ${isRTL ? "space-x-reverse" : ""}`}>
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                                {index + 1}
                              </div>
                              <div>
                                <CardTitle className="text-lg">{section.title}</CardTitle>
                                <p className="text-sm text-muted-foreground">{section.description}</p>
                              </div>
                            </div>
                            <div
                              className={`flex items-center space-x-4 text-sm text-muted-foreground ${isRTL ? "space-x-reverse" : ""}`}
                            >
                              <span>{section.lessons} lessons</span>
                              <span>{section.duration}</span>
                              {section.completed ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : (
                                <Play className="h-5 w-5" />
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        {section.currentLesson && (
                          <CardContent className="pt-0">
                            <div className="bg-muted/50 rounded-lg p-3">
                              <p className="text-xs text-muted-foreground mb-1">Current Lesson:</p>
                              <p className="text-sm font-medium">{section.currentLesson}</p>
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="instructor" className="space-y-6">
                  <div className={`flex items-start space-x-6 ${isRTL ? "space-x-reverse" : ""}`}>
                    <Image
                      src={course.instructor.avatar || "/placeholder.svg"}
                      alt={course.instructor.name}
                      width={120}
                      height={120}
                      className="rounded-full"
                    />
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-2">{course.instructor.name}</h2>
                      <p className="text-muted-foreground mb-4">{course.instructor.bio}</p>

                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold">{course.instructor.rating}</div>
                          <div className="text-sm text-muted-foreground">{t("course.rating")}</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold">{course.instructor.students.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">{t("course.students")}</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold">{course.instructor.courses}</div>
                          <div className="text-sm text-muted-foreground">Courses</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="space-y-6">
                  <CourseReviews
                    courseId={course.id}
                    reviews={[]}
                    averageRating={course.rating}
                    totalReviews={course.reviews}
                    canReview={course.isEnrolled}
                  />
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Level:</span>
                      <span className="font-medium">{course.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("course.duration")}:</span>
                      <span className="font-medium">{course.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lessons:</span>
                      <span className="font-medium">{course.totalLessons}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Language:</span>
                      <span className="font-medium">{course.language}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Updated:</span>
                      <span className="font-medium">{course.lastUpdated}</span>
                    </div>
                  </CardContent>
                </Card>

                {course.isEnrolled && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Link href={`/courses/${course.id}/learn`}>
                        <Button className="w-full" size="sm">
                          <Play className={`h-4 w-4 ${isRTL ? "ml-2 mr-0" : "mr-2"}`} />
                          {t("course.continuelearning")}
                        </Button>
                      </Link>
                      <Link href={`/courses/${course.id}/analytics`}>
                        <Button variant="outline" className="w-full bg-transparent" size="sm">
                          <BarChart3 className={`h-4 w-4 ${isRTL ? "ml-2 mr-0" : "mr-2"}`} />
                          View Analytics
                        </Button>
                      </Link>
                      <Link href="/bookmarks">
                        <Button variant="outline" className="w-full bg-transparent" size="sm">
                          <Bookmark className={`h-4 w-4 ${isRTL ? "ml-2 mr-0" : "mr-2"}`} />
                          My Bookmarks
                        </Button>
                      </Link>
                      {course.progress === 100 && (
                        <Link href={`/courses/${course.id}/certificate`}>
                          <Button variant="outline" className="w-full bg-transparent" size="sm">
                            <Award className={`h-4 w-4 ${isRTL ? "ml-2 mr-0" : "mr-2"}`} />
                            Get Certificate
                          </Button>
                        </Link>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
