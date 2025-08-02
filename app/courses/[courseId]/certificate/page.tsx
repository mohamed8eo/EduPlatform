"use client"

import { useEffect, useRef, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Award, Download, Share2, Calendar, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import { gsap } from "gsap"

export default function CertificatePage() {
  const params = useParams()
  const courseId = params.courseId as string
  const certificateRef = useRef<HTMLDivElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  // Mock certificate data
  const certificateData = {
    studentName: "John Doe",
    courseName: "Complete Web Development Bootcamp",
    completionDate: "December 15, 2023",
    instructor: "John Smith",
    certificateId: "EDU-2023-WD-001234",
    duration: "40 hours",
    grade: "A+",
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".certificate-container",
        { opacity: 0, scale: 0.9, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 1, ease: "power2.out" },
      )

      gsap.fromTo(
        ".certificate-content",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.3, stagger: 0.1, ease: "power2.out" },
      )
    })

    return () => ctx.revert()
  }, [])

  const handleDownload = async () => {
    setIsGenerating(true)
    // Simulate certificate generation
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsGenerating(false)
    // Here you would trigger the actual download
  }

  const handleShare = async () => {
    const shareData = {
      title: `${certificateData.studentName}'s Certificate`,
      text: `I just completed ${certificateData.courseName}!`,
      url: window.location.href,
    }

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData)
        toast.success('Certificate shared successfully!')
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(window.location.href)
        toast.success('Certificate URL copied to clipboard!')
      }
    } catch (error) {
      console.error('Error sharing certificate:', error)
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href)
        toast.success('Certificate URL copied to clipboard!')
      } catch (clipboardError) {
        console.error('Clipboard error:', clipboardError)
        toast.error('Failed to share certificate')
      }
    }
  }

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Award className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Certificate of Completion</h1>
          <p className="text-xl text-muted-foreground">Congratulations on completing your course!</p>
        </div>

        {/* Certificate */}
        <div className="certificate-container mb-8">
          <Card className="overflow-hidden shadow-2xl border-2 border-primary/20">
            <CardContent className="p-0">
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-12 text-center">
                {/* Certificate Header */}
                <div className="certificate-content mb-8">
                  <div className="flex items-center justify-center mb-6">
                    <div className="bg-primary/20 p-4 rounded-full">
                      <Award className="h-16 w-16 text-primary" />
                    </div>
                  </div>
                  <h2 className="text-4xl font-bold text-primary mb-2">Certificate of Completion</h2>
                  <div className="w-24 h-1 bg-primary mx-auto"></div>
                </div>

                {/* Certificate Body */}
                <div className="certificate-content space-y-6">
                  <p className="text-lg text-muted-foreground">This is to certify that</p>

                  <h3 className="text-3xl font-bold text-foreground border-b-2 border-primary/30 pb-2 inline-block">
                    {certificateData.studentName}
                  </h3>

                  <p className="text-lg text-muted-foreground">has successfully completed</p>

                  <h4 className="text-2xl font-semibold text-primary">{certificateData.courseName}</h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                    <div className="text-center">
                      <Calendar className="h-6 w-6 text-primary mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Completion Date</p>
                      <p className="font-semibold">{certificateData.completionDate}</p>
                    </div>
                    <div className="text-center">
                      <CheckCircle className="h-6 w-6 text-primary mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="font-semibold">{certificateData.duration}</p>
                    </div>
                    <div className="text-center">
                      <Award className="h-6 w-6 text-primary mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Grade</p>
                      <p className="font-semibold">{certificateData.grade}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-8 border-t border-primary/20">
                    <div className="text-left">
                      <p className="text-sm text-muted-foreground">Instructor</p>
                      <p className="font-semibold">{certificateData.instructor}</p>
                    </div>
                    <div className="text-center">
                      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                        <Award className="h-12 w-12 text-primary" />
                      </div>
                      <p className="text-xs text-muted-foreground">EduPlatform Seal</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Certificate ID</p>
                      <p className="font-mono text-sm">{certificateData.certificateId}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="certificate-content flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={handleDownload} disabled={isGenerating} className="min-w-[200px]">
            <Download className="mr-2 h-4 w-4" />
            {isGenerating ? "Generating PDF..." : "Download Certificate"}
          </Button>
          <Button size="lg" variant="outline" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share Certificate
          </Button>
        </div>

        {/* Certificate Info */}
        <div className="certificate-content mt-12 text-center">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Certificate Verification</h3>
              <p className="text-muted-foreground mb-4">
                This certificate can be verified using the certificate ID:{" "}
                <span className="font-mono font-semibold">{certificateData.certificateId}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Visit our verification portal to confirm the authenticity of this certificate.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
