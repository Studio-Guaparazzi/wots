import { Star } from 'lucide-react'

interface Review {
  id: string
  source: string
  reviewer_name: string
  rating: number
  comment: string
  review_date: string
}

export default function ReviewsList({ reviews }: { reviews: Review[] }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="divide-y divide-gray-200">
        {reviews.map((review) => (
          <div key={review.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize" 
                      style={{
                        backgroundColor: 
                          review.source === 'google' ? '#34A853' :
                          review.source === 'yelp' ? '#FF1A1A' :
                          review.source === 'trustpilot' ? '#00B67A' :
                          '#6B7280',
                        color: 'white'
                      }}>
                  {review.source}
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {review.reviewer_name}
                </span>
              </div>
              <time className="text-sm text-gray-500">
                {formatDate(review.review_date)}
              </time>
            </div>
            
            <div className="mt-2">
              <div className="flex items-center">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < review.rating
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                      fill="currentColor"
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-500">
                  {review.rating.toFixed(1)}
                </span>
              </div>
              
              {review.comment && (
                <p className="mt-2 text-sm text-gray-700">
                  {review.comment}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}