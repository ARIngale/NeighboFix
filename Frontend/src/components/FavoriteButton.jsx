"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"

const FavoriteButton = ({ serviceId, providerId, type = "service", className = "" }) => {
  const { token } = useAuth()
  const [isFavorited, setIsFavorited] = useState(false)
  const [favoriteId, setFavoriteId] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    checkFavoriteStatus()
  }, [serviceId, providerId, type])

  const checkFavoriteStatus = async () => {
    try {
      const params = new URLSearchParams({ type })
      if (type === "service" && serviceId) params.append("serviceId", serviceId)
      if (type === "provider" && providerId) params.append("providerId", providerId)

      const response = await fetch(`${import.meta.env.VITE_API_URL}/favorites/check?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setIsFavorited(data.isFavorited)
        setFavoriteId(data.favoriteId)
      }
    } catch (error) {
      console.error("Error checking favorite status:", error)
    }
  }

  const toggleFavorite = async () => {
    if (loading) return
    setLoading(true)

    try {
      if (isFavorited && favoriteId) {
        // Remove from favorites
        const response = await fetch(`${import.meta.env.VITE_API_URL}/favorites/${favoriteId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.ok) {
          setIsFavorited(false)
          setFavoriteId(null)
        }
      } else {
        // Add to favorites
        const response = await fetch(`${import.meta.env.VITE_API_URL}/favorites`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            serviceId: type === "service" ? serviceId : undefined,
            providerId: type === "provider" ? providerId : undefined,
            type,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          setIsFavorited(true)
          setFavoriteId(data._id)
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`p-2 rounded-full transition-colors ${
        isFavorited ? "text-red-500 hover:text-red-600" : "text-gray-400 hover:text-red-500"
      } ${className}`}
      title={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
      ) : (
        <svg className="w-5 h-5" fill={isFavorited ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      )}
    </button>
  )
}

export default FavoriteButton
