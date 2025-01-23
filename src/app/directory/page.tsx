import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'

export default async function DirectoryPage() {
  const supabase = createServerComponentClient({ cookies })

  // Fetch public businesses with their average ratings
  const { data: businesses } = await supabase
    .from('profiles')
    .select(`
      *,
      reviews!inner (
        rating
      )
    `)
    .eq('is_public', true)
    .order('business_name')

  // Calculate average ratings
  const businessesWithStats = businesses?.map(business => {
    const reviews = business.reviews || []
    const avgRating = reviews.reduce((acc: number, rev: any) => acc + rev.rating, 0) / reviews.length
    return {
      ...business,
      averageRating: avgRating || 0,
      totalReviews: reviews.length
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Business Directory</h1>
        <div className="flex gap-2">
          {/* Add filters/search here later */}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {businessesWithStats?.map((business) => (
          <Link 
            key={business.id} 
            href={`/directory/${business.slug}`}
            className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">{business.business_name}</h2>
              
              <div className="flex items-center mb-2">
                <div className="text-yellow-400 font-bold">
                  {business.averageRating.toFixed(1)} ★
                </div>
                <span className="text-gray-500 text-sm ml-2">
                  ({business.totalReviews} reviews)
                </span>
              </div>

              {business.category && (
                <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                  {business.category}
                </span>
              )}

              <p className="text-gray-600 mt-2 line-clamp-2">
                {business.services_description}
              </p>

              <div className="text-gray-500 text-sm mt-2">
                📍 {business.city}, {business.country}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}