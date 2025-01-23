'use client'

import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

export default function AnalyticsPage() {
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchReviews() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const { data } = await supabase
          .from('reviews')
          .select('*')
          .eq('business_id', session.user.id)
        
        setReviews(data || [])
      }
      setLoading(false)
    }

    fetchReviews()
  }, [])

  // Prepare data for charts
  const monthlyData = reviews.reduce((acc: any[], review) => {
    const date = new Date(review.review_date)
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`
    
    const existingEntry = acc.find(entry => entry.month === monthYear)
    if (existingEntry) {
      existingEntry.count += 1
      existingEntry.totalRating += review.rating
      existingEntry.avgRating = existingEntry.totalRating / existingEntry.count
    } else {
      acc.push({
        month: monthYear,
        count: 1,
        totalRating: review.rating,
        avgRating: review.rating
      })
    }
    
    return acc
  }, []).sort((a, b) => {
    const [aMonth, aYear] = a.month.split('/')
    const [bMonth, bYear] = b.month.split('/')
    return new Date(aYear, aMonth - 1).getTime() - new Date(bYear, bMonth - 1).getTime()
  })

  const sourceDistribution = reviews.reduce((acc: any[], review) => {
    const existingEntry = acc.find(entry => entry.source === review.source)
    if (existingEntry) {
      existingEntry.count += 1
    } else {
      acc.push({
        source: review.source,
        count: 1
      })
    }
    return acc
  }, [])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading analytics...</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-1 text-gray-600">
            Track your review performance over time
          </p>
        </div>

        {/* Rating Trend */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Average Rating Trend</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="avgRating" 
                  stroke="#6366F1" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Review Volume */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Review Volume by Source</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="source" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#6366F1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Reviews</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{reviews.length}</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Average Rating</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {(reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length || 0).toFixed(1)}
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Review Sources</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {new Set(reviews.map(review => review.source)).size}
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}