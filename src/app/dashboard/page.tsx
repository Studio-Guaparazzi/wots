import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { ArrowUp, ArrowDown, Star, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies })
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect('/auth/sign-in')
  }

  // Fetch reviews and profile data
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('business_id', session.user.id)
    .order('review_date', { ascending: false })
    .limit(5)

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', session.user.id)
    .single()

  // Calculate metrics
  const metrics = {
    totalReviews: reviews?.length || 0,
    averageRating: reviews?.reduce((acc, review) => acc + review.rating, 0) / (reviews?.length || 1) || 0,
    recentTrend: 0.2, // This would be calculated comparing recent vs older reviews
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Message */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {profile?.business_name || 'there'}!
          </h1>
          <p className="mt-1 text-gray-600">
            Here's what's happening with your reviews
          </p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">Average Rating</h3>
              <span className={`inline-flex items-center ${
                metrics.recentTrend >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {metrics.recentTrend >= 0 ? (
                  <ArrowUp className="w-4 h-4" />
                ) : (
                  <ArrowDown className="w-4 h-4" />
                )}
                <span className="ml-1 text-sm">
                  {Math.abs(metrics.recentTrend * 100).toFixed(1)}%
                </span>
              </span>
            </div>
            <p className="mt-2 flex items-baseline">
              <span className="text-3xl font-semibold text-gray-900">
                {metrics.averageRating.toFixed(1)}
              </span>
              <Star className="ml-2 h-5 w-5 text-yellow-400 fill-current" />
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">Total Reviews</h3>
            </div>
            <p className="mt-2 flex items-baseline">
              <span className="text-3xl font-semibold text-gray-900">
                {metrics.totalReviews}
              </span>
              <MessageSquare className="ml-2 h-5 w-5 text-gray-400" />
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">Profile Views</h3>
            </div>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              -
            </p>
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Recent Reviews</h2>
              <Link 
                href="/dashboard/reviews"
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                View all
              </Link>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {reviews?.length ? reviews.map((review) => (
              <div key={review.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-500">
                        via {review.source}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {review.reviewer_name}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.review_date).toLocaleDateString()}
                  </span>
                </div>
                {review.comment && (
                  <p className="mt-2 text-sm text-gray-700">
                    {review.comment}
                  </p>
                )}
              </div>
            )) : (
              <div className="p-6 text-center text-gray-500">
                No reviews yet
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}