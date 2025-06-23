import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import Loader from "../components/Loader"
import Login from "../components/Login"
import { useAuth } from "../context/AuthContext"

const ServiceDetails = () => {
  const { serviceId } = useParams()
  const [service, setService] = useState(null)
  const [reviews, setReviews] = useState([])
  const { user } = useAuth()
  const navigate = useNavigate()
  const [showLogin, setShowLogin] = useState(false)
  const [redirectService, setRedirectService] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchService()
    fetchReviews()
  }, [serviceId])

  const fetchService = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/services/${serviceId}`)
      if (!res.ok) throw new Error("Failed to fetch service")
      const data = await res.json()
      setService(data)
    } catch (err) {
      console.error("Service fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/reviews/service/${serviceId}`)
      if (!res.ok) throw new Error("Failed to fetch reviews")
      const data = await res.json()
      setReviews(data)
    } catch (err) {
      console.error("Reviews fetch error:", err)
    }
  }

  const handleBookNow = (id) => {
    if (!user) {
      setRedirectService(id)
      setShowLogin(true)
    } else if (user.role !== "customer") {
      alert("Only customers can book services.")
    } else {
      navigate(`/book/${id}`)
    }
  }

  const handleLoginSuccess = () => {
    setShowLogin(false)
    if (redirectService) {
      navigate(`/book/${redirectService}`)
      setRedirectService(null)
    }
  }

  const handleProviderClick = () => {
    navigate(`/provider/${service.providerId._id}`)
  }

  if (loading || !service) return <Loader />

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{service.name}</h1>
      <p className="text-gray-600 text-lg mb-2">{service.description}</p>
      <p className="text-sm text-gray-500 mb-4">Category: {service.category}</p>

      <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg mb-6">
        <div>
          <p className="font-semibold text-gray-800">{service.providerName}</p>
          <p className="text-sm text-gray-600">
            {service.providerId.isVerified ? "Verified Provider ✅" : "Unverified"}
          </p>
          <p className="text-sm text-gray-600">Rating: {service.rating || "New"} ⭐</p>
        </div>
        <button
          onClick={() => navigate(`/provider/${service.providerId._id}`)
        }
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          View Provider Profile →
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Service Pricing</h2>
        <p className="text-2xl font-bold text-black">₹{service.basePrice}</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-5">Customer Reviews</h2>

        {reviews.length > 0 ? (
            <ul className="space-y-5">
            {reviews.map((review) => (
                <li key={review._id} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-semibold text-gray-800">
                    {review.customerId?.name || "Anonymous"}
                    </p>
                    <span className="text-xs text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                    })}
                    </span>
                </div>

                {review.serviceId?.name && (
                    <p className="text-xs text-gray-500 mb-1">
                    Service: <span className="text-gray-700 font-medium">{review.serviceId.name}</span>
                    </p>
                )}

                <p className="text-sm text-gray-600 mb-1">{review.comment}</p>

                <p className="text-xs text-yellow-500 font-medium">Rating: {review.rating}⭐</p>
                </li>
            ))}
            </ul>
        ) : (
            <p className="text-gray-500 text-sm">No reviews yet for this service.</p>
        )}
        </div>


      <button
        onClick={() => handleBookNow(service._id)}
        className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800"
      >
        Book Now
      </button>

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

export default ServiceDetails
