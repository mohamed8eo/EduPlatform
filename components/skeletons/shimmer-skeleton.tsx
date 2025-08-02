"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

interface ShimmerSkeletonProps {
  className?: string
  children?: React.ReactNode
}

export default function ShimmerSkeleton({ className = "", children }: ShimmerSkeletonProps) {
  const shimmerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const shimmer = shimmerRef.current
    if (!shimmer) return

    // Create shimmer animation
    const tl = gsap.timeline({ repeat: -1 })

    tl.fromTo(
      shimmer,
      {
        backgroundPosition: "-200px 0",
      },
      {
        backgroundPosition: "calc(200px + 100%) 0",
        duration: 1.5,
        ease: "power2.inOut",
      },
    )

    return () => {
      tl.kill()
    }
  }, [])

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        ref={shimmerRef}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        style={{
          backgroundSize: "200px 100%",
          backgroundRepeat: "no-repeat",
        }}
      />
      {children}
    </div>
  )
}
