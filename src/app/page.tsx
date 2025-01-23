import AuthStatus from '@/components/auth/AuthStatus'
import TestConnection from '@/components/TestConnection'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">WOTS - Word on the Street</h1>
      
      <AuthStatus />
      
      <div className="space-x-4 my-4">
        <Link 
          href="/auth/sign-in" 
          className="text-indigo-600 hover:text-indigo-500"
        >
          Sign In
        </Link>
        <Link 
          href="/auth/sign-up"
          className="text-indigo-600 hover:text-indigo-500"
        >
          Sign Up
        </Link>
        <Link 
          href="/profile"
          className="text-indigo-600 hover:text-indigo-500"
        >
          Edit Profile
        </Link>
      </div>

      <TestConnection />
    </main>
  )
}