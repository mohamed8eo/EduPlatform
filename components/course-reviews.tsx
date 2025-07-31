"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Star, ThumbsUp, ThumbsDown, Flag, MoreHorizontal } from "lucide-react"
import { gsap } from "gsap"

interface Review {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  comment: string
  date: string
  helpful: number
  notHelpful: number
  isHelpful?: boolean
  isNotHelpful?: boolean
}

interface CourseReviewsProps {
  courseId: string
  reviews: Review[]
  averageRating: number
  totalReviews: number
  canReview?: boolean
}

const mockReviews: Review[] = [
  {
    id: "1",
    userId: "user1",
    userName: "Sarah Johnson",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    comment:
      "Excellent course! The instructor explains everything clearly and the projects are very practical. I learned so much and feel confident applying these skills in real projects.",
    date: "2024-01-15",
    helpful: 12,
    notHelpful: 1,
  },
  {
    id: "2",
    userId: "user2",
    userName: "Ahmed Hassan",
    rating: 4,
    comment:
      "Great content and well-structured lessons. The only thing I'd improve is adding more advanced topics in the later sections. Overall, highly recommended!",
    date: "2024-01-10",
    helpful: 8,
    notHelpful: 0,
  },
  {
    id: "3",
    userId: "user3",
    userName: "Maria Garcia",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    comment:
      "This course exceeded my expectations. The instructor is knowledgeable and the pace is perfect for beginners. The community support is also fantastic!",
    date: "2024-01-08",
    helpful: 15,
    notHelpful: 2,
  },
  {
    id: "4",
    userId: "user4",
    userName: "John Smith",
    rating: 4,
    comment:
      "Solid course with good examples. Some sections could be more detailed, but overall it's a great learning experience. The final project was challenging and rewarding.",
    date: "2024-01-05",
    helpful: 6,
    notHelpful: 1,
  },
  {
    id: "5",
    userId: "user5",
    userName: "Lisa Chen",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    comment:
      "Amazing course! I went from complete beginner to building my own projects. The instructor's teaching style is engaging and easy to follow.",
    date: "2024-01-03",
    helpful: 20,
    notHelpful: 0,
  },
]

export default function CourseReviews({
  courseId,
  reviews = mockReviews,
  averageRating = 4.8,
  totalReviews = 3240,
  canReview = true,
}: CourseReviewsProps) {
  const [newReview, setNewReview] = useState("")
  const [newRating, setNewRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [reviewsList, setReviewsList] = useState(reviews)
  const [sortBy, setSortBy] = useState("newest")

  useEffect(() => {
    gsap.fromTo(
      ".review-item",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" },
    )
  }, [reviewsList])

  const handleSubmitReview = () => {
    if (newReview.trim() && newRating > 0) {
      const review: Review = {
        id: Date.now().toString(),
        userId: "current-user",
        userName: "You",
        rating: newRating,
        comment: newReview,
        date: new Date().toISOString().split("T")[0],
        helpful: 0,
        notHelpful: 0,
      }

      setReviewsList([review, ...reviewsList])
      setNewReview("")
      setNewRating(0)
    }
  }

  const handleHelpful = (reviewId: string, isHelpful: boolean) => {
    setReviewsList(
      reviewsList.map((review) => {
        if (review.id === reviewId) {
          if (isHelpful) {
            return {
              ...review,
              helpful: review.isHelpful ? review.helpful - 1 : review.helpful + 1,
              notHelpful: review.isNotHelpful ? review.notHelpful - 1 : review.notHelpful,
              isHelpful: !review.isHelpful,
              isNotHelpful: false,
            }
          } else {
            return {
              ...review,
              notHelpful: review.isNotHelpful ? review.notHelpful - 1 : review.notHelpful + 1,
              helpful: review.isHelpful ? review.helpful - 1 : review.helpful,
              isNotHelpful: !review.isNotHelpful,
              isHelpful: false,
            }
          }
        }
        return review
      }),
    )
  }

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= (interactive ? hoveredRating || rating : rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            } ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""}`}
            onClick={() => interactive && onRate?.(star)}
            onMouseEnter={() => interactive && setHoveredRating(star)}
            onMouseLeave={() => interactive && setHoveredRating(0)}
          />
        ))}
      </div>
    )
  }

  const getRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0]
    reviewsList.forEach((review) => {
      distribution[review.rating - 1]++
    })
    return distribution.reverse()
  }

  const ratingDistribution = getRatingDistribution()

  return (
    <div className="space-y-6">
      {/* Rating Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Student Reviews</span>
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="text-lg font-semibold">{averageRating}</span>
              <span className="text-muted-foreground">({totalReviews} reviews)</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Rating Breakdown */}
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating, index) => (
                <div key={rating} className="flex items-center space-x-3">
                  <span className="text-sm font-medium w-8">{rating}</span>
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${totalReviews > 0 ? (ratingDistribution[index] / totalReviews) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-12">{ratingDistribution[index]}</span>
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold">{averageRating}</div>
                <div className="text-muted-foreground">Course Rating</div>
                {renderStars(Math.round(averageRating))}
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-xl font-semibold">{totalReviews}</div>
                  <div className="text-sm text-muted-foreground">Total Reviews</div>
                </div>
                <div>
                  <div className="text-xl font-semibold">
                    {Math.round(((ratingDistribution[0] + ratingDistribution[1]) / totalReviews) * 100)}%
                  </div>
                  <div className="text-sm text-muted-foreground">5 & 4 Stars</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Write Review */}
      {canReview && (
        <Card>
          <CardHeader>
            <CardTitle>Write a Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Your Rating</label>
              {renderStars(newRating, true, setNewRating)}
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Your Review</label>
              <Textarea
                placeholder="Share your experience with this course..."
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                rows={4}
              />
            </div>
            <Button onClick={handleSubmitReview} disabled={!newReview.trim() || newRating === 0}>
              Submit Review
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Reviews ({reviewsList.length})</CardTitle>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border rounded px-3 py-1"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {reviewsList.map((review, index) => (
            <div key={review.id} className="review-item">
              <div className="flex items-start space-x-4">
                <Avatar>
                  <AvatarImage src={review.userAvatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {review.userName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{review.userName}</h4>
                      <div className="flex items-center space-x-2">
                        {renderStars(review.rating)}
                        <span className="text-sm text-muted-foreground">{review.date}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>

                  <p className="text-muted-foreground">{review.comment}</p>

                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleHelpful(review.id, true)}
                      className={`${review.isHelpful ? "text-green-600" : ""}`}
                    >
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      Helpful ({review.helpful})
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleHelpful(review.id, false)}
                      className={`${review.isNotHelpful ? "text-red-600" : ""}`}
                    >
                      <ThumbsDown className="h-4 w-4 mr-1" />({review.notHelpful})
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Flag className="h-4 w-4 mr-1" />
                      Report
                    </Button>
                  </div>
                </div>
              </div>
              {index < reviewsList.length - 1 && <Separator className="mt-6" />}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
