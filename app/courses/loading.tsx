"use client"

import CourseCardSkeleton from "@/components/skeletons/course-card-skeleton"
import SectionHeaderSkeleton from "@/components/skeletons/section-header-skeleton"

export default function CoursesLoading() {
  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Skeleton */}
        <SectionHeaderSkeleton />

        {/* Search and Filter Skeleton */}
        <div className="mb-12 animate-pulse">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 h-10 bg-muted-foreground/20 rounded"></div>
            <div className="h-10 w-24 bg-muted-foreground/20 rounded"></div>
          </div>

          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <div key={index} className="h-6 w-20 bg-muted-foreground/20 rounded-full"></div>
            ))}
          </div>
        </div>

        {/* Courses Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 9 }).map((_, index) => (
            <CourseCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  )
}
