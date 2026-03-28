import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

// TEST: Create and query a brand new table
export async function GET(request: NextRequest) {
  try {
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    // Try to create test table if it doesn't exist
    // (This might fail without proper permissions)
    
    // Insert a test row
    const testRow = {
      test_id: `test_${Date.now()}`,
      test_status: 'active',
      created_at: new Date().toISOString()
    }
    
    const { data: insertData, error: insertError } = await adminClient
      .from('test_table_2')
      .insert([testRow])
      .select()
    
    if (insertError) {
      console.log('Insert error (table might not exist):', insertError.message)
      
      // Try to query whatever we can
      const { data: allTables } = await adminClient
        .from('test_table_2')
        .select('*')
        .limit(5)
      
      return NextResponse.json({
        message: 'Test table might not exist',
        insertError: insertError.message,
        existingData: allTables || []
      })
    }
    
    // Query immediately after insert
    const { data: queryData, error: queryError, count } = await adminClient
      .from('test_table_2')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
    
    return NextResponse.json({
      test: 'New table consistency test',
      inserted: insertData,
      queried: queryData,
      count,
      queryError: queryError?.message,
      consistency: insertData && queryData 
        ? `Inserted ${insertData.length}, Queried ${queryData.length}, Count: ${count}`
        : 'Cannot compare'
    })
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
