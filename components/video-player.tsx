"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Pause, Volume2, VolumeX, Maximize, X, Settings, Share2, Clock, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface VideoPlayerProps {
  videoUrl: string
  videoType?: 'cloudinary' | 'youtube' | 'vimeo' | 'external'
  onClose?: () => void
  title?: string
  isPreview?: boolean
}

export default function VideoPlayer({ videoUrl, videoType = 'external', onClose, title, isPreview = false }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [volume, setVolume] = useState(1)
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
    }
  }, [])

  const handleMouseMove = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false)
    }, 3000)
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
      if (newVolume === 0) {
        setIsMuted(true)
      } else if (isMuted) {
        setIsMuted(false)
      }
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    if (videoRef.current) {
      videoRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: title || 'Video',
          url: videoUrl,
        })
      } else {
        await navigator.clipboard.writeText(videoUrl)
        toast.success('Video URL copied to clipboard!')
      }
    } catch (error) {
      console.error('Error sharing:', error)
      toast.error('Failed to share video')
    }
  }

  const handleWatchLater = () => {
    // Store video info in localStorage for watch later
    const watchLater = JSON.parse(localStorage.getItem('watchLater') || '[]')
    const videoInfo = {
      url: videoUrl,
      title: title || 'Video',
      type: videoType,
      timestamp: Date.now()
    }
    
    // Check if video already exists
    const exists = watchLater.find((item: any) => item.url === videoUrl)
    if (!exists) {
      watchLater.push(videoInfo)
      localStorage.setItem('watchLater', JSON.stringify(watchLater))
      toast.success('Added to watch later!')
    } else {
      toast.info('Video already in watch later list')
    }
  }

  const getVideoSource = () => {
    if (videoType === 'youtube') {
      const videoId = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1]
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`
      }
    }
    return videoUrl
  }

  if (videoType === 'youtube') {
    const embedUrl = getVideoSource()
    return (
      <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50 p-4">
        <div className="w-full max-w-5xl relative">
          {/* Enhanced Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-t-2xl p-6 border-b border-slate-700 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Play className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">{title || 'Video Player'}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="secondary" className="bg-red-500/20 text-red-300 border-red-500/30 text-xs">
                      YouTube
                    </Badge>
                    {isPreview && (
                      <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                        <Eye className="h-3 w-3 mr-1" />
                        Preview
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleShare}
                  className="text-slate-300 hover:text-white hover:bg-slate-700/50 text-sm transition-colors"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleWatchLater}
                  className="text-slate-300 hover:text-white hover:bg-slate-700/50 text-sm transition-colors"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Watch Later
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onClose}
                  className="text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Enhanced Video Container */}
          <div className="relative bg-black rounded-b-2xl overflow-hidden shadow-2xl">
            <div className="aspect-video">
              <iframe
                src={embedUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            
            {/* Enhanced Branding */}
            <div className="absolute top-4 right-4">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-black/90 text-white border-slate-600 text-xs backdrop-blur-sm">
                  HD
                </Badge>
                <Badge variant="secondary" className="bg-red-500/90 text-white border-red-600 text-xs backdrop-blur-sm">
                  YouTube
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-5xl relative">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-t-2xl p-6 border-b border-slate-700 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <Play className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">{title || 'Video Player'}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                    Custom Player
                  </Badge>
                  {isPreview && (
                    <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                      <Eye className="h-3 w-3 mr-1" />
                      Preview
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleShare}
                className="text-slate-300 hover:text-white hover:bg-slate-700/50 text-sm transition-colors"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleWatchLater}
                className="text-slate-300 hover:text-white hover:bg-slate-700/50 text-sm transition-colors"
              >
                <Clock className="h-4 w-4 mr-2" />
                Watch Later
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Video Container */}
        <div 
          ref={containerRef} 
          className="relative bg-black rounded-b-2xl overflow-hidden shadow-2xl"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setShowControls(false)}
        >
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full aspect-video"
            controls={false}
          />
          
          {/* Enhanced Controls Overlay */}
          <div className={`absolute inset-0 transition-all duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}>
            {/* Top Controls */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-black/90 text-white border-slate-600 text-xs backdrop-blur-sm">
                  HD
                </Badge>
                {isPreview && (
                  <Badge variant="secondary" className="bg-green-500/90 text-white border-green-600 text-xs backdrop-blur-sm">
                    <Eye className="h-3 w-3 mr-1" />
                    Preview
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 backdrop-blur-sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Enhanced Center Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                variant="ghost"
                size="lg"
                onClick={togglePlay}
                className="w-16 h-16 bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-md border border-white/20 transition-all duration-200 hover:scale-110"
              >
                {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
              </Button>
            </div>

            {/* Enhanced Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-6">
              {/* Enhanced Progress Bar */}
              <div className="mb-4">
                <input
                  type="range"
                  min="0"
                  max={duration}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-2 bg-white/30 rounded-full appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(currentTime / duration) * 100}%, rgba(255, 255, 255, 0.3) ${(currentTime / duration) * 100}%, rgba(255, 255, 255, 0.3) 100%)`
                  }}
                />
              </div>

              {/* Enhanced Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={togglePlay}
                    className="text-white hover:bg-white/20 backdrop-blur-sm"
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </Button>
                  
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleMute}
                      className="text-white hover:bg-white/20 backdrop-blur-sm"
                    >
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-20 h-1.5 bg-white/30 rounded-full appearance-none cursor-pointer"
                    />
                  </div>
                  
                  <span className="text-white text-sm font-mono bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                  className="text-white hover:bg-white/20 backdrop-blur-sm"
                >
                  <Maximize className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
          border: 2px solid white;
        }
        
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  )
} 