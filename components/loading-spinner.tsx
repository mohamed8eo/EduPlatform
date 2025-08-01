import { Loader2 } from "lucide-react"

interface LoadingSpinnerProps {
  text?: string
  size?: "sm" | "md" | "lg"
  className?: string
}

export default function LoadingSpinner({ 
  text = "Loading...", 
  size = "md",
  className = ""
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  }

  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="flex flex-col items-center justify-center">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
        {text && (
          <p className="text-muted-foreground mt-2 text-sm">{text}</p>
        )}
      </div>
    </div>
  )
} 