"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import CourseCard from "@/components/course-card"
import { ArrowRight, Play, BookOpen, Users, Award, Star, Calendar, TrendingUp } from "lucide-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
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

const newCourses = [
  {
    id: "7",
    title: "Advanced React Patterns",
    description: "Master advanced React patterns and performance optimization techniques.",
    image: "/placeholder.svg?height=200&width=300",
    instructor: "Alex Rodriguez",
    duration: "18 hours",
    students: 2340,
    rating: 4.9,
    price: 129,
    tags: ["React", "Advanced", "Performance"],
    isNew: true,
  },
  {
    id: "8",
    title: "AI & Machine Learning Fundamentals",
    description: "Get started with artificial intelligence and machine learning concepts.",
    image: "/placeholder.svg?height=200&width=300",
    instructor: "Dr. Emma Watson",
    duration: "32 hours",
    students: 5670,
    rating: 4.8,
    price: 149,
    tags: ["AI", "Machine Learning", "Python"],
    isNew: true,
  },
  {
    id: "9",
    title: "Blockchain Development",
    description: "Learn to build decentralized applications with blockchain technology.",
    image: "/placeholder.svg?height=200&width=300",
    instructor: "James Wilson",
    duration: "28 hours",
    students: 1890,
    rating: 4.7,
    price: 199,
    tags: ["Blockchain", "Web3", "Solidity"],
    isNew: true,
  },
]

const chosenCourses = [
  {
    id: "4",
    title: "Digital Marketing Strategy",
    description: "Learn to create effective digital marketing campaigns and grow your business online.",
    image: "/placeholder.svg?height=200&width=300",
    instructor: "Emily Davis",
    duration: "20 hours",
    students: 7650,
    rating: 4.6,
    price: 69,
    tags: ["Marketing", "Digital", "Strategy"],
    reason: "Most Popular This Month",
  },
  {
    id: "5",
    title: "Mobile App Development with React Native",
    description: "Build cross-platform mobile apps using React Native and JavaScript.",
    image: "/placeholder.svg?height=200&width=300",
    instructor: "David Wilson",
    duration: "30 hours",
    students: 9200,
    rating: 4.7,
    price: 95,
    tags: ["Mobile Development", "React Native", "JavaScript"],
    reason: "Editor's Choice",
  },
]

const categories = [
  {
    name: "Family & Relationships",
    image: "/placeholder.svg?height=300&width=400",
    courses: 45,
    description: "Build stronger relationships and family bonds",
    size: "large", // large, medium, small
  },
  {
    name: "Physical & Mental Health",
    image: "/placeholder.svg?height=200&width=300",
    courses: 67,
    description: "Wellness and mental health courses",
    size: "medium",
  },
  {
    name: "Technology & Development",
    image: "/placeholder.svg?height=200&width=300",
    courses: 120,
    description: "Programming and tech skills",
    size: "medium",
  },
  {
    name: "Academic Courses",
    image: "/placeholder.svg?height=200&width=300",
    courses: 89,
    description: "Academic subjects and teaching",
    size: "small",
  },
  {
    name: "Lifestyle Development",
    image: "/placeholder.svg?height=200&width=300",
    courses: 54,
    description: "Personal growth and lifestyle",
    size: "small",
  },
  {
    name: "Arts & Design",
    image: "/placeholder.svg?height=200&width=300",
    courses: 76,
    description: "Creative arts and design skills",
    size: "small",
  },
  {
    name: "Professional Skills",
    image: "/placeholder.svg?height=300&width=400",
    courses: 98,
    description: "Business and professional development",
    size: "large",
  },
]

const mentors = [
  {
    id: "1",
    name: "John Smith",
    title: "Senior Full Stack Developer",
    company: "Google",
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.9,
    students: 25000,
    courses: 8,
    bio: "10+ years of experience building scalable web applications at top tech companies.",
    expertise: ["JavaScript", "React", "Node.js", "Python"],
  },
  {
    id: "2",
    name: "Sarah Johnson",
    title: "Lead Data Scientist",
    company: "Microsoft",
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.8,
    students: 18500,
    courses: 6,
    bio: "Expert in machine learning and data analysis with PhD in Computer Science.",
    expertise: ["Python", "Machine Learning", "Data Analysis", "AI"],
  },
  {
    id: "3",
    name: "Mike Chen",
    title: "Principal UX Designer",
    company: "Apple",
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.9,
    students: 22000,
    courses: 5,
    bio: "Award-winning designer with 12+ years creating user-centered digital experiences.",
    expertise: ["UI/UX Design", "Figma", "Design Systems", "User Research"],
  },
  {
    id: "4",
    name: "Emily Davis",
    title: "Digital Marketing Director",
    company: "Meta",
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.7,
    students: 15000,
    courses: 7,
    bio: "Marketing strategist who has helped scale startups to billion-dollar companies.",
    expertise: ["Digital Marketing", "SEO", "Social Media", "Analytics"],
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

  useEffect(() => {
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

        const items = gsap.utils.toArray(elements)

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
          onLeave: () => {
            gsap.to(items, {
              opacity: 0,
              y: -30,
              duration: 0.5,
              stagger: 0.05,
              ease: "power2.in",
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
          onLeaveBack: () => {
            gsap.to(items, {
              opacity: 0,
              y: 50,
              x: animation.includes("slideLeft") ? -30 : 0,
              scale: animation.includes("scaleIn") ? 0.95 : 1,
              duration: 0.5,
              stagger: 0.05,
              ease: "power2.in",
            })
          },
        })
      })

      // Section headers animation with scroll triggers
      const headers = gsap.utils.toArray(".section-header")
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
          onLeave: () => {
            gsap.to(header, {
              opacity: 0,
              y: -20,
              duration: 0.4,
              ease: "power2.in",
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
          onLeaveBack: () => {
            gsap.to(header, {
              opacity: 0,
              y: 30,
              duration: 0.4,
              ease: "power2.in",
            })
          },
        })
      })
    })

    return () => ctx.revert()
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
              <h3 className="text-3xl font-bold mb-2">500+</h3>
              <p className="text-muted-foreground">Expert-led Courses</p>
            </div>
            <div className="stat-item">
              <div className="flex justify-center mb-4">
                <Users className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-3xl font-bold mb-2">100K+</h3>
              <p className="text-muted-foreground">Active Students</p>
            </div>
            <div className="stat-item">
              <div className="flex justify-center mb-4">
                <Award className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-3xl font-bold mb-2">95%</h3>
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
            {newCourses.map((course) => (
              <div key={course.id} className="new-course-card relative">
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-green-500 hover:bg-green-600">
                    <Calendar className="w-3 h-3 mr-1" />
                    New
                  </Badge>
                </div>
                <CourseCard course={course} />
              </div>
            ))}
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {chosenCourses.map((course) => (
              <div key={course.id} className="chosen-course-card">
                <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="md:flex">
                    <div className="md:w-1/2 relative h-64 md:h-auto">
                      <Image
                        src={course.image || "/placeholder.svg"}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-primary/90 hover:bg-primary">{course.reason}</Badge>
                      </div>
                    </div>
                    <CardContent className="md:w-1/2 p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {course.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <h3 className="text-xl font-semibold mb-3">{course.title}</h3>
                        <p className="text-muted-foreground mb-4">{course.description}</p>
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                          <span>by {course.instructor}</span>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                            {course.rating}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">${course.price}</span>
                        <Link href={`/courses/${course.id}`}>
                          <Button>View Course</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </div>
            ))}
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

          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 h-[600px]">
            {categories.map((category, index) => {
              const gridClasses = {
                large: "md:col-span-2 md:row-span-2",
                medium: "md:col-span-2 md:row-span-1",
                small: "md:col-span-1 md:row-span-1",
              }

              return (
                <Link key={category.name} href="/courses">
                  <div
                    className={`category-card group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${gridClasses[category.size]} min-h-[200px]`}
                  >
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
                      <p className="text-xs opacity-75">{category.courses} courses</p>
                    </div>
                  </div>
                </Link>
              )
            })}
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
            {mentors.map((mentor) => (
              <Card key={mentor.id} className="mentor-card group hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="relative mb-4">
                    <Image
                      src={mentor.image || "/placeholder.svg"}
                      alt={mentor.name}
                      width={120}
                      height={120}
                      className="rounded-full mx-auto group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{mentor.name}</h3>
                  <p className="text-sm text-primary font-medium mb-1">{mentor.title}</p>
                  <p className="text-sm text-muted-foreground mb-4">{mentor.company}</p>

                  <div className="flex justify-center space-x-4 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                      {mentor.rating}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      {mentor.students.toLocaleString()}
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="h-3 w-3 mr-1" />
                      {mentor.courses}
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mb-4 line-clamp-3">{mentor.bio}</p>

                  <div className="flex flex-wrap gap-1 justify-center">
                    {mentor.expertise.slice(0, 2).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {mentor.expertise.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{mentor.expertise.length - 2}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
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
