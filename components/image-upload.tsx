"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, Image, Cloud } from "lucide-react"
import { useUpload } from "@/hooks/use-upload"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"

interface ImageData {
  type: 'file' | 'url'
  file?: File
  url?: string
  provider?: 'cloudinary'
  cloudinaryData?: {
    url: string
    publicId: string
    format: string
    size: number
    width?: number
    height?: number
    resourceType: string
  }
}

interface ImageUploadProps {
  onImageChange: (imageData: ImageData | null) => void
  currentImage?: ImageData | null
  label?: string
  description?: string
}

export default function ImageUpload({ 
  onImageChange, 
  currentImage, 
  label = "Upload Image",
  description = "Upload image file (JPEG, PNG, WebP - Max 10MB)"
}: ImageUploadProps) {
  const [fileName, setFileName] = useState(currentImage?.file?.name || '')
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const { uploadFile, isUploading, progress } = useUpload()

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFileName(file.name)
      
      try {
        // Upload to Cloudinary immediately
        const cloudinaryResult = await uploadFile(file, 'image')
        
        onImageChange({ 
          type: 'file', 
          file,
          url: cloudinaryResult.url,
          provider: 'cloudinary',
          cloudinaryData: cloudinaryResult
        })
        
        toast.success('Image uploaded successfully!')
      } catch (error) {
        console.error('Upload failed:', error)
        toast.error(error instanceof Error ? error.message : 'Upload failed')
      }
    }
  }

  const clearImage = () => {
    setFileName('')
    onImageChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{label}</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <Image className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                {description}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-2"
              >
                <Cloud className="h-4 w-4" />
                {isUploading ? 'Uploading...' : 'Choose Image File'}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
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
                <Button variant="ghost" size="sm" onClick={clearImage}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {currentImage && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Current Image:</p>
              {currentImage.url && (
                <div className="relative">
                  <img 
                    src={currentImage.url} 
                    alt="Preview" 
                    className="w-full h-32 object-cover rounded border"
                  />
                </div>
              )}
              <div className="text-xs text-muted-foreground space-y-1">
                <p>File: {currentImage.type === 'file' ? fileName : 'URL'}</p>
                {currentImage.provider && (
                  <p>Provider: {currentImage.provider}</p>
                )}
                {currentImage.cloudinaryData && (
                  <>
                    <p>Format: {currentImage.cloudinaryData.format}</p>
                    <p>Size: {(currentImage.cloudinaryData.size / 1024 / 1024).toFixed(2)} MB</p>
                    {currentImage.cloudinaryData.width && currentImage.cloudinaryData.height && (
                      <p>Resolution: {currentImage.cloudinaryData.width}x{currentImage.cloudinaryData.height}</p>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 