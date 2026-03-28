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

    // Use admin client — bypasses RLS
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Step 1: Do the update
    console.log('📝 Performing update in Supabase...')
    const { data: updated, error: updateError } = await adminClient
      .from('bookings')
      .update({ status })
      .eq('id', bookingId)
      .select()
      .single()

    if (updateError) {
      console.error('❌ Supabase update error:', updateError)
      return NextResponse.json({ 
        error: updateError.message,
        hint: updateError.hint || 'Check RLS policies on the bookings table'
      }, { status: 500 })
    }

    if (!updated) {
      console.error('❌ No booking returned from update')
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    console.log('✅ Update returned by Supabase:', updated)

    // Step 2: Wait 2 seconds then do a COMPLETELY FRESH read to confirm persistence
    await new Promise(r => setTimeout(r, 2000))
    
    const { data: fresh, error: freshError } = await adminClient
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single()

    console.log('🔍 Fresh read after 2s:', { freshStatus: fresh?.status, freshError })

    if (freshError) {
      console.error('⚠️ Fresh read error (update may still have worked):', freshError)
    }

    // Return the FRESH read result so frontend knows what the actual DB state is
    return NextResponse.json({
      success: true,
      booking: fresh || updated,
      freshConfirmed: fresh?.status === status // true if update persisted
    })

  } catch (error: any) {
    console.error('❌ Unexpected error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
