"use client"

import { Card, CardContent } from "@/components/ui/card"

export default function CourseCardSkeleton() {
  return (
    <Card className="overflow-hidden border animate-pulse">
      {/* Image skeleton */}
      <div className="relative h-48 bg-muted">
        <div className="absolute top-4 left-4 w-16 h-6 bg-muted-foreground/20 rounded"></div>
      </div>

      <CardContent className="p-6">
        {/* Tags skeleton */}
        <div className="flex flex-wrap gap-2 mb-3">
          <div className="h-5 w-16 bg-muted-foreground/20 rounded-full"></div>
          <div className="h-5 w-20 bg-muted-foreground/20 rounded-full"></div>
          <div className="h-5 w-12 bg-muted-foreground/20 rounded-full"></div>
        </div>

        {/* Title skeleton */}
        <div className="h-6 bg-muted-foreground/20 rounded mb-2"></div>
        <div className="h-6 bg-muted-foreground/20 rounded w-3/4 mb-4"></div>

        {/* Description skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-muted-foreground/20 rounded"></div>
          <div className="h-4 bg-muted-foreground/20 rounded"></div>
          <div className="h-4 bg-muted-foreground/20 rounded w-2/3"></div>
        </div>

        {/* Stats skeleton */}
        <div className="flex items-center justify-between text-sm mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="h-4 w-4 bg-muted-foreground/20 rounded mr-1"></div>
              <div className="h-4 w-12 bg-muted-foreground/20 rounded"></div>
            </div>
            <div className="flex items-center">
              <div className="h-4 w-4 bg-muted-foreground/20 rounded mr-1"></div>
              <div className="h-4 w-8 bg-muted-foreground/20 rounded"></div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 bg-muted-foreground/20 rounded mr-1"></div>
            <div className="h-4 w-6 bg-muted-foreground/20 rounded"></div>
          </div>
        </div>

        {/* Footer skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-4 w-20 bg-muted-foreground/20 rounded"></div>
          <div className="h-9 w-24 bg-muted-foreground/20 rounded"></div>
        </div>
      </CardContent>
    </Card>
  )
}
