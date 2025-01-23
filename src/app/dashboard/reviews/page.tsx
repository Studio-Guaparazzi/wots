import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Star, Filter } from 'lucide-react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'

type Review = {
  id: string
  source: string
  reviewer_name: string
  rating: number
  comment: string
  review_date: string
  business_id: string
}

export default async function ReviewsPage() {
  const supabase = createServerComponentClient({ cookies })
  
  const { data: { session } } = await supabase.auth.getSession()
  
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('business_id', session?.user.id)
    .order('review_date', { ascending: false })

  // Group reviews by source with proper typing
  const reviewsBySource = (reviews as Review[] || []).reduce((acc, review) => {
    acc[review.source] = (acc[review.source] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
            <p className="mt-1 text-gray-600">
              Manage and analyze your customer reviews
            </p>
          </div>
          <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
        </div>

        {/* Review Sources */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.entries(reviewsBySource).map(([source, count]) => (
            <div key={source} className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="text-sm font-medium text-gray-500 capitalize">{source}</h3>
              <p className="mt-2 text-2xl font-semibold">{count}</p>
            </div>
          ))}
        </div>

        {/* Reviews List */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">All Reviews</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {reviews?.map((review: Review) => (
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
                      <span className="ml-2 text-sm font-medium text-gray-500 capitalize">
                        via {review.source}
                      </span>
                    </div>
                    <p className="mt-1 font-medium text-gray-900">{review.reviewer_name}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.review_date).toLocaleDateString()}
                  </span>
                </div>
                {review.comment && (
                  <p className="mt-2 text-gray-700">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}