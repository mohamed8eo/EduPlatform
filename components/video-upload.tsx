"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Link, Play, X, FileVideo, Cloud } from "lucide-react"
import { useUpload } from "@/hooks/use-upload"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"

interface VideoData {
  type: 'file' | 'url'
  file?: File
  url?: string
  provider?: 'cloudinary' | 'youtube' | 'vimeo'
  cloudinaryData?: {
    url: string
    publicId: string
    format: string
    size: number
    width?: number
    height?: number
    duration?: number
    resourceType: string
  }
}

interface VideoUploadProps {
  onVideoChange: (videoData: VideoData | null) => void
  currentVideo?: VideoData | null
}

export default function VideoUpload({ onVideoChange, currentVideo }: VideoUploadProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload')
  const [url, setUrl] = useState(currentVideo?.url || '')
  const [fileName, setFileName] = useState(currentVideo?.file?.name || '')
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const { uploadFile, isUploading, progress } = useUpload()

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFileName(file.name)
      
      try {
        // Upload to Cloudinary immediately
        const cloudinaryResult = await uploadFile(file, 'video')
        
        console.log('Cloudinary upload result:', cloudinaryResult)
        console.log('Duration from Cloudinary:', cloudinaryResult.duration)
        
        onVideoChange({ 
          type: 'file', 
          file,
          url: cloudinaryResult.url,
          provider: 'cloudinary',
          cloudinaryData: cloudinaryResult
        })
        
        toast.success('Video uploaded successfully!')
      } catch (error) {
        console.error('Upload failed:', error)
        toast.error(error instanceof Error ? error.message : 'Upload failed')
      }
    }
  }

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const videoUrl = event.target.value
    setUrl(videoUrl)
    if (videoUrl) {
      const provider = getVideoProvider(videoUrl)
      onVideoChange({ 
        type: 'url', 
        url: videoUrl,
        provider
      })
    }
  }

  const getVideoProvider = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube'
    if (url.includes('vimeo.com')) return 'vimeo'
    if (url.includes('cloudinary.com')) return 'cloudinary'
    return 'external'
  }

  const clearVideo = () => {
    setUrl('')
    setFileName('')
    onVideoChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const isValidYouTubeUrl = (url: string) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/
    return youtubeRegex.test(url)
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'upload' | 'url')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Cloud className="h-4 w-4" />
              Upload to Cloud
            </TabsTrigger>
            <TabsTrigger value="url" className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              Video URL
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <div className="space-y-2">
              <Label>Upload Video to Cloudinary</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <FileVideo className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Upload video file (MP4, MOV, AVI - Max 500MB)
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? 'Uploading...' : 'Choose Video File'}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
              
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading to Cloudinary...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}
              
              {fileName && !isUploading && (
                <div className="flex items-center justify-between p-2 bg-muted rounded">
                  <span className="text-sm truncate">{fileName}</span>
                  <Button variant="ghost" size="sm" onClick={clearVideo}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="url" className="space-y-4">
            <div className="space-y-2">
              <Label>Video URL (YouTube, Vimeo, etc.)</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={url}
                  onChange={handleUrlChange}
                />
                {url && (
                  <Button variant="ghost" size="sm" onClick={clearVideo}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {url && isValidYouTubeUrl(url) && (
                <div className="p-2 bg-green-50 border border-green-200 rounded">
                  <p className="text-sm text-green-700 flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    Valid YouTube URL detected
                  </p>
                </div>
              )}
              {url && !isValidYouTubeUrl(url) && (
                <div className="p-2 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-sm text-yellow-700">
                    This doesn't look like a YouTube URL. Other video platforms may work.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {currentVideo && (
          <div className="mt-4 p-3 bg-muted rounded">
            <p className="text-sm font-medium">Current Video:</p>
            <p className="text-sm text-muted-foreground">
              {currentVideo.type === 'file' ? fileName : currentVideo.url}
            </p>
            {currentVideo.provider && (
              <p className="text-xs text-blue-600 mt-1">
                Provider: {currentVideo.provider}
              </p>
            )}
            {currentVideo.cloudinaryData && (
              <div className="mt-2 text-xs text-muted-foreground space-y-1">
                <p>Format: {currentVideo.cloudinaryData.format}</p>
                <p>Size: {(currentVideo.cloudinaryData.size / 1024 / 1024).toFixed(2)} MB</p>
                {currentVideo.cloudinaryData.duration && (
                  <p>Duration: {Math.round(currentVideo.cloudinaryData.duration)}s</p>
                )}
                {currentVideo.cloudinaryData.width && currentVideo.cloudinaryData.height && (
                  <p>Resolution: {currentVideo.cloudinaryData.width}x{currentVideo.cloudinaryData.height}</p>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 