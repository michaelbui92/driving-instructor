import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    console.log('🚀 Instructor bookings API called')
    console.log('📦 Environment:', {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      timestamp: new Date().toISOString()
    })

    // Use admin client to bypass RLS
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    console.log('🔍 Querying all bookings...')
    const { data, error } = await adminClient
      .from('bookings')
      .select('*')
      .order('date', { ascending: false })

    if (error) {
      console.error('❌ Error fetching bookings:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log(`✅ Found ${data?.length || 0} bookings`)
    if (data && data.length > 0) {
      data.forEach(b => {
        console.log(`   - ${b.id}: ${b.student_name} (${b.email}) - ${b.date} - ${b.status}`)
      })
    }

    return NextResponse.json({ bookings: data })
  } catch (error: any) {
    console.error('❌ Bookings fetch error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}