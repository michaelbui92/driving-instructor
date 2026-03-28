import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Force dynamic rendering - never cache
export const dynamic = 'force-dynamic'

// GET ALL BOOKINGS — reads directly from Supabase REST API
export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    // Use direct REST API call — bypasses Supabase JS client connection pooling
    // This avoids any stale reads from connection pools on serverless
    const url = `${supabaseUrl}/rest/v1/bookings?select=*&order=created_at.desc`
    
    const response = await fetch(url, {
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        ' Prefer': 'return=representation',
      },
      // Ensure fresh fetch on every call
      cache: 'no-store',
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('❌ Supabase REST API error:', response.status, errText)
      return NextResponse.json({ error: 'Database read failed' }, { status: 500 })
    }

    const data: any[] = await response.json()

    // Debug: log raw data statuses
    const statuses = data.map((b: any) => ({ id: b.id.substring(0, 8), status: b.status }))
    console.log(`📤 GET /api/bookings → ${data.length} bookings:`, JSON.stringify(statuses))

    // Format for frontend — include ALL fields both portals need
    const bookings = data.map((b: any) => {
      let price = 45
      if (b.lesson_type === 'single') price = 55
      else if (b.lesson_type === 'package10') price = 45 * 10
      else if (b.lesson_type === 'package20') price = 45 * 20
      else if (b.lesson_type === 'test') price = 55

      return {
        id: b.id,
        studentName: b.student_name || '',
        email: b.email || '',
        phone: b.phone || '',
        date: b.date || '',
        time: b.time || '',
        lessonType: b.lesson_type || 'casual',
        status: b.status || 'pending',
        price,
        createdAt: b.created_at || new Date().toISOString(),
        archived: b.archived || false,
        originalDate: b.original_date || null,
        previousDate: b.previous_date || null,
        rescheduleHistory: b.reschedule_history || [],
        packageId: b.package_id || null,
        claimCode: b.claim_code || null,
      }
    })

    const nextResponse = NextResponse.json({ bookings })
    
    // No cache
    nextResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    nextResponse.headers.set('Pragma', 'no-cache')
    
    return nextResponse
  } catch (error: any) {
    console.error('Bookings API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
