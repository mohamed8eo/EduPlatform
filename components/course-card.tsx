"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Star } from "lucide-react"
import { gsap } from "gsap"
import CourseCardSkeleton from "@/components/skeletons/course-card-skeleton"

interface Course {
  id: string
  title: string
  description: string
  image: string
  instructor: string
  duration: string
  students: number
  rating: number
  price: number
  tags: string[]
}

interface CourseCardProps {
  course: Course
  loading?: boolean
}

export default function CourseCard({ course, loading = false }: CourseCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    const card = cardRef.current
    if (!card || loading) return

    const handleMouseEnter = () => {
      gsap.to(card, {
        y: -10,
        scale: 1.02,
        duration: 0.3,
        ease: "power2.out",
      })
    }

    const handleMouseLeave = () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      })
    }

    card.addEventListener("mouseenter", handleMouseEnter)
    card.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      card.removeEventListener("mouseenter", handleMouseEnter)
      card.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [loading])

  if (loading) {
    return <CourseCardSkeleton />
  }

  return (
    <div
      ref={cardRef}
      className="course-card bg-card rounded-lg shadow-lg overflow-hidden border transition-shadow hover:shadow-xl"
    >
      <div className="relative h-48">
        {!imageLoaded && <div className="absolute inset-0 bg-muted-foreground/20 animate-pulse"></div>}
        <Image
          src={course.image || "/placeholder.svg"}
          alt={course.title}
          fill
          className={`object-cover transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setImageLoaded(true)}
        />
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="bg-background/90">
            ${course.price}
          </Badge>
        </div>
      </div>

      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {course.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <h3 className="text-xl font-semibold mb-2 line-clamp-2">{course.title}</h3>
        <p className="text-muted-foreground mb-4 line-clamp-3">{course.description}</p>

        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {course.duration}
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {course.students}
            </div>
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
            {course.rating}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">by {course.instructor}</p>
          <Link href={`/courses/${course.id}`}>
            <Button size="sm">View Course</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
