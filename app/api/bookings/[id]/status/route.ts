import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// UPDATE booking status
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: bookingId } = await params
    const { status } = await request.json()
    
    console.log('🔄 Status update request:', { bookingId, status })

    if (!status || !['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    // Step 1: Do the update via REST API
    console.log('📝 Performing update via Supabase REST API...')
    const updateRes = await fetch(
      `${supabaseUrl}/rest/v1/bookings?id=eq.${bookingId}`,
      {
        method: 'PATCH',
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
          'Content-Range': 'items 0-0/*',
        },
        body: JSON.stringify({ status }),
      }
    )

    if (!updateRes.ok) {
      const errText = await updateRes.text()
      console.error('❌ Supabase update failed:', updateRes.status, errText)
      return NextResponse.json({ error: `Update failed: ${errText}` }, { status: 500 })
    }

    const updated: any[] = await updateRes.json()
    console.log('✅ Supabase update result:', updated)

    if (!updated || updated.length === 0) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Step 2: Fresh read after short delay (let replication propagate)
    await new Promise(r => setTimeout(r, 1500))
    
    const freshRes = await fetch(
      `${supabaseUrl}/rest/v1/bookings?id=eq.${bookingId}&select=*`,
      {
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
        },
        cache: 'no-store',
      }
    )
    
    const fresh: any[] = await freshRes.json()
    const freshBooking = fresh?.[0]
    console.log('🔍 Fresh read:', { freshStatus: freshBooking?.status, freshError: freshRes.status !== 200 })

    return NextResponse.json({
      success: true,
      booking: freshBooking || updated[0],
      freshConfirmed: freshBooking?.status === status,
    })

  } catch (error: any) {
    console.error('❌ Unexpected error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
