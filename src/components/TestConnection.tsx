'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function TestConnection() {
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading')
  const [message, setMessage] = useState<string>('')
  const supabase = createClient()

  useEffect(() => {
    async function checkConnection() {
      try {
        // First check auth connection
        const { data: { session }, error: authError } = await supabase.auth.getSession()
        if (authError) throw authError

        // Then check profiles table access
        const { data, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .limit(1)
        
        if (profileError) throw profileError

        setStatus('connected')
        setMessage(session ? 'Connected and authenticated!' : 'Connected but not authenticated')
      } catch (error) {
        console.error('Connection error:', error)
        setStatus('error')
        setMessage(error instanceof Error ? error.message : 'Connection failed')
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
         status === 'connected' ? message :
         `Error: ${message}`}
      </p>
    </div>
  )
}