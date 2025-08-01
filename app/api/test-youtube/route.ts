import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY

    if (!apiKey) {
      return NextResponse.json({ 
        error: 'YouTube API key not configured',
        message: 'Please add YOUTUBE_API_KEY to your .env.local file'
      }, { status: 500 })
    }

    // Test with a known video ID
    const testVideoId = 'dVgTBEYCseU'
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${testVideoId}&part=contentDetails&key=${apiKey}`
    )

    if (!response.ok) {
      throw new Error(`YouTube API responded with status: ${response.status}`)
    }

    const data = await response.json()

    if (data.items && data.items.length > 0) {
      const duration = data.items[0].contentDetails.duration
      
      // Convert ISO 8601 duration to seconds
      const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
      let seconds = 0
      
      if (match[1]) seconds += parseInt(match[1]) * 3600
      if (match[2]) seconds += parseInt(match[2]) * 60
      if (match[3]) seconds += parseInt(match[3])

      return NextResponse.json({ 
        success: true,
        duration: seconds,
        durationInMinutes: Math.round(seconds / 60),
        message: 'YouTube API is working correctly'
      })
    } else {
      return NextResponse.json({ 
        error: 'Video not found',
        message: 'The test video could not be found'
      }, { status: 404 })
    }
  } catch (error) {
    console.error('Error testing YouTube API:', error)
    return NextResponse.json({ 
      error: 'Failed to test YouTube API',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 