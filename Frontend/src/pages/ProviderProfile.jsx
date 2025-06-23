import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import Loader from "../components/Loader"
import Login from "../components/Login"
import ServiceCard from "../components/ServiceCard"

const ProviderProfile = () => {
  const { providerId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [provider, setProvider] = useState(null)
  const [services, setServices] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [showLogin, setShowLogin] = useState(false)
  const [redirectService, setRedirectService] = useState(null)

  useEffect(() => {
    fetchProviderDetails()
    fetchReviews()
  }, [providerId])

  const fetchProviderDetails = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/provider/${providerId}`)
      const data = await res.json()
      setProvider(data[0])
      const serviceRes = await fetch(`${import.meta.env.VITE_API_URL}/services?providerId=${providerId}`)
      const serviceData = await serviceRes.json()
      setServices(serviceData)
    } catch (error) {
      console.error("Error loading provider:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/reviews/provider/${providerId}`)
      const data = await res.json()
      setReviews(data)
    } catch (error) {
      console.error("Failed to fetch reviews:", error)
    }
  }

  const handleBookNow = (serviceId) => {
    if (!user) {
      setRedirectService(serviceId)
      setShowLogin(true)
    } else if (user.role !== "customer") {
      alert("Only customers can book services.")
    } else {
      navigate(`/book/${serviceId}`)
    }
  }

  const handleLoginSuccess = () => {
    setShowLogin(false)
    if (redirectService) {
      navigate(`/book/${redirectService}`)
      setRedirectService(null)
    }
  }

  if (loading || !provider) return <Loader />

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Provider Info */}
      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Left Section */}
            <div>
            <h2 className="text-3xl font-bold text-gray-900">{provider.businessName || provider.name}</h2>
            <p className="text-sm text-gray-500 mt-1">{provider.email}</p>
            <p className="text-sm text-gray-500">{provider.phone}</p>
            </div>

            {/* Verification Badge */}
            <div className="flex items-center gap-2">
            <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                provider.isVerified
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
            >
                {provider.isVerified ? "✔ Verified Provider" : "⚠️ Not Verified"}
            </span>
            </div>
        </div>

            {/* Description */}
            <p className="mt-6 text-gray-700 text-sm leading-relaxed">
                {provider.businessDescription || "No business description provided."}
            </p>

            {/* Stats Grid */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">
                <div className="flex items-center gap-2">
                <span className="text-yellow-400">★</span>
                <p><strong>Rating:</strong> {provider.rating || "New"}</p>
                </div>
                <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h8m-8 4h6" />
                </svg>
                <p><strong>Reviews:</strong> {provider.totalReviews}</p>
                </div>
                <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 17l4-4 4 4m0-8l-4 4-4-4" />
                </svg>
                <p><strong>Jobs:</strong> {provider.completedJobs}</p>
                </div>
                <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                </svg>
                <p><strong>Experience:</strong> {provider.experience || 0} yrs</p>
                </div>
            </div>
            </div>


      {/* Provider's Services */}
      <div className="mb-12">
        <h3 className="text-xl font-semibold text-black mb-4">Services Offered</h3>
        {services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard
                key={service._id}
                service={service}
                onBookNow={handleBookNow}
                showProviderInfo={false} // Optional: hide provider card block
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No services listed by this provider yet.</p>
        )}
      </div>

        {/* Provider Reviews */}

      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            Customer Reviews
        </h3>

        {reviews.length > 0 ? (
            <ul className="space-y-6">
            {reviews.map((review) => (
                <li
                key={review._id}
                className="bg-gray-50 rounded-xl p-5 border border-gray-100 shadow-sm"
                >
                <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-gray-800">
                    {review.customerId?.name || "Anonymous"}
                    </h4>
                    <span className="text-yellow-500 text-sm">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                    </span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                    <p>
                    <span className="font-medium text-gray-700">Service:</span>{" "}
                    {review.serviceName || "N/A"}
                    </p>
                    <p>
                    <span className="font-medium text-gray-700">Date:</span>{" "}
                    {new Date(review.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    })}
                    </p>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                </li>
                    ))}
                    </ul>
                ) : (
                    <div className="text-center py-6 text-gray-500">No reviews for this provider yet.</div>
                )}
        </div>


      {showLogin && (
        <Login
          onClose={() => {
            setShowLogin(false)
            setRedirectService(null)
          }}
          initialUserType="customer"
          onSuccess={handleLoginSuccess}
        />
      )}
    </div>
  )
}

export default ProviderProfile
