import TestConnection from '@/components/TestConnection'

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome to Word on the Street</h1>
      <p className="text-gray-600">
        Discover and connect with local businesses in your area.
      </p>
      <TestConnection />
    </div>
  )
}