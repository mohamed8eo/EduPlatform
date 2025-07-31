"use client"

import { useEffect, useRef } from "react"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock, Play } from "lucide-react"
import { gsap } from "gsap"

interface CourseProgressBarProps {
  progress: number
  totalLessons: number
  completedLessons: number
  timeSpent?: string
  lastAccessed?: string
  animate?: boolean
}

export default function CourseProgressBar({
  progress,
  totalLessons,
  completedLessons,
  timeSpent,
  lastAccessed,
  animate = true,
}: CourseProgressBarProps) {
  const progressRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!animate) return

    const ctx = gsap.context(() => {
      // Animate progress bar fill
      gsap.fromTo(
        ".progress-fill",
        { width: "0%" },
        { width: `${progress}%`, duration: 1.5, ease: "power2.out", delay: 0.3 },
      )

      // Animate stats
      gsap.fromTo(
        ".progress-stat",
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, delay: 0.5, ease: "power2.out" },
      )
    })

    return () => ctx.revert()
  }, [progress, animate])

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return "bg-green-500"
    if (progress >= 75) return "bg-blue-500"
    if (progress >= 50) return "bg-yellow-500"
    if (progress >= 25) return "bg-orange-500"
    return "bg-red-500"
  }

  const getProgressStatus = (progress: number) => {
    if (progress >= 100) return { text: "Completed", icon: CheckCircle, color: "text-green-600" }
    if (progress >= 75) return { text: "Almost Done", icon: Play, color: "text-blue-600" }
    if (progress >= 25) return { text: "In Progress", icon: Play, color: "text-yellow-600" }
    return { text: "Just Started", icon: Play, color: "text-orange-600" }
  }

  const status = getProgressStatus(progress)
  const StatusIcon = status.icon

  return (
    <div ref={progressRef} className="space-y-3">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <StatusIcon className={`h-4 w-4 ${status.color}`} />
            <span className={`text-sm font-medium ${status.color}`}>{status.text}</span>
          </div>
          <span className="text-sm font-semibold">{Math.round(progress)}%</span>
        </div>

        <div className="relative">
          <Progress value={progress} className="h-2" />
          <div
            className={`progress-fill absolute top-0 left-0 h-2 rounded-full ${getProgressColor(progress)} transition-all duration-300`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div ref={statsRef} className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="progress-stat flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <CheckCircle className="h-3 w-3" />
            <span>
              {completedLessons}/{totalLessons} lessons
            </span>
          </div>
          {timeSpent && (
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{timeSpent}</span>
            </div>
          )}
        </div>
        {lastAccessed && (
          <div className="progress-stat">
            <span>Last accessed: {lastAccessed}</span>
          </div>
        )}
      </div>
    </div>
  )
}
