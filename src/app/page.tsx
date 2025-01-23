import TestConnection from '@/components/TestConnection'

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">WOTS - Word on the Street</h1>
      <TestConnection />
    </main>
  )
}