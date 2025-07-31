"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Bookmark, BookmarkCheck, Search, Filter, Clock, Play, Trash2, FolderOpen } from "lucide-react"
import { gsap } from "gsap"

const bookmarkedContent = [
  {
    id: "1",
    type: "lesson",
    courseId: "1",
    courseName: "Complete Web Development Bootcamp",
    title: "React Hooks and State Management",
    description: "Learn how to use React hooks for state management in functional components.",
    image: "/placeholder.svg?height=200&width=300",
    duration: "25 minutes",
    bookmarkedAt: "2 days ago",
    category: "Web Development",
    progress: 60,
  },
  {
    id: "2",
    type: "course",
    courseId: "2",
    courseName: "Data Science with Python",
    title: "Data Science with Python",
    description: "Master data analysis, machine learning, and visualization with Python.",
    image: "/placeholder.svg?height=200&width=300",
    duration: "35 hours",
    bookmarkedAt: "1 week ago",
    category: "Data Science",
    progress: 45,
  },
  {
    id: "3",
    type: "lesson",
    courseId: "1",
    courseName: "Complete Web Development Bootcamp",
    title: "Building REST APIs with Node.js",
    description: "Create robust REST APIs using Node.js and Express framework.",
    image: "/placeholder.svg?height=200&width=300",
    duration: "40 minutes",
    bookmarkedAt: "3 days ago",
    category: "Web Development",
    progress: 0,
  },
  {
    id: "4",
    type: "lesson",
    courseId: "2",
    courseName: "Data Science with Python",
    title: "Advanced Matplotlib Techniques",
    description: "Create stunning data visualizations with advanced Matplotlib features.",
    image: "/placeholder.svg?height=200&width=300",
    duration: "30 minutes",
    bookmarkedAt: "5 days ago",
    category: "Data Science",
    progress: 100,
  },
]

export default function BookmarksPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTab, setSelectedTab] = useState("all")
  const [filteredBookmarks, setFilteredBookmarks] = useState(bookmarkedContent)
  const pageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".bookmarks-header", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" })

      gsap.fromTo(
        ".bookmark-card",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, delay: 0.3, ease: "power2.out" },
      )
    })

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    let filtered = bookmarkedContent

    // Filter by tab
    if (selectedTab === "courses") {
      filtered = filtered.filter((item) => item.type === "course")
    } else if (selectedTab === "lessons") {
      filtered = filtered.filter((item) => item.type === "lesson")
    }

    // Filter by search
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredBookmarks(filtered)
  }, [searchTerm, selectedTab])

  const removeBookmark = (id: string) => {
    setFilteredBookmarks((prev) => prev.filter((item) => item.id !== id))
  }

  const getProgressColor = (progress: number) => {
    if (progress === 100) return "text-green-600"
    if (progress > 0) return "text-blue-600"
    return "text-muted-foreground"
  }

  const getProgressText = (progress: number) => {
    if (progress === 100) return "Completed"
    if (progress > 0) return `${progress}% complete`
    return "Not started"
  }

  return (
    <div ref={pageRef} className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="bookmarks-header mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <Bookmark className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold">My Bookmarks</h1>
          </div>
          <p className="text-xl text-muted-foreground">Keep track of your favorite courses and lessons</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <BookmarkCheck className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{bookmarkedContent.length}</p>
              <p className="text-sm text-muted-foreground">Total Bookmarks</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <FolderOpen className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{bookmarkedContent.filter((item) => item.type === "course").length}</p>
              <p className="text-sm text-muted-foreground">Courses</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Play className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{bookmarkedContent.filter((item) => item.type === "lesson").length}</p>
              <p className="text-sm text-muted-foreground">Lessons</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <TabsList className="grid w-full md:w-auto grid-cols-3">
                <TabsTrigger value="all">All Bookmarks</TabsTrigger>
                <TabsTrigger value="courses">Courses</TabsTrigger>
                <TabsTrigger value="lessons">Lessons</TabsTrigger>
              </TabsList>

              <div className="flex gap-4">
                <div className="relative flex-1 md:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search bookmarks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
            </div>

            <TabsContent value={selectedTab} className="mt-0">
              {filteredBookmarks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBookmarks.map((bookmark) => (
                    <Card key={bookmark.id} className="bookmark-card group hover:shadow-lg transition-all duration-300">
                      <div className="relative">
                        <Image
                          src={bookmark.image || "/placeholder.svg"}
                          alt={bookmark.title}
                          width={300}
                          height={200}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge variant={bookmark.type === "course" ? "default" : "secondary"}>
                            {bookmark.type === "course" ? "Course" : "Lesson"}
                          </Badge>
                        </div>
                        <div className="absolute top-4 right-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeBookmark(bookmark.id)}
                            className="bg-background/80 hover:bg-background text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        {bookmark.type === "lesson" && (
                          <Button
                            size="sm"
                            className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <CardContent className="p-6">
                        <div className="space-y-3">
                          <div>
                            <Badge variant="outline" className="text-xs mb-2">
                              {bookmark.category}
                            </Badge>
                            <h3 className="font-semibold line-clamp-2 mb-2">{bookmark.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{bookmark.description}</p>
                            {bookmark.type === "lesson" && (
                              <p className="text-xs text-muted-foreground">from {bookmark.courseName}</p>
                            )}
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">{bookmark.duration}</span>
                            </div>
                            <span className={`text-xs font-medium ${getProgressColor(bookmark.progress)}`}>
                              {getProgressText(bookmark.progress)}
                            </span>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t">
                            <span className="text-xs text-muted-foreground">Bookmarked {bookmark.bookmarkedAt}</span>
                            <Link href={`/courses/${bookmark.courseId}`}>
                              <Button size="sm" variant="outline">
                                {bookmark.type === "course" ? "View Course" : "Go to Lesson"}
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No bookmarks found</h3>
                  <p className="text-muted-foreground mb-6">
                    {searchTerm
                      ? "Try adjusting your search terms"
                      : "Start bookmarking your favorite courses and lessons"}
                  </p>
                  <Link href="/courses">
                    <Button>Browse Courses</Button>
                  </Link>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
