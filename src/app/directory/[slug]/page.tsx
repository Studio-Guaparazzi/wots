import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { Star, Globe, MapPin, Phone } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function BusinessPage({
  params,
}: {
  params: { slug: string }
}) {
  try {
    const cookieStore = cookies()
    const supabase = createServerComponentClient({ cookies: () => cookieStore })

    // Convert slug back to business name format
    const businessName = decodeURIComponent(params.slug)
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase())

    // Fetch business profile and reviews
    const { data: business } = await supabase
      .from('profiles')
      .select(`
        *,
        reviews (
          id,
          source,
          reviewer_name,
          rating,
          comment,
          review_date
        )
      `)
      .eq('is_public', true)
      .ilike('business_name', businessName)
      .single()

    if (!business) {
      notFound()
    }

    // Calculate review statistics
    const reviews = business.reviews || []
    const averageRating = reviews.length > 0 
      ? reviews.reduce((acc: number, rev: any) => acc + rev.rating, 0) / reviews.length 
      : 0
    const recentReviews = [...reviews]
      .sort((a: any, b: any) => new Date(b.review_date).getTime() - new Date(a.review_date).getTime())
      .slice(0, 10)

    return (
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Business Header */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-4">{business.business_name}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center">
              <Star className="w-6 h-6 text-yellow-400 fill-current" />
              <span className="ml-1 font-bold">{averageRating.toFixed(1)}</span>
              <span className="text-gray-500 ml-1">({reviews.length} reviews)</span>
            </div>
            
            {business.category && (
              <span className="bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                {business.category}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Contact Information */}
            <div className="space-y-3">
              {business.street_address && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span>{business.street_address}, {business.city}, {business.postal_code}</span>
                </div>
              )}
              
              {business.website_url && (
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <a href={business.website_url} target="_blank" rel="noopener noreferrer" 
                     className="text-blue-600 hover:underline">
                    {business.website_url}
                  </a>
                </div>
              )}
              
              {business.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span>{business.phone}</span>
                </div>
              )}
            </div>

            {/* Statistics */}
            <div className="space-y-2">
              <div className="text-sm text-gray-600">
                <strong>Average Rating:</strong> {averageRating.toFixed(1)} / 5.0
              </div>
              <div className="text-sm text-gray-600">
                <strong>Total Reviews:</strong> {reviews.length}
              </div>
            </div>
          </div>
        </div>

        {/* Services Description */}
        {business.services_description && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">About Our Services</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{business.services_description}</p>
          </div>
        )}

        {/* Recent Reviews */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Reviews</h2>
          {recentReviews.length > 0 ? (
            <div className="space-y-6">
              {recentReviews.map((review: any) => (
                <div key={review.id} className="border-b last:border-0 pb-4 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="font-medium mt-1">{review.reviewer_name}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.review_date).toLocaleDateString()}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-gray-700">{review.comment}</p>
                  )}
                  <div className="mt-2 text-sm text-gray-500 capitalize">
                    Source: {review.source}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No reviews yet.</p>
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading business page:', error)
    notFound()
  }
}