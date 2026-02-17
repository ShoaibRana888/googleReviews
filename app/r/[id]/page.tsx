'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

interface Business {
  id: string
  business_name: string
  google_review_url: string
  qr_code_id: string
}

export default function RatingPage() {
  const params = useParams()
  const qrCodeId = params.id as string
  
  const [business, setBusiness] = useState<Business | null>(null)
  const [rating, setRating] = useState<number>(0)
  const [hoverRating, setHoverRating] = useState<number>(0)
  const [feedbackText, setFeedbackText] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchBusiness()
  }, [qrCodeId])

  const fetchBusiness = async () => {
    try {
      const res = await fetch(`/api/business/${qrCodeId}`)
      if (!res.ok) throw new Error('Business not found')
      const data = await res.json()
      setBusiness(data.business)
    } catch (err) {
      setError('Business not found')
    } finally {
      setLoading(false)
    }
  }

  const handleRatingClick = async (selectedRating: number) => {
    setRating(selectedRating)

    if (selectedRating >= 4) {
      // Redirect to Google Reviews
      await saveFeedback(selectedRating, null)
      if (business?.google_review_url) {
        window.location.href = business.google_review_url
      }
    }
  }

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await saveFeedback(rating, feedbackText)
  }

  const saveFeedback = async (rating: number, feedback: string | null) => {
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: business?.id,
          rating,
          feedbackText: feedback,
        }),
      })

      if (!res.ok) throw new Error('Failed to save feedback')
      setSubmitted(true)
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (error || !business) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
          <p className="text-gray-600">{error || 'Business not found'}</p>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center max-w-md">
          <div className="text-6xl mb-4">✓</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h1>
          <p className="text-gray-600">
            We appreciate your feedback and will use it to improve our service.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {business.business_name}
          </h1>
          <p className="text-gray-600">How was your experience?</p>
        </div>

        {rating === 0 ? (
          <div className="space-y-6">
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRatingClick(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <span
                    className={`text-6xl ${
                      star <= (hoverRating || rating)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                </button>
              ))}
            </div>
            <p className="text-center text-sm text-gray-500">
              Tap a star to rate
            </p>
          </div>
        ) : (
          <form onSubmit={handleFeedbackSubmit} className="space-y-4">
            <div className="flex justify-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-4xl ${
                    star <= rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tell us more (optional)
              </label>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="What could we improve?"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
              >
                Submit Feedback
              </button>
              <button
                type="button"
                onClick={() => setRating(0)}
                className="px-4 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
              >
                Back
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
