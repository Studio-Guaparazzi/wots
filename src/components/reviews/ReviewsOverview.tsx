import { Star } from 'lucide-react'

interface ReviewsOverviewProps {
  totalReviews: number
  averageRating: number
  reviewsBySource: Record<string, number>
}

export default function ReviewsOverview({ 
  totalReviews, 
  averageRating, 
  reviewsBySource 
}: ReviewsOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Average Rating Card */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900">Average Rating</h3>
        <div className="mt-2 flex items-baseline">
          <p className="text-3xl font-semibold text-indigo-600">
            {averageRating.toFixed(1)}
          </p>
          <Star className="ml-2 h-5 w-5 text-yellow-400" fill="currentColor" />
        </div>
      </div>

      {/* Total Reviews Card */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900">Total Reviews</h3>
        <p className="mt-2 text-3xl font-semibold text-indigo-600">
          {totalReviews}
        </p>
      </div>

      {/* Reviews by Source Card */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900">Reviews by Source</h3>
        <div className="mt-2 space-y-2">
          {Object.entries(reviewsBySource).map(([source, count]) => (
            <div key={source} className="flex justify-between items-center">
              <span className="text-gray-600 capitalize">{source}</span>
              <span className="text-indigo-600 font-medium">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}