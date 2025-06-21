"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Login from "./Login"
import Loader from "../components/Loader"


const ServicePreview = () => {
  const [services, setServices] = useState([])
  const [showLogin, setShowLogin] = useState(false)
  const [redirectPath, setRedirectPath] = useState("")
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)


  // Load services on component mount
  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/services`)
      const data = await response.json()
      setServices(data.slice(0, 6)) // Show only first 6 services
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

    // User is authenticated and is a customer, proceed to booking
    window.location.href = `/book/${serviceId}`
  }

  if(loading){
    return (
      <Loader/>
    )
  }

  return (
    <> 
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-full mb-6">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            Our Services
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Professional Home Services You Can Trust</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From emergency repairs to regular maintenance, our verified professionals are here to help
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service) => (
            <div
              key={service._id}
              className="group bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center text-2xl group-hover:bg-black group-hover:text-white transition-all duration-300">
                    {service.icon}
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500 mb-1">Starting at</div>
                    <div className="text-2xl font-bold text-black">${service.basePrice}</div>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-black mb-2 group-hover:text-gray-800 transition-colors duration-300">
                  {service.name}
                </h3>
                <p className="text-gray-600 mb-3 line-clamp-2">{service.description}</p>

                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{service.providerName}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-yellow-400 text-sm">★</span>
                        <span className="text-sm text-gray-600 ml-1">
                          {service.rating > 0 ? service.rating : "New"}
                        </span>
                        {service.totalReviews > 0 && (
                          <span className="text-xs text-gray-500 ml-2">({service.totalReviews} reviews)</span>
                        )}
                      </div>
                    </div>
                    <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          service.providerId.isVerified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {service.providerId.isVerified ? "Verified" : "Unverified"}
                      </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                    {service.category}
                  </span>
                  <button
                    onClick={() => handleBookClick(service._id)}
                    className="inline-flex items-center px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-all duration-200 group-hover:shadow-lg"
                  >
                    Book Now
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

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
    {showLogin && (
      <Login onClose={() => setShowLogin(false)} initialUserType="customer" redirectPath={redirectPath} />
    )}
    </>
  )
}

export default ServicePreview
