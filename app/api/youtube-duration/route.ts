import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const videoId = searchParams.get('videoId')
    
    if (!videoId) {
      return NextResponse.json({ error: 'Video ID is required' }, { status: 400 })
    }

    const apiKey = process.env.YOUTUBE_API_KEY
    
    if (!apiKey) {
      return NextResponse.json({ 
        error: 'YouTube API key not configured',
        message: 'Please add YOUTUBE_API_KEY to your .env.local file. Get your API key from: https://console.cloud.google.com/apis/credentials'
      }, { status: 500 })
    }

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=${apiKey}`
    )

    if (!response.ok) {
      throw new Error(`YouTube API responded with status: ${response.status}`)
    }

    const data = await response.json()

    if (data.items && data.items.length > 0) {
      const duration = data.items[0].contentDetails.duration
      
      // Parse ISO 8601 duration format (e.g., PT4M30S)
      const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
      let seconds = 0
      
      if (match[1]) seconds += parseInt(match[1]) * 3600
      if (match[2]) seconds += parseInt(match[2]) * 60
      if (match[3]) seconds += parseInt(match[3])

      return NextResponse.json({ duration: seconds })
    } else {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }
  } catch (error) {
    console.error('Error fetching YouTube duration:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch video duration',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 