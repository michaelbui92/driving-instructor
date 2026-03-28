import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

// COMPARE ANON VS SERVICE ROLE CLIENTS
export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    
    const anonClient = createClient(supabaseUrl, anonKey)
    const serviceClient = createClient(supabaseUrl, serviceKey)
    
    // Query with BOTH clients
    const [anonResult, serviceResult] = await Promise.all([
      anonClient.from('bookings').select('*', { count: 'exact' }).order('created_at', { ascending: false }),
      serviceClient.from('bookings').select('*', { count: 'exact' }).order('created_at', { ascending: false })
    ])
    
    const anonData = anonResult.data || []
    const serviceData = serviceResult.data || []
    
    // Find differences
    const anonIds = new Set(anonData.map((b: any) => b.id))
    const serviceIds = new Set(serviceData.map((b: any) => b.id))
    
    const missingInService = anonData.filter((b: any) => !serviceIds.has(b.id))
    const missingInAnon = serviceData.filter((b: any) => !anonIds.has(b.id))
    
    // Check status differences for same bookings
    const statusDifferences = []
    for (const aBooking of anonData) {
      const sBooking = serviceData.find((b: any) => b.id === aBooking.id)
      if (sBooking && aBooking.status !== sBooking.status) {
        statusDifferences.push({
          id: aBooking.id.substring(0, 8),
          anonStatus: aBooking.status,
          serviceStatus: sBooking.status
        })
      }
    }
    
    return NextResponse.json({
      summary: {
        anonCount: anonResult.count,
        anonReturned: anonData.length,
        serviceCount: serviceResult.count,
        serviceReturned: serviceData.length,
        sameCount: anonData.length === serviceData.length
      },
      differences: {
        missingInService: missingInService.map((b: any) => ({
          id: b.id.substring(0, 8),
          status: b.status,
          created_at: b.created_at
        })),
        missingInAnon: missingInAnon.map((b: any) => ({
          id: b.id.substring(0, 8),
          status: b.status,
          created_at: b.created_at
        })),
        statusDifferences
      },
      anonBookings: anonData.map((b: any) => ({
        id: b.id.substring(0, 8),
        status: b.status,
        created_at: b.created_at
      })),
      serviceBookings: serviceData.map((b: any) => ({
        id: b.id.substring(0, 8),
        status: b.status,
        created_at: b.created_at
      }))
    })
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
