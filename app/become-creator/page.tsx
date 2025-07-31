"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Users, DollarSign, BookOpen, Star, TrendingUp, Globe, Award, CheckCircle, Play } from "lucide-react"
import { gsap } from "gsap"

const creatorStats = [
  { label: "Active Creators", value: "50K+", icon: Users },
  { label: "Total Earnings", value: "$2.5M", icon: DollarSign },
  { label: "Courses Created", value: "15K+", icon: BookOpen },
  { label: "Average Rating", value: "4.8", icon: Star },
]

const benefits = [
  {
    title: "Earn While Teaching",
    description: "Set your own prices and keep up to 85% of your course revenue",
    icon: DollarSign,
  },
  {
    title: "Global Reach",
    description: "Reach students from over 190 countries worldwide",
    icon: Globe,
  },
  {
    title: "Marketing Support",
    description: "We help promote your courses through our marketing channels",
    icon: TrendingUp,
  },
  {
    title: "Creator Tools",
    description: "Access professional tools for course creation and analytics",
    icon: Award,
  },
]

const successStories = [
  {
    name: "Sarah Johnson",
    expertise: "Web Development",
    earnings: "$45K",
    students: "12,500",
    courses: 8,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "Ahmed Hassan",
    expertise: "Data Science",
    earnings: "$38K",
    students: "9,800",
    courses: 6,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "Maria Garcia",
    expertise: "Digital Marketing",
    earnings: "$52K",
    students: "15,200",
    courses: 12,
    image: "/placeholder.svg?height=100&width=100",
  },
]

export default function BecomeCreatorPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    expertise: "",
    experience: "",
    bio: "",
    website: "",
    linkedin: "",
    twitter: "",
    agreeToTerms: false,
  })

  useEffect(() => {
    gsap.fromTo(".hero-content", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" })
    gsap.fromTo(
      ".stats-card",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, delay: 0.2, ease: "power2.out" },
    )
    gsap.fromTo(
      ".benefit-card",
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.6, stagger: 0.1, delay: 0.4, ease: "power2.out" },
    )
  }, [])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.agreeToTerms) {
      alert("Please agree to the terms and conditions")
      return
    }

    // Here you would typically send the data to your backend
    console.log("Creator application submitted:", formData)

    // Set creator status in localStorage (replace with actual backend call)
    localStorage.setItem("userRole", "creator")

    // Redirect to dashboard
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="hero-content bg-gradient-to-br from-primary/10 to-secondary/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Become a <span className="text-primary">Creator</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Share your knowledge with millions of students worldwide. Create courses, build your brand, and earn money
            doing what you love.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {creatorStats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card key={index} className="stats-card text-center">
                  <CardContent className="p-6">
                    <Icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <Button size="lg" className="shadow-lg">
            <Play className="mr-2 h-5 w-5" />
            Start Your Journey
          </Button>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Our Platform?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of successful creators who are already earning and making an impact
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <Card key={index} className="benefit-card text-center">
                  <CardContent className="p-6">
                    <Icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
            <p className="text-lg text-muted-foreground">Meet some of our top-earning creators</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold">
                    {story.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{story.name}</h3>
                  <p className="text-muted-foreground mb-4">{story.expertise}</p>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-green-600">{story.earnings}</div>
                      <div className="text-xs text-muted-foreground">Earned</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold">{story.students}</div>
                      <div className="text-xs text-muted-foreground">Students</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold">{story.courses}</div>
                      <div className="text-xs text-muted-foreground">Courses</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Apply to Become a Creator</h2>
            <p className="text-lg text-muted-foreground">
              Fill out the form below and we'll review your application within 24 hours
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Creator Application</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>

                {/* Expertise */}
                <div>
                  <Label htmlFor="expertise">Area of Expertise *</Label>
                  <Select value={formData.expertise} onValueChange={(value) => handleInputChange("expertise", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your expertise" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="programming">Programming & Development</SelectItem>
                      <SelectItem value="design">Design & Creative</SelectItem>
                      <SelectItem value="business">Business & Marketing</SelectItem>
                      <SelectItem value="data-science">Data Science & Analytics</SelectItem>
                      <SelectItem value="language">Language Learning</SelectItem>
                      <SelectItem value="music">Music & Audio</SelectItem>
                      <SelectItem value="photography">Photography & Video</SelectItem>
                      <SelectItem value="health">Health & Fitness</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Experience Level */}
                <div>
                  <Label htmlFor="experience">Teaching/Industry Experience *</Label>
                  <Select value={formData.experience} onValueChange={(value) => handleInputChange("experience", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Less than 1 year</SelectItem>
                      <SelectItem value="intermediate">1-3 years</SelectItem>
                      <SelectItem value="experienced">3-5 years</SelectItem>
                      <SelectItem value="expert">5+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Bio */}
                <div>
                  <Label htmlFor="bio">Tell us about yourself *</Label>
                  <Textarea
                    id="bio"
                    placeholder="Describe your background, experience, and what you'd like to teach..."
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <Separator />

                {/* Social Links */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Social Links (Optional)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        placeholder="https://yourwebsite.com"
                        value={formData.website}
                        onChange={(e) => handleInputChange("website", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        placeholder="https://linkedin.com/in/yourprofile"
                        value={formData.linkedin}
                        onChange={(e) => handleInputChange("linkedin", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="twitter">Twitter</Label>
                      <Input
                        id="twitter"
                        placeholder="https://twitter.com/yourusername"
                        value={formData.twitter}
                        onChange={(e) => handleInputChange("twitter", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Terms Agreement */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the{" "}
                    <a href="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </a>
                  </Label>
                </div>

                <Button type="submit" size="lg" className="w-full">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Submit Application
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
