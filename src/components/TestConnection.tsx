'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function TestConnection() {
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading')
  const supabase = createClient()

  useEffect(() => {
    async function checkConnection() {
      try {
        const { data, error } = await supabase.from('dummy_query').select('*').limit(1)
        if (error) throw error
        setStatus('connected')
      } catch (error) {
        console.error('Connection error:', error)
        setStatus('error')
      }
    }

    checkConnection()
  }, [])

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">Supabase Connection Status:</h2>
      <p className={`${
        status === 'connected' ? 'text-green-500' : 
        status === 'error' ? 'text-red-500' : 
        'text-yellow-500'
      }`}>
        {status === 'loading' ? 'Checking connection...' :
         status === 'connected' ? 'Successfully connected to Supabase!' :
         'Error connecting to Supabase'}
      </p>
    </div>
  )
}