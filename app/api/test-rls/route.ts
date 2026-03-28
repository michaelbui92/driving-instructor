import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    console.log('🔍 RLS Test:', {
      supabaseUrl: supabaseUrl?.substring(0, 50) + '...',
      anonKeyLength: anonKey?.length,
      serviceKeyLength: serviceKey?.length,
      hasAnonKey: !!anonKey,
      hasServiceKey: !!serviceKey
    })

    // Test 1: Anon client (should fail with RLS enabled)
    const anonClient = createClient(supabaseUrl, anonKey)
    const { data: anonData, error: anonError } = await anonClient
      .from('bookings')
      .select('count')
      .limit(1)

    // Test 2: Service role client (should work even with RLS)
    const serviceClient = createClient(supabaseUrl, serviceKey)
    const { data: serviceData, error: serviceError } = await serviceClient
      .from('bookings')
      .select('count')
      .limit(1)

    // Test 3: Try to update a booking with service role
    let updateTest = { success: false, error: null }
    try {
      // Get first booking ID
      const { data: firstBooking } = await serviceClient
        .from('bookings')
        .select('id, status')
        .limit(1)
        .single()

      if (firstBooking) {
        const { error: updateError } = await serviceClient
          .from('bookings')
          .update({ status: 'pending' }) // Just set to same status
          .eq('id', firstBooking.id)

        updateTest = {
          success: !updateError,
          error: updateError?.message
        }
      }
    } catch (updateErr) {
      updateTest.error = (updateErr as Error).message
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: {
        hasSupabaseUrl: !!supabaseUrl,
        hasAnonKey: !!anonKey,
        hasServiceKey: !!serviceKey
      },
      anonClientTest: {
        success: !anonError,
        error: anonError?.message,
        data: anonData
      },
      serviceClientTest: {
        success: !serviceError,
        error: serviceError?.message,
        data: serviceData
      },
      updateTest,
      conclusion: serviceError 
        ? '❌ Service role key cannot bypass RLS. Check RLS policies on bookings table.'
        : '✅ Service role key can bypass RLS. The issue is elsewhere.'
    })
  } catch (error: any) {
    console.error('RLS test error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
