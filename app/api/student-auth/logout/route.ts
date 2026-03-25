import { NextResponse } from 'next/server'
import { signOut } from '@/lib/student-auth'

export async function POST() {
  try {
    await signOut()

    const response = NextResponse.json({ success: true })

    // Clear session cookies
    response.cookies.delete('sb-access-token')
    response.cookies.delete('sb-refresh-token')

    return response
  } catch (error) {
    console.error('Sign out error:', error)
    return NextResponse.json(
      { error: 'Failed to sign out' },
      { status: 500 }
    )
  }
}
