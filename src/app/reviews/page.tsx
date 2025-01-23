import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import ReviewsOverview from '@/components/reviews/ReviewsOverview'
import ReviewsList from '@/components/reviews/ReviewsList'
import { redirect } from 'next/navigation'

export default async function ReviewsPage() {
  const supabase = createServerComponentClient({ cookies })
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect('/auth/sign-in')
  }

  // Fetch all reviews for the business
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('business_id', session.user.id)
    .order('review_date', { ascending: false })

  // Calculate metrics
  const totalReviews = reviews?.length || 0
  const averageRating = reviews?.reduce((acc, review) => acc + Number(review.rating), 0) / totalReviews || 0
  
  // Group by source
  const reviewsBySource = reviews?.reduce((acc, review) => {
    acc[review.source] = (acc[review.source] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Reviews Dashboard</h1>
      
      <ReviewsOverview 
        totalReviews={totalReviews}
        averageRating={averageRating}
        reviewsBySource={reviewsBySource}
      />

      <ReviewsList reviews={reviews || []} />
    </div>
  )
}