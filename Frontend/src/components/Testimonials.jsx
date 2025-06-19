"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import Login from "./Login"

const Testimonials = () => {
  const [platformReviews, setPlatformReviews] = useState([])
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" })
  const [showForm, setShowForm] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [loading, setLoading] = useState(true)

  const { user, token } = useAuth()

  // Fetch approved platform reviews
  const fetchReviews = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/reviews/platform`)
      if (response.ok) {
        const data = await response.json()
        setPlatformReviews(data)
      }
    } catch (err) {
      console.error("Error fetching reviews:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  // Submit a new platform review
  const handleSubmitReview = async () => {
    if (!newReview.comment || newReview.rating === 0) {
      alert("Please fill in all fields.")
      return
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/reviews/platform`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating: newReview.rating,
          comment: newReview.comment,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setPlatformReviews([data, ...platformReviews])
        setNewReview({ rating: 0, comment: "" })
        setShowForm(false)
      } else {
        const err = await response.json()
        alert(err.message || "Something went wrong")
      }
    } catch (error) {
      console.error("Error submitting review:", error)
      alert("Failed to submit review.")
    }
  }

  // Click handler for "Write a Review"
  const handleWriteReviewClick = () => {
    if (!user) {
      setShowLogin(true)
      return
    }

    if (user.role !== "customer") {
      alert("Only customers can write reviews.")
      return
    }

    setShowForm(true)
  }

  const renderStars = (rating) => (
    <div className="flex gap-1 text-yellow-400 text-xl">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i}>{i <= rating ? "★" : "☆"}</span>
      ))}
    </div>
  )

  const handleRatingChange = (rating) => {
    setNewReview({ ...newReview, rating })
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full mb-4">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Customer Reviews
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-2">
            What Our Customers Say About NeighboFix
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real feedback from people who used NeighboFix for their home service needs.
          </p>
        </div>

        {loading ? (
          <p className="text-center">Loading reviews...</p>
        ) : (
          <div className="overflow-hidden relative">
            <div className="flex gap-6 h-full animate-marquee whitespace-nowrap hover:[animation-play-state:paused]">
              {[...platformReviews, ...platformReviews].map((review, i) => (
                <div
                  key={`${review._id}-${i}`}
                  className="min-w-[300px] max-w-[300px] bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col"
                >
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold mr-3">
                      {review.customerName?.charAt(0) || "U"}
                    </div>
                    <div>
                      <h4 className="font-semibold text-black">{review.customerName || "Unknown"}</h4>
                      <div className="text-sm text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="mb-2">{renderStars(review.rating)}</div>
                  <p className="text-gray-700 text-sm break-words text-wrap">
                    "{review.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 text-center">
          {!showForm ? (
            <button
              onClick={handleWriteReviewClick}
              className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition"
            >
              Write a Review
            </button>
          ) : (
            <div className="bg-white rounded-2xl p-8 border border-gray-100 max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-black mb-4">Write a Review</h3>
              <textarea
                placeholder="Your Experience"
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                rows={4}
                className="w-full border border-gray-300 p-3 rounded mb-4"
              />
              <div className="mb-4">
                <p className="text-gray-700 font-medium mb-2">Your Rating:</p>
                <div className="flex gap-2 text-2xl cursor-pointer justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      onClick={() => handleRatingChange(star)}
                      className={star <= newReview.rating ? "text-yellow-400" : "text-gray-300"}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleSubmitReview}
                  className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition"
                >
                  Submit
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-black border border-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Login Modal */}
          {showLogin && (
            <Login
              onClose={() => setShowLogin(false)}
              initialUserType="customer"
              onSuccess={() => {
                setShowLogin(false)
                setShowForm(true)
              }}
            />
          )}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
