"use client"

import { Card, CardContent } from "@/components/ui/card"

export default function ChosenCourseSkeleton() {
  return (
    <Card className="overflow-hidden animate-pulse">
      <div className="md:flex">
        {/* Image skeleton */}
        <div className="md:w-1/2 h-64 md:h-auto bg-muted-foreground/20">
          <div className="absolute top-4 left-4 w-20 h-6 bg-white/30 rounded"></div>
        </div>

        {/* Content skeleton */}
        <CardContent className="md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            {/* Tags skeleton */}
            <div className="flex flex-wrap gap-2 mb-3">
              <div className="h-5 w-16 bg-muted-foreground/20 rounded-full"></div>
              <div className="h-5 w-12 bg-muted-foreground/20 rounded-full"></div>
              <div className="h-5 w-20 bg-muted-foreground/20 rounded-full"></div>
            </div>

            {/* Title skeleton */}
            <div className="h-6 bg-muted-foreground/20 rounded mb-3"></div>
            <div className="h-6 bg-muted-foreground/20 rounded w-2/3 mb-4"></div>

            {/* Description skeleton */}
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-muted-foreground/20 rounded"></div>
              <div className="h-4 bg-muted-foreground/20 rounded"></div>
              <div className="h-4 bg-muted-foreground/20 rounded w-3/4"></div>
            </div>

            {/* Instructor and rating skeleton */}
            <div className="flex items-center justify-between mb-4">
              <div className="h-4 w-20 bg-muted-foreground/20 rounded"></div>
              <div className="flex items-center">
                <div className="h-4 w-4 bg-muted-foreground/20 rounded mr-1"></div>
                <div className="h-4 w-6 bg-muted-foreground/20 rounded"></div>
              </div>
            </div>
          </div>

          {/* Price and button skeleton */}
          <div className="flex items-center justify-between">
            <div className="h-8 w-16 bg-muted-foreground/20 rounded"></div>
            <div className="h-10 w-24 bg-muted-foreground/20 rounded"></div>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
