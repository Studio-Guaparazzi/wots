import AuthForm from '@/components/auth/AuthForm'
import Link from 'next/link'

export default function SignIn() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="mt-2 text-gray-600">
            Sign in to manage your business reviews
          </p>
        </div>
        
        <AuthForm view="sign-in" />

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/auth/sign-up" className="text-indigo-600 hover:text-indigo-500">
            Create one now
          </Link>
        </p>
      </div>
    </div>
  )
}