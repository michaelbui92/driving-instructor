import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

// GET RAW BOOKINGS DATA
export async function GET(request: NextRequest) {
  try {
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data, error } = await adminClient
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Return RAW data - no transformation
    return NextResponse.json({
      rawFromSupabase: data,
      count: data?.length,
      sample: data?.map((b: any) => ({
        id: b.id,
        status: b.status,
        rawStatus: b.status,
        hasStatus: !!b.status,
        statusType: typeof b.status,
        statusLength: b.status?.length
      }))
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
