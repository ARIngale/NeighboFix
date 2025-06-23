import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Login from "./Login"
import Loader from "../components/Loader"
import ServiceCard from "../components/ServiceCard"

const ServicePreview = () => {
  const [services, setServices] = useState([])
  const [showLogin, setShowLogin] = useState(false)
  const [redirectPath, setRedirectPath] = useState("")
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/services`)
      const data = await response.json()
      setServices(data.slice(0, 6))
    } catch (error) {
      console.error("Error fetching services:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleBookClick = (serviceId) => {
    if (!user) {
      setRedirectPath(`/book/${serviceId}`)
      setShowLogin(true)
      return
    }

    if (user.role !== "customer") {
      alert("Only customers can book services. Please login with a customer account.")
      return
    }

    navigate(`/book/${serviceId}`)
  }

  if (loading) return <Loader />

  return (
    <>
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-full mb-6">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Our Services
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Professional Home Services You Can Trust</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From emergency repairs to regular maintenance, our verified professionals are here to help
            </p>
          </div>

          {/* Service Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {services.map((service) => (
              <ServiceCard key={service._id} service={service} onBookNow={handleBookClick} />
            ))}
          </div>


          {/* CTA Button */}
          <div className="text-center mt-12">
            <Link
              to="/services"
              className="inline-flex items-center px-8 py-4 bg-black text-white text-lg font-semibold rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              View All Services
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Login modal */}
      {showLogin && (
        <Login onClose={() => setShowLogin(false)} initialUserType="customer" redirectPath={redirectPath} />
      )}
    </>
  )
}

export default ServicePreview
