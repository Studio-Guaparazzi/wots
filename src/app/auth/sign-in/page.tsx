import AuthForm from '@/components/auth/AuthForm'

export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <AuthForm view="sign-in" />
    </div>
  )
}