"use client"

import { useState } from 'react'

interface UploadResult {
  url: string
  publicId: string
  format: string
  size: number
  width?: number
  height?: number
  duration?: number
  resourceType: string
}

export const useUpload = () => {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const uploadFile = async (file: File, type?: string): Promise<UploadResult> => {
    setIsUploading(true)
    setProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)
      if (type) {
        formData.append('type', type)
      }

      // Simulate progress (since we can't track actual upload progress with FormData)
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const result = await response.json()
      setProgress(100)
      
      return {
        url: result.url,
        publicId: result.publicId,
        format: result.format,
        size: result.size,
        width: result.width,
        height: result.height,
        duration: result.duration,
        resourceType: result.resourceType
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setIsUploading(false)
      setProgress(0)
    }
  }

  return {
    uploadFile,
    isUploading,
    progress
  }
} 