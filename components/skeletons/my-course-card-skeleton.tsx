"use client"

import { Card, CardContent } from "@/components/ui/card"
import ShimmerSkeleton from "./shimmer-skeleton"

export default function MyCourseCardSkeleton() {
  return (
    <Card className="overflow-hidden border-l-4 border-l-muted-foreground/20">
      <div className="md:flex">
        {/* Image skeleton */}
        <div className="md:w-1/3 h-48 md:h-auto">
          <ShimmerSkeleton className="w-full h-full bg-muted-foreground/20">
            <div className="absolute top-4 left-4 w-20 h-6 bg-muted-foreground/30 rounded"></div>
          </ShimmerSkeleton>
        </div>

        {/* Content skeleton */}
        <CardContent className="md:w-2/3 p-6 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                <ShimmerSkeleton className="h-6 bg-muted-foreground/20 rounded w-3/4" />
                <ShimmerSkeleton className="h-4 bg-muted-foreground/20 rounded w-1/2" />
                <div className="space-y-1">
                  <ShimmerSkeleton className="h-4 bg-muted-foreground/20 rounded" />
                  <ShimmerSkeleton className="h-4 bg-muted-foreground/20 rounded w-2/3" />
                </div>
              </div>
              <ShimmerSkeleton className="h-8 w-8 bg-muted-foreground/20 rounded" />
            </div>

            {/* Progress skeleton */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShimmerSkeleton className="h-4 w-4 bg-muted-foreground/20 rounded" />
                  <ShimmerSkeleton className="h-4 w-20 bg-muted-foreground/20 rounded" />
                </div>
                <ShimmerSkeleton className="h-4 w-8 bg-muted-foreground/20 rounded" />
              </div>
              <ShimmerSkeleton className="h-2 bg-muted-foreground/20 rounded-full" />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <ShimmerSkeleton className="h-3 w-16 bg-muted-foreground/20 rounded" />
                  <ShimmerSkeleton className="h-3 w-12 bg-muted-foreground/20 rounded" />
                </div>
                <ShimmerSkeleton className="h-3 w-24 bg-muted-foreground/20 rounded" />
              </div>
            </div>

            {/* Next lesson skeleton */}
            <div className="bg-muted/50 rounded-lg p-3 space-y-2">
              <ShimmerSkeleton className="h-3 w-20 bg-muted-foreground/20 rounded" />
              <ShimmerSkeleton className="h-4 w-3/4 bg-muted-foreground/20 rounded" />
            </div>
          </div>

          {/* Actions skeleton */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <ShimmerSkeleton className="h-3 w-32 bg-muted-foreground/20 rounded" />
            <ShimmerSkeleton className="h-9 w-20 bg-muted-foreground/20 rounded" />
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
