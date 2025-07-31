"use client"

export default function SectionHeaderSkeleton() {
  return (
    <div className="text-center mb-16 animate-pulse">
      {/* Badge and icon skeleton */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="h-6 w-6 bg-muted-foreground/20 rounded"></div>
        <div className="h-6 w-16 bg-muted-foreground/20 rounded-full"></div>
      </div>

      {/* Title skeleton */}
      <div className="h-10 bg-muted-foreground/20 rounded mb-4 w-1/2 mx-auto"></div>

      {/* Description skeleton */}
      <div className="space-y-2 max-w-2xl mx-auto">
        <div className="h-6 bg-muted-foreground/20 rounded"></div>
        <div className="h-6 bg-muted-foreground/20 rounded w-3/4 mx-auto"></div>
      </div>
    </div>
  )
}
