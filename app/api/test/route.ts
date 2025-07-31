import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    // Test database connection
    const userCount = await prisma.user.count()
    const categoryCount = await prisma.category.count()
    
    return NextResponse.json({
      success: true,
      message: 'Database connection working',
      stats: {
        users: userCount,
        categories: categoryCount
      }
    })
  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Database connection failed'
    }, { status: 500 })
  }
} 