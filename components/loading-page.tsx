"use client"

import { useEffect, useRef } from "react"
import CourseCardSkeleton from "@/components/skeletons/course-card-skeleton"
import MentorCardSkeleton from "@/components/skeletons/mentor-card-skeleton"
import CategoryCardSkeleton from "@/components/skeletons/category-card-skeleton"
import ChosenCourseSkeleton from "@/components/skeletons/chosen-course-skeleton"
import SectionHeaderSkeleton from "@/components/skeletons/section-header-skeleton"
import StatsSkeleton from "@/components/skeletons/stats-skeleton"
import { gsap } from "gsap"

export default function LoadingPage() {
  const loadingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate skeleton elements with a subtle pulse effect
      gsap.fromTo(
        ".skeleton-section",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" },
      )
    })

    return () => ctx.revert()
  }, [])

  const categories = [
    { size: "large" as const },
    { size: "medium" as const },
    { size: "medium" as const },
    { size: "small" as const },
    { size: "small" as const },
    { size: "small" as const },
    { size: "large" as const },
  ]

  return (
    <div ref={loadingRef} className="min-h-screen">
      {/* Hero Skeleton */}
      <section className="skeleton-section relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-pulse">
          <div className="h-16 bg-muted-foreground/20 rounded mb-6 w-3/4 mx-auto"></div>
          <div className="h-16 bg-muted-foreground/20 rounded mb-8 w-1/2 mx-auto"></div>
          <div className="space-y-4 mb-8 max-w-3xl mx-auto">
            <div className="h-6 bg-muted-foreground/20 rounded"></div>
            <div className="h-6 bg-muted-foreground/20 rounded w-4/5 mx-auto"></div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="h-14 w-48 bg-muted-foreground/20 rounded"></div>
            <div className="h-14 w-40 bg-muted-foreground/20 rounded"></div>
          </div>
        </div>
      </section>

      {/* Stats Skeleton */}
      <section className="skeleton-section py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StatsSkeleton />
        </div>
      </section>

      {/* What's New Skeleton */}
      <section className="skeleton-section py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeaderSkeleton />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[1, 2, 3].map((index) => (
              <CourseCardSkeleton key={index} />
            ))}
          </div>
          <div className="text-center">
            <div className="h-12 w-48 bg-muted-foreground/20 rounded mx-auto animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* What We Chose for You Skeleton */}
      <section className="skeleton-section py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeaderSkeleton />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {[1, 2].map((index) => (
              <ChosenCourseSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Skeleton */}
      <section className="skeleton-section py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeaderSkeleton />
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 h-[600px]">
            {categories.map((category, index) => (
              <CategoryCardSkeleton key={index} size={category.size} />
            ))}
          </div>
        </div>
      </section>

      {/* Mentors Skeleton */}
      <section className="skeleton-section py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeaderSkeleton />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((index) => (
              <MentorCardSkeleton key={index} />
            ))}
          </div>
          <div className="text-center mt-12">
            <div className="h-12 w-40 bg-muted-foreground/20 rounded mx-auto animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Featured Courses Skeleton */}
      <section className="skeleton-section py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeaderSkeleton />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[1, 2, 3].map((index) => (
              <CourseCardSkeleton key={index} />
            ))}
          </div>
          <div className="text-center">
            <div className="h-12 w-40 bg-muted-foreground/20 rounded mx-auto animate-pulse"></div>
          </div>
        </div>
      </section>
    </div>
  )
}
