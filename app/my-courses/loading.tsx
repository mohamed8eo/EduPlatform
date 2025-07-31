"use client"

import { useEffect, useRef } from "react"
import MyCourseCardSkeleton from "@/components/skeletons/my-course-card-skeleton"
import ShimmerSkeleton from "@/components/skeletons/shimmer-skeleton"
import { gsap } from "gsap"

export default function MyCoursesLoading() {
  const loadingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".loading-section",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" },
      )
    })

    return () => ctx.revert()
  }, [])

  return (
    <div ref={loadingRef} className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header skeleton */}
        <div className="loading-section mb-12">
          <ShimmerSkeleton className="h-10 bg-muted-foreground/20 rounded mb-4 w-1/3" />
          <ShimmerSkeleton className="h-6 bg-muted-foreground/20 rounded w-1/2" />
        </div>

        {/* Stats skeleton */}
        <div className="loading-section grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="p-6 rounded-lg bg-muted/50">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <ShimmerSkeleton className="h-4 w-20 bg-muted-foreground/20 rounded" />
                  <ShimmerSkeleton className="h-8 w-12 bg-muted-foreground/20 rounded" />
                </div>
                <ShimmerSkeleton className="h-8 w-8 bg-muted-foreground/20 rounded" />
              </div>
            </div>
          ))}
        </div>

        {/* Filters skeleton */}
        <div className="loading-section mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex space-x-2">
              {[1, 2, 3, 4].map((index) => (
                <ShimmerSkeleton key={index} className="h-10 w-24 bg-muted-foreground/20 rounded" />
              ))}
            </div>
            <div className="flex gap-4">
              <ShimmerSkeleton className="h-10 w-80 bg-muted-foreground/20 rounded" />
              <ShimmerSkeleton className="h-10 w-20 bg-muted-foreground/20 rounded" />
            </div>
          </div>
        </div>

        {/* Courses skeleton */}
        <div className="loading-section space-y-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <MyCourseCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  )
}
