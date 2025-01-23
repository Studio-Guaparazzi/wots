'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Star,
  Settings,
  BarChart2,
  Globe,
  ChevronLeft,
  Menu
} from 'lucide-react'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Reviews', href: '/dashboard/reviews', icon: Star },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart2 },
    { name: 'Public Page', href: '/dashboard/public-page', icon: Globe },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ]

  const isActive = (path: string) => pathname === path

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Sidebar */}
      <div 
        className={`${
          collapsed ? 'w-16' : 'w-64'
        } bg-white border-r transition-all duration-300 ease-in-out flex flex-col`}
      >
        <div className="p-4 flex justify-between items-center">
          {!collapsed && <span className="font-semibold text-gray-600">Navigation</span>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-gray-100"
          >
            {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <nav className="flex-1 p-2 space-y-1">
          {navigation.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  active 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <item.icon size={20} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  )
}