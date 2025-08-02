"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import CourseCard from "@/components/course-card"
import LoadingSpinner from "@/components/loading-spinner"
import { ArrowRight, Play, BookOpen, Users, Award, Star, Calendar, TrendingUp } from "lucide-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { getRandomCourses, getNew3Courses, get4Mentors } from "@/lib/action/courses"
import { toast } from "sonner"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

// Interface for course data from database
interface CourseData {
  id: string
  title: string
  slug: string
  description: string
  thumbnail: string | null
  price: number
  rating: number | null
  totalDuration: number
  studentsCount: number
  category: {
    name: string
  }
  creator: {
    firstName: string
    lastName: string
    avatar: string | null
  }
}






const featuredCourses = [
  {
    id: "1",
    title: "Complete Web Development Bootcamp",
    description: "Learn HTML, CSS, JavaScript, React, Node.js, and more in this comprehensive course.",
    image: "/placeholder.svg?height=300&width=400",
    instructor: "John Smith",
    duration: "40 hours",
    students: 15420,
    rating: 4.8,
    price: 89,
    tags: ["Web Development", "JavaScript", "React"],
  },
  {
    id: "2",
    title: "Data Science with Python",
    description: "Master data analysis, machine learning, and visualization with Python.",
    image: "/placeholder.svg?height=300&width=400",
    instructor: "Sarah Johnson",
    duration: "35 hours",
    students: 12350,
    rating: 4.9,
    price: 99,
    tags: ["Data Science", "Python", "Machine Learning"],
  },
  {
    id: "3",
    title: "UI/UX Design Masterclass",
    description: "Create beautiful and user-friendly designs with modern design principles.",
    image: "/placeholder.svg?height=300&width=400",
    instructor: "Mike Chen",
    duration: "25 hours",
    students: 8900,
    rating: 4.7,
    price: 79,
    tags: ["Design", "UI/UX", "Figma"],
  },
]

const categories = [
  {
    name: "Family & Relationships",
    image: "/images/sandy-millar-KhStXRVhfog-unsplash.jpg",
    description: "Build stronger relationships and family bonds",
    size: "large", // large, medium, small
  },
  {
    name: "Physical & Mental Health",
    image: "/images/marcel-strauss-fzqxoFJytiE-unsplash.jpg",
    description: "Wellness and mental health courses",
    size: "medium",
  },
  {
    name: "Technology & Development",
    image: "/images/florian-olivo-JNz9bQD3Oio-unsplash.jpg",
    description: "Programming and tech skills",
    size: "medium",
  },
  {
    name: "Academic Courses",
    image: "/images/priscilla-du-preez-ggeZ9oyI-PE-unsplash_48.jpg",
    description: "Academic subjects and teaching",
    size: "small",
  },
  {
    name: "Arts & Design",
    image: "/images/birmingham-museums-trust-wKlHsooRVbg-unsplash_42.jpg",
    description: "Creative arts and design skills",
    size: "small",
  },
  {
    name: "Professional Skills",
    image: "/images/vitaly-gariev-Z6ogoeso9BI-unsplash.jpg",
    description: "Business and professional development",
    size: "large",
  },
]



export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const coursesRef = useRef<HTMLDivElement>(null)
  const newCoursesRef = useRef<HTMLDivElement>(null)
  const chosenCoursesRef = useRef<HTMLDivElement>(null)
  const categoriesRef = useRef<HTMLDivElement>(null)
  const mentorsRef = useRef<HTMLDivElement>(null)

  // State for chosen courses
  const [chosenCourses, setChosenCourses] = useState<CourseData[]>([])
  const [isLoadingChosen, setIsLoadingChosen] = useState(true)
  
  // State for new courses
  const [newCourses, setNewCourses] = useState<CourseData[]>([])
  const [isLoadingNew, setIsLoadingNew] = useState(true)
  
  // State for mentors
  const [mentors, setMentors] = useState<any[]>([])
  const [isLoadingMentors, setIsLoadingMentors] = useState(true)
  
  // State for counter animation
  const [counters, setCounters] = useState({
    courses: 0,
    students: 0,
    completion: 0
  })

  // Fetch random courses for chosen section
  useEffect(() => {
    const fetchChosenCourses = async () => {
      try {
        setIsLoadingChosen(true)
        const result = await getRandomCourses(2) // Get 2 random courses
        if (result.success) {
          setChosenCourses(result?.courses)
        } else {
          toast.error("Failed to load recommended courses")
        }
      } catch (error) {
        console.error('Error fetching chosen courses:', error)
        toast.error("Error loading recommended courses")
      } finally {
        setIsLoadingChosen(false)
      }
    }

    fetchChosenCourses()
  }, [])

  // Fetch new courses for What's New section
  useEffect(() => {
    const fetchNewCourses = async () => {
      try {
        setIsLoadingNew(true)
        const result = await getNew3Courses()
        if (result.success) {
          setNewCourses(result?.courses)
        } else {
          toast.error("Failed to load new courses")
        }
      } catch (error) {
        console.error('Error fetching new courses:', error)
        toast.error("Error loading new courses")
      } finally {
        setIsLoadingNew(false)
      }
    }

    fetchNewCourses()
  }, [])

  // Fetch mentors for Meet Our Mentors section
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setIsLoadingMentors(true)
        const result = await get4Mentors()
        if (result.success) {
          setMentors(result?.mentors)
        } else {
          toast.error("Failed to load mentors")
        }
      } catch (error) {
        console.error('Error fetching mentors:', error)
        toast.error("Error loading mentors")
      } finally {
        setIsLoadingMentors(false)
      }
    }

    fetchMentors()
  }, [])

  useEffect(() => {
    let statsTrigger: ScrollTrigger | null = null
    
    const ctx = gsap.context(() => {
      // Hero animations
      const tl = gsap.timeline()
      tl.fromTo(
        ".hero-text",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power2.out" },
      ).fromTo(".hero-button", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.3")

      // Advanced scroll animations for each section
      const sections = [
        { trigger: statsRef.current, elements: ".stat-item", animation: "slideUp" },
        { trigger: newCoursesRef.current, elements: ".new-course-card", animation: "slideLeft" },
        { trigger: chosenCoursesRef.current, elements: ".chosen-course-card", animation: "scaleIn" },
        { trigger: categoriesRef.current, elements: ".category-card", animation: "fadeInStagger" },
        { trigger: mentorsRef.current, elements: ".mentor-card", animation: "slideUp" },
        { trigger: coursesRef.current, elements: ".featured-course-card", animation: "slideUp" },
      ]

      sections.forEach(({ trigger, elements, animation }) => {
        if (!trigger) return

        const items = gsap.utils.toArray(elements) as Element[]

        // Set initial state
        gsap.set(items, {
          opacity: 0,
          y: animation.includes("slideUp") ? 50 : animation.includes("slideLeft") ? 0 : 30,
          x: animation.includes("slideLeft") ? -50 : 0,
          scale: animation.includes("scaleIn") ? 0.9 : 1,
        })

        // Create scroll trigger for entrance
        ScrollTrigger.create({
          trigger: trigger,
          start: "top 80%",
          end: "bottom 20%",
          onEnter: () => {
            gsap.to(items, {
              opacity: 1,
              y: 0,
              x: 0,
              scale: 1,
              duration: 0.8,
              stagger: animation.includes("Stagger") ? 0.1 : 0.15,
              ease: "power2.out",
            })
          },
          onEnterBack: () => {
            gsap.to(items, {
              opacity: 1,
              y: 0,
              x: 0,
              scale: 1,
              duration: 0.6,
              stagger: 0.1,
              ease: "power2.out",
            })
          },
        })
      })

      // Section headers animation with scroll triggers
      const headers = gsap.utils.toArray(".section-header") as Element[]
      headers.forEach((header) => {
        gsap.set(header, { opacity: 0, y: 30 })

        ScrollTrigger.create({
          trigger: header,
          start: "top 90%",
          end: "bottom 10%",
          onEnter: () => {
            gsap.to(header, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
            })
          },
          onEnterBack: () => {
            gsap.to(header, {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: "power2.out",
            })
          },
        })
      })

      // Counter animation for stats
      if (statsRef.current) {
        statsTrigger = ScrollTrigger.create({
          trigger: statsRef.current,
          start: "top 80%",
          onEnter: () => {
            // Animate courses counter (500+)
            gsap.to({}, {
              duration: 2,
              onUpdate: function() {
                const progress = this.progress()
                const targetValue = 500
                const currentValue = Math.floor(progress * targetValue)
                setCounters(prev => ({ ...prev, courses: currentValue }))
              }
            })

            // Animate students counter (100K+)
            gsap.to({}, {
              duration: 2.5,
              onUpdate: function() {
                const progress = this.progress()
                const targetValue = 100000
                const currentValue = Math.floor(progress * targetValue)
                setCounters(prev => ({ ...prev, students: currentValue }))
              }
            })

            // Animate completion rate (95%)
            gsap.to({}, {
              duration: 1.5,
              onUpdate: function() {
                const progress = this.progress()
                const targetValue = 95
                const currentValue = Math.floor(progress * targetValue)
                setCounters(prev => ({ ...prev, completion: currentValue }))
              }
            })
          }
        })
      }
    })

    return () => {
      ctx.revert()
      if (statsTrigger) {
        statsTrigger.kill()
      }
    }
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="hero-text text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            Learn Without
            <span className="text-primary block">Limits</span>
          </h1>
          <p className="hero-text text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Discover thousands of courses from expert instructors and advance your career with skills that matter.
          </p>
          <div className="hero-button flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6">
              Start Learning Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="stat-item">
              <div className="flex justify-center mb-4">
                <BookOpen className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-3xl font-bold mb-2">{counters.courses}+</h3>
              <p className="text-muted-foreground">Expert-led Courses</p>
            </div>
            <div className="stat-item">
              <div className="flex justify-center mb-4">
                <Users className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-3xl font-bold mb-2">{counters.students >= 1000 ? `${Math.floor(counters.students / 1000)}K+` : `${counters.students}+`}</h3>
              <p className="text-muted-foreground">Active Students</p>
            </div>
            <div className="stat-item">
              <div className="flex justify-center mb-4">
                <Award className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-3xl font-bold mb-2">{counters.completion}%</h3>
              <p className="text-muted-foreground">Completion Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* What's New Section */}
      <section ref={newCoursesRef} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-header text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <TrendingUp className="h-6 w-6 text-primary" />
              <Badge variant="secondary" className="text-sm">
                New
              </Badge>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What's New</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Fresh courses just added to our platform. Stay ahead with the latest skills and technologies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {isLoadingNew ? (
              <LoadingSpinner text="Loading new courses..." className="col-span-full" />
            ) : (
              newCourses.map((course) => (
                <div key={course.id} className="new-course-card relative">
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-green-500 hover:bg-green-600">
                      <Calendar className="w-3 h-3 mr-1" />
                      New
                    </Badge>
                  </div>
                  <CourseCard
                    course={{
                      id: course.id,
                      title: course.title,
                      description: course.description,
                      image: course.thumbnail || "/placeholder.svg",
                      instructor: `${course.creator?.firstName} ${course.creator?.lastName}`,
                      duration: course.totalDuration ? `${Math.floor(course.totalDuration / 60)}h ${course.totalDuration % 60}m` : 'Duration N/A',
                      students: course.studentsCount || 0,
                      rating: course.rating || 0,
                      price: course.price,
                      tags: [course.category?.name || "Course"]
                    }}
                  />
                </div>
              ))
            )}
          </div>

          <div className="text-center">
            <Link href="/courses">
              <Button size="lg" variant="outline">
                View All New Courses
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* What We Chose for You Section */}
      <section ref={chosenCoursesRef} className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-header text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Star className="h-6 w-6 text-primary fill-primary" />
              <Badge variant="secondary" className="text-sm">
                Curated
              </Badge>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What We Chose for You</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Hand-picked courses by our education experts based on current industry trends and student success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {isLoadingChosen ? (
              <LoadingSpinner text="Loading recommended courses..." />
            ) : (
              chosenCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={{
                    id: course.id,
                    title: course.title,
                    description: course.description,
                    image: course.thumbnail || "/placeholder.svg",
                    instructor: `${course.creator?.firstName} ${course.creator?.lastName}`,
                    duration: course.totalDuration ? `${Math.floor(course.totalDuration / 60)}h ${course.totalDuration % 60}m` : 'Duration N/A',
                    students: course.studentsCount || 0,
                    rating: course.rating || 0,
                    price: course.price,
                    tags: [course.category?.name || "Course"]
                  }}
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Training Course Applications Section */}
      <section ref={categoriesRef} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-header text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Training Course Applications</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover courses across various fields and find the perfect path for your career growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <Link key={category.name} href={`/courses/category/${category.name}`}>
                <div className="category-card group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl h-[300px]">
                  <div className="absolute inset-0">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
                  </div>

                  <div className="relative h-full flex flex-col justify-end p-6 text-white">
                    <h3 className="text-lg md:text-xl font-bold mb-2 group-hover:text-primary-foreground transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm opacity-90 mb-2">{category.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* The Mentors Section */}
      <section ref={mentorsRef} className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-header text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Mentors</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Learn from industry experts who have shaped the future of technology at leading companies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {isLoadingMentors ? (
              <LoadingSpinner text="Loading mentors..." className="col-span-full" />
            ) : (
              mentors.map((mentor) => (
                <Card key={mentor.id} className="mentor-card group hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="relative mb-4">
                      <Image
                        src={mentor.user?.avatar || "/placeholder.svg"}
                        alt={`${mentor.user?.firstName} ${mentor.user?.lastName}`}
                        width={120}
                        height={120}
                        className="rounded-full mx-auto group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">{`${mentor.user?.firstName} ${mentor.user?.lastName}`}</h3>
                    <p className="text-sm text-primary font-medium mb-1">{mentor.experience}</p>
                    <p className="text-sm text-muted-foreground mb-4">{mentor.user?.email}</p>

                    <div className="flex justify-center space-x-4 text-xs text-muted-foreground mb-4">
                      <div className="flex items-center">
                        <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                        {mentor.rating || 0}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {mentor.totalStudents?.toLocaleString() || 0}
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="h-3 w-3 mr-1" />
                        {mentor.expertise?.length || 0}
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground mb-4 line-clamp-3">{mentor.experience}</p>

                    <div className="flex flex-wrap gap-1 justify-center">
                      {mentor.expertise?.slice(0, 2).map((skill: string) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {mentor.expertise && mentor.expertise.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{mentor.expertise.length - 2}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline">
              View All Mentors
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section ref={coursesRef} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-header text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Courses</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our most popular courses designed by industry experts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredCourses.map((course) => (
              <div key={course.id} className="featured-course-card">
                <CourseCard course={course} />
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/courses">
              <Button size="lg" variant="outline">
                View All Courses
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

