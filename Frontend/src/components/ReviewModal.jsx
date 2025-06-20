"use client"

import { useState } from "react"
import { useAuth } from "../context/AuthContext"

const ReviewModal = ({ booking, onClose, onSuccess }) => {
  const { token } = useAuth()
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/reviews/provider`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookingId: booking._id,
          rating: reviewForm.rating,
          comment: reviewForm.comment,
        }),
      })

      if (response.ok) {
        onSuccess()
        onClose()
        alert("Review submitted successfully!")
      } else {
        const error = await response.json()
        alert(error.message || "Failed to submit review")
      }
    } catch (error) {
      console.error("Error submitting review:", error)
      alert("Failed to submit review")
    } finally {
      setSubmitting(false)
    }
  }

  const renderStars = (rating, interactive = false) => {
    return [...Array(5)].map((_, index) => (
      <button
        key={index}
        type={interactive ? "button" : undefined}
        onClick={interactive ? () => setReviewForm({ ...reviewForm, rating: index + 1 }) : undefined}
        className={`text-2xl ${interactive ? "hover:scale-110 transition-transform cursor-pointer" : ""} ${
          index < rating ? "text-yellow-400" : "text-gray-300"
        }`}
        disabled={!interactive}
      >
        ★
      </button>
    ))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-black">Leave a Review</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-black">{booking.serviceName}</h4>
            <p className="text-gray-600">Provider: {booking.providerId?.businessName || booking.providerId?.name}</p>
            <p className="text-gray-600">Date: {new Date(booking.preferredDate).toLocaleDateString()}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-black mb-3">Rating</label>
              <div className="flex items-center space-x-1">{renderStars(reviewForm.rating, true)}</div>
              <p className="text-sm text-gray-600 mt-2">
                {reviewForm.rating === 1 && "Poor"}
                {reviewForm.rating === 2 && "Fair"}
                {reviewForm.rating === 3 && "Good"}
                {reviewForm.rating === 4 && "Very Good"}
                {reviewForm.rating === 5 && "Excellent"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">Your Review</label>
              <textarea
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
                placeholder="Share your experience with this service..."
              />
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !reviewForm.comment.trim()}
                className="flex-1 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </div>
                ) : (
                  "Submit Review"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ReviewModal
