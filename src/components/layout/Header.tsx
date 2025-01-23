'use client'

import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Menu } from 'lucide-react'
import { User } from '@supabase/supabase-js'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setIsMenuOpen(false)
  }

  return (
    <header className="bg-white shadow">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              WOTS
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link href="/discover" className="text-base font-medium text-gray-500 hover:text-gray-900">
              Discover
            </Link>
            <Link href="/services" className="text-base font-medium text-gray-500 hover:text-gray-900">
              Services
            </Link>
            <Link href="/about" className="text-base font-medium text-gray-500 hover:text-gray-900">
              About
            </Link>
            <Link href="/reviews" className="text-base font-medium text-gray-500 hover:text-gray-900">
              Reviews
            </Link>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none"
            >
              <span className="sr-only">Open user menu</span>
              {user ? (
                <span className="text-sm font-medium">{user.email?.[0].toUpperCase()}</span>
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                {user ? (
                  <>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/sign-in"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/sign-up"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Navigation Links - Mobile */}
        <div className="flex flex-col md:hidden space-y-1 pb-3">
          <Link href="/discover" className="text-base font-medium text-gray-500 hover:text-gray-900 px-2 py-1">
            Discover
          </Link>
          <Link href="/services" className="text-base font-medium text-gray-500 hover:text-gray-900 px-2 py-1">
            Services
          </Link>
          <Link href="/about" className="text-base font-medium text-gray-500 hover:text-gray-900 px-2 py-1">
            About
          </Link>
          <Link href="/reviews" className="text-base font-medium text-gray-500 hover:text-gray-900 px-2 py-1">
             Reviews
          </Link>
        </div>
      </nav>
    </header>
  )
}