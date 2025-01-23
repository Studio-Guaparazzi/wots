import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const origin = new URL(request.url).origin
    
    if (code) {
      const supabase = createRouteHandlerClient({ 
        cookies
      })
      
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Exchange error:', error)
        return NextResponse.redirect(`${origin}/auth/sign-in?error=exchange_failed`)
      }

      // If successful, redirect to home
      return NextResponse.redirect(`${origin}/`)
    }

    // If no code present, redirect to sign-in
    return NextResponse.redirect(`${origin}/auth/sign-in`)
  } catch (error) {
    console.error('Callback error:', error)
    // In case of error, redirect to sign-in
    return NextResponse.redirect(`${origin}/auth/sign-in?error=unknown`)
  }
}