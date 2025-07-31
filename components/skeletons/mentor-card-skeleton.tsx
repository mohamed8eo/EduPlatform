"use client"

import { Card, CardContent } from "@/components/ui/card"

export default function MentorCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardContent className="p-6 text-center">
        {/* Avatar skeleton */}
        <div className="relative mb-4">
          <div className="w-[120px] h-[120px] bg-muted-foreground/20 rounded-full mx-auto"></div>
        </div>

        {/* Name skeleton */}
        <div className="h-5 bg-muted-foreground/20 rounded mb-1 w-3/4 mx-auto"></div>

        {/* Title skeleton */}
        <div className="h-4 bg-muted-foreground/20 rounded mb-1 w-2/3 mx-auto"></div>

        {/* Company skeleton */}
        <div className="h-4 bg-muted-foreground/20 rounded mb-4 w-1/2 mx-auto"></div>

        {/* Stats skeleton */}
        <div className="flex justify-center space-x-4 mb-4">
          <div className="flex items-center">
            <div className="h-3 w-3 bg-muted-foreground/20 rounded mr-1"></div>
            <div className="h-3 w-6 bg-muted-foreground/20 rounded"></div>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 bg-muted-foreground/20 rounded mr-1"></div>
            <div className="h-3 w-8 bg-muted-foreground/20 rounded"></div>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 bg-muted-foreground/20 rounded mr-1"></div>
            <div className="h-3 w-4 bg-muted-foreground/20 rounded"></div>
          </div>
        </div>

        {/* Bio skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-3 bg-muted-foreground/20 rounded"></div>
          <div className="h-3 bg-muted-foreground/20 rounded"></div>
          <div className="h-3 bg-muted-foreground/20 rounded w-3/4 mx-auto"></div>
        </div>

        {/* Skills skeleton */}
        <div className="flex flex-wrap gap-1 justify-center">
          <div className="h-5 w-16 bg-muted-foreground/20 rounded-full"></div>
          <div className="h-5 w-12 bg-muted-foreground/20 rounded-full"></div>
          <div className="h-5 w-8 bg-muted-foreground/20 rounded-full"></div>
        </div>
      </CardContent>
    </Card>
  )
}
