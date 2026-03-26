import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('sb-access-token')?.value

    if (!accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: { headers: { Authorization: `Bearer ${accessToken}` } },
      }
    )

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    // Use admin client to get student details
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    let { data: student } = await adminClient
      .from('students')
      .select('*')
      .eq('auth_user_id', user.id)
      .single()

    // If no student record, create one
    if (!student) {
      const { data: newStudent, error: createError } = await adminClient
        .from('students')
        .insert({ 
          auth_user_id: user.id, 
          email: user.email,
          has_completed_details: false,
        } as any)
        .select()
        .single()

      if (createError) {
        console.error('Error creating student:', createError)
        return NextResponse.json({ error: 'Failed to create student record' }, { status: 500 })
      }

      student = newStudent
    }

    // Check if details are complete
    const hasDetails = !!(student.full_name && student.phone && student.address)

    return NextResponse.json({
      id: student.id,
      email: student.email,
      fullName: student.full_name || '',
      phone: student.phone || '',
      address: student.address || '',
      hasCompletedDetails: hasDetails,
    })
  } catch (error: any) {
    console.error('Student details error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('sb-access-token')?.value

    if (!accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: { headers: { Authorization: `Bearer ${accessToken}` } },
      }
    )

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    const { fullName, phone, address } = await request.json()

    if (!fullName || !phone || !address) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    // Use admin client to update student details
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Check if student exists
    let { data: student } = await adminClient
      .from('students')
      .select('id')
      .eq('auth_user_id', user.id)
      .single()

    if (!student) {
      // Create student record with details
      const { data: newStudent, error: createError } = await adminClient
        .from('students')
        .insert({ 
          auth_user_id: user.id, 
          email: user.email,
          full_name: fullName,
          phone: phone,
          address: address,
          has_completed_details: true,
        } as any)
        .select()
        .single()

      if (createError) {
        console.error('Error creating student:', createError)
        return NextResponse.json({ error: 'Failed to create student record' }, { status: 500 })
      }

      return NextResponse.json({ success: true, hasCompletedDetails: true })
    }

    // Update existing student
    const { error: updateError } = await adminClient
      .from('students')
      .update({ 
        full_name: fullName,
        phone: phone,
        address: address,
        has_completed_details: true,
      })
      .eq('auth_user_id', user.id)

    if (updateError) {
      console.error('Error updating student:', updateError)
      return NextResponse.json({ error: 'Failed to update details' }, { status: 500 })
    }

    return NextResponse.json({ success: true, hasCompletedDetails: true })
  } catch (error: any) {
    console.error('Student details update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
