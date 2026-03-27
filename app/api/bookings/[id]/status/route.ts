import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { revalidateTag } from 'next/cache'

// SIMPLE: Update booking status
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = params.id
    const body = await request.json()
    const { status } = body
    
    console.log('🔄 Status update request:', { bookingId, status, body })

    if (!status || !['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      console.error('❌ Invalid status:', status)
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Use admin client
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    console.log('📝 Updating booking status:', { bookingId, status })
    
    const { data, error } = await adminClient
      .from('bookings')
      .update({ status })
      .eq('id', bookingId)
      .select()

    if (error) {
      console.error('❌ Error updating booking status:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Revalidate the bookings cache so Next.js fetches fresh data
    revalidateTag('bookings')

    console.log('✅ Status updated successfully:', { bookingId, newStatus: status })
    return NextResponse.json({ success: true, booking: data[0] })
  } catch (error: any) {
    console.error('❌ Booking status update error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}