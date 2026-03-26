import { NextRequest, NextResponse } from 'next/server'

// Show environment info (no secrets)
export async function GET(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY
  const serviceKeyLength = process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0
  
  return NextResponse.json({
    environment: {
      supabaseUrl,
      hasServiceKey,
      serviceKeyLength,
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV,
      timestamp: new Date().toISOString()
    },
    note: 'This shows which Supabase URL the API is connecting to'
  })
}