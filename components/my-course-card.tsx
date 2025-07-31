"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import CourseProgressBar from "@/components/course-progress-bar"
import { Play, BookOpen, Calendar, MoreVertical } from "lucide-react"
import { gsap } from "gsap"

interface MyCourse {
  id: string
  title: string
  description: string
  image: string
  instructor: string
  category: string
  progress: number
  totalLessons: number
  completedLessons: number
  timeSpent: string
  lastAccessed: string
  purchaseDate: string
  nextLesson?: string
}

interface MyCourseCardProps {
  course: MyCourse
}

export default function MyCourseCard({ course }: MyCourseCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const handleMouseEnter = () => {
      gsap.to(card, {
        y: -5,
        scale: 1.01,
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
  }, [])

  return (
    <Card
      ref={cardRef}
      className="overflow-hidden hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary"
    >
      <div className="md:flex">
        {/* Course Image */}
        <div className="md:w-1/3 relative h-48 md:h-auto">
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
              {course.category}
            </Badge>
          </div>
        </div>

        {/* Course Content */}
        <CardContent className="md:w-2/3 p-6 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2 line-clamp-2">{course.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">by {course.instructor}</p>
                <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
              </div>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>

            {/* Progress */}
            <CourseProgressBar
              progress={course.progress}
              totalLessons={course.totalLessons}
              completedLessons={course.completedLessons}
              timeSpent={course.timeSpent}
              lastAccessed={course.lastAccessed}
            />

            {/* Next Lesson */}
            {course.nextLesson && course.progress < 100 && (
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Next Lesson:</p>
                <p className="text-sm font-medium">{course.nextLesson}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>Purchased: {course.purchaseDate}</span>
              </div>
            </div>
            <div className="flex space-x-2">
              {course.progress < 100 ? (
                <Link href={`/courses/${course.id}/learn`}>
                  <Button size="sm">
                    <Play className="mr-2 h-4 w-4" />
                    Continue
                  </Button>
                </Link>
              ) : (
                <Link href={`/courses/${course.id}/learn`}>
                  <Button size="sm" variant="outline">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Review
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
