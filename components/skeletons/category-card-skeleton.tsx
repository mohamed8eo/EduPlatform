"use client"

interface CategoryCardSkeletonProps {
  size?: "large" | "medium" | "small"
}

export default function CategoryCardSkeleton({ size = "medium" }: CategoryCardSkeletonProps) {
  const gridClasses = {
    large: "md:col-span-2 md:row-span-2",
    medium: "md:col-span-2 md:row-span-1",
    small: "md:col-span-1 md:row-span-1",
  }

  return (
    <div
      className={`animate-pulse relative overflow-hidden rounded-2xl ${gridClasses[size]} min-h-[200px] bg-muted-foreground/20`}
    >
      {/* Content skeleton */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="h-6 bg-white/30 rounded mb-2 w-3/4"></div>
        <div className="h-4 bg-white/20 rounded mb-2 w-full"></div>
        <div className="h-3 bg-white/20 rounded w-1/2"></div>
      </div>
    </div>
  )
}
