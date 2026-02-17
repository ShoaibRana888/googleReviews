'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Business {
  id: string
  business_name: string
  google_review_url: string
  qr_code_id: string
  created_at: string
}

interface Feedback {
  id: string
  business_id: string
  rating: number
  feedback_text: string | null
  created_at: string
}

export default function Dashboard() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null)
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [qrCode, setQrCode] = useState<string>('')
  const [showAddBusiness, setShowAddBusiness] = useState(false)
  const [businessName, setBusinessName] = useState('')
  const [googleReviewUrl, setGoogleReviewUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchBusinesses()
  }, [])

  useEffect(() => {
    if (selectedBusiness) {
      fetchFeedback(selectedBusiness.id)
      fetchQRCode(selectedBusiness.qr_code_id)
    }
  }, [selectedBusiness])

  const fetchBusinesses = async () => {
    try {
      const res = await fetch('/api/business')
      if (!res.ok) throw new Error('Failed to fetch businesses')
      const data = await res.json()
      setBusinesses(data.businesses)
      if (data.businesses.length > 0) {
        setSelectedBusiness(data.businesses[0])
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchFeedback = async (businessId: string) => {
    try {
      const res = await fetch(`/api/feedback?businessId=${businessId}`)
      if (!res.ok) throw new Error('Failed to fetch feedback')
      const data = await res.json()
      setFeedback(data.feedback)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchQRCode = async (qrCodeId: string) => {
    try {
      const res = await fetch(`/api/qr?id=${qrCodeId}`)
      if (!res.ok) throw new Error('Failed to fetch QR code')
      const data = await res.json()
      setQrCode(data.qrCode)
    } catch (error) {
      console.error(error)
    }
  }

  const handleAddBusiness = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessName, googleReviewUrl }),
      })
      if (!res.ok) throw new Error('Failed to create business')
      setBusinessName('')
      setGoogleReviewUrl('')
      setShowAddBusiness(false)
      fetchBusinesses()
    } catch (error) {
      console.error(error)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
    } catch (error) {
      console.error(error)
    }
    window.location.href = '/'
  }

  const downloadQRCode = () => {
    const link = document.createElement('a')
    link.href = qrCode
    link.download = `qr-code-${selectedBusiness?.business_name}.png`
    link.click()
  }

  const stats = selectedBusiness
    ? {
        totalReviews: feedback.length,
        averageRating: feedback.length > 0
          ? (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1)
          : '0',
        googleRedirects: feedback.filter(f => f.rating >= 4).length,
        privateFeedback: feedback.filter(f => f.rating <= 3).length,
      }
    : null

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">ReviewQR</h1>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {businesses.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Welcome to ReviewQR!
            </h2>
            <p className="text-gray-600 mb-6">
              Get started by adding your first business
            </p>
            <button
              onClick={() => setShowAddBusiness(true)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              Add Business
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="w-full sm:w-auto">
                <select
                  value={selectedBusiness?.id || ''}
                  onChange={(e) => {
                    const business = businesses.find(b => b.id === e.target.value)
                    setSelectedBusiness(business || null)
                  }}
                  className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {businesses.map(business => (
                    <option key={business.id} value={business.id}>
                      {business.business_name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => setShowAddBusiness(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
              >
                Add Business
              </button>
            </div>

            {stats && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="text-sm text-gray-600 mb-1">Total Reviews</div>
                  <div className="text-3xl font-bold text-gray-900">{stats.totalReviews}</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="text-sm text-gray-600 mb-1">Average Rating</div>
                  <div className="text-3xl font-bold text-gray-900">{stats.averageRating}</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="text-sm text-gray-600 mb-1">Google Redirects</div>
                  <div className="text-3xl font-bold text-green-600">{stats.googleRedirects}</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="text-sm text-gray-600 mb-1">Private Feedback</div>
                  <div className="text-3xl font-bold text-orange-600">{stats.privateFeedback}</div>
                </div>
              </div>
            )}

            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">QR Code</h3>
                {qrCode && (
                  <div className="text-center">
                    <img src={qrCode} alt="QR Code" className="mx-auto mb-4 max-w-xs" />
                    <button
                      onClick={downloadQRCode}
                      className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
                    >
                      Download QR Code
                    </button>
                    <p className="text-sm text-gray-600 mt-4">
                      Share URL: {process.env.NEXT_PUBLIC_APP_URL}/r/{selectedBusiness?.qr_code_id}
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Recent Feedback</h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {feedback.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No feedback yet</p>
                  ) : (
                    feedback.slice(0, 10).map((item) => (
                      <div key={item.id} className="border-b pb-4 last:border-b-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={i < item.rating ? 'text-yellow-400' : 'text-gray-300'}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(item.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {item.feedback_text && (
                          <p className="text-gray-700 text-sm">{item.feedback_text}</p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {showAddBusiness && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Add New Business</h2>
            <form onSubmit={handleAddBusiness} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="My Business"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Google Review URL
                </label>
                <input
                  type="url"
                  value={googleReviewUrl}
                  onChange={(e) => setGoogleReviewUrl(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="https://g.page/..."
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddBusiness(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
