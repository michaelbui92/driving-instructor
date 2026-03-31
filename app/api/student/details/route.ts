import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

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

    // Use admin client to get student details - use email as primary key since auth_user_id can be unreliable
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    let { data: student, error: findError } = await adminClient
      .from('students')
      .select('*')
      .eq('email', user.email)
      .single()

    console.log('GET /api/student/details - user email:', user.email, 'found student:', student, 'error:', findError)

    // If no student record, create one
    if (!student) {
      const { data: newStudent, error: createError } = await adminClient
        .from('students')
        .insert({ 
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

    // Use admin client to update student details - use email as primary key
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    console.log('PUT /api/student/details - user email:', user.email)

    // Check if student exists by email
    let { data: student, error: findError } = await adminClient
      .from('students')
      .select('id, email')
      .eq('email', user.email)
      .single()

    if (findError) {
      console.error('Error finding student:', findError)
    }

    if (!student) {
      // Create student record with details
      console.log('Creating new student record for email:', user.email)
      const { data: newStudent, error: createError } = await adminClient
        .from('students')
        .insert({ 
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
        return NextResponse.json({ error: 'Failed to create student record: ' + createError.message }, { status: 500 })
      }

      console.log('Created student record:', newStudent)
      return NextResponse.json({ success: true, hasCompletedDetails: true })
    }

    // Update existing student by email
    console.log('Updating student by email:', user.email, 'with:', { fullName, phone, address })
    const { error: updateError } = await adminClient
      .from('students')
      .update({ 
        full_name: fullName,
        phone: phone,
        address: address,
        has_completed_details: true,
      })
      .eq('email', user.email)

    if (updateError) {
      console.error('Error updating student:', updateError)
      return NextResponse.json({ error: 'Failed to update details: ' + updateError.message }, { status: 500 })
    }

    // Verify the update
    const { data: verifyData } = await adminClient
      .from('students')
      .select('full_name, phone, address, email')
      .eq('email', user.email)
      .single()
    console.log('Verification after update:', verifyData)

    return NextResponse.json({ success: true, hasCompletedDetails: true })
  } catch (error: any) {
    console.error('Student details update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
