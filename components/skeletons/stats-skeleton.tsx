"use client"

export default function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
      {[1, 2, 3].map((index) => (
        <div key={index} className="animate-pulse">
          {/* Icon skeleton */}
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 bg-muted-foreground/20 rounded"></div>
          </div>

          {/* Number skeleton */}
          <div className="h-8 bg-muted-foreground/20 rounded mb-2 w-20 mx-auto"></div>

          {/* Label skeleton */}
          <div className="h-5 bg-muted-foreground/20 rounded w-32 mx-auto"></div>
        </div>
      ))}
    </div>
  )
}
