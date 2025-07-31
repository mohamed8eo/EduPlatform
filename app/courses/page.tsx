"use client"

import { useEffect, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import CourseCard from "@/components/course-card"
import { Search, Filter } from "lucide-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const allCourses = [
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
  {
    id: "4",
    title: "Digital Marketing Strategy",
    description: "Learn to create effective digital marketing campaigns and grow your business online.",
    image: "/placeholder.svg?height=300&width=400",
    instructor: "Emily Davis",
    duration: "20 hours",
    students: 7650,
    rating: 4.6,
    price: 69,
    tags: ["Marketing", "Digital", "Strategy"],
  },
  {
    id: "5",
    title: "Mobile App Development with React Native",
    description: "Build cross-platform mobile apps using React Native and JavaScript.",
    image: "/placeholder.svg?height=300&width=400",
    instructor: "David Wilson",
    duration: "30 hours",
    students: 9200,
    rating: 4.7,
    price: 95,
    tags: ["Mobile Development", "React Native", "JavaScript"],
  },
  {
    id: "6",
    title: "Cybersecurity Fundamentals",
    description: "Learn the basics of cybersecurity and protect systems from digital threats.",
    image: "/placeholder.svg?height=300&width=400",
    instructor: "Lisa Brown",
    duration: "28 hours",
    students: 6800,
    rating: 4.8,
    price: 85,
    tags: ["Cybersecurity", "Security", "IT"],
  },
]

const categories = [
  "All",
  "Web Development",
  "Data Science",
  "Design",
  "Marketing",
  "Mobile Development",
  "Cybersecurity",
]

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [filteredCourses, setFilteredCourses] = useState(allCourses)
  const coursesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".page-header", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" })

      gsap.fromTo(
        ".filter-section",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: "power2.out" },
      )

      gsap.fromTo(
        ".course-card",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
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
    let filtered = allCourses

    if (selectedCategory !== "All") {
      filtered = filtered.filter((course) =>
        course.tags.some((tag) => tag.toLowerCase().includes(selectedCategory.toLowerCase())),
      )
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    setFilteredCourses(filtered)
  }, [searchTerm, selectedCategory])

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="page-header text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">All Courses</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our comprehensive collection of courses and start your learning journey today
          </p>
        </div>

        {/* Search and Filter */}
        <div className="filter-section mb-12">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="md:w-auto bg-transparent">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        <div ref={coursesRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No courses found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
