"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const BookingForm = () => {
  const { serviceId } = useParams()
  const navigate = useNavigate()
  const { user, token } = useAuth()
  const [service, setService] = useState(null)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    address: "",
    preferredDate: "",
    preferredTime: "",
    description: "",
    paymentMethod: "card",
  })
  const [loading, setLoading] = useState(false)
  const [serviceLoading, setServiceLoading] = useState(true)

  useEffect(() => {
    if (serviceId) {
      fetchService()
    }

    // Pre-populate form with user data
    if (user) {
      setFormData((prev) => ({
        ...prev,
        customerName: user.name || "",
        customerEmail: user.email || "",
        customerPhone: user.phone || "",
        address: user.address
          ? `${user.address.street || ""} ${user.address.city || ""} ${user.address.state || ""} ${user.address.zipCode || ""}`.trim()
          : "",
      }))
    }
  }, [serviceId, user])

  const fetchService = async () => {
    try {
      setServiceLoading(true)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/services/${serviceId}`)
      if (response.ok) {
        const data = await response.json()
        setService(data)
      } else {
        console.error("Service not found")
        navigate("/services")
      }
    } catch (error) {
      console.error("Error fetching service:", error)
      navigate("/services")
    } finally {
      setServiceLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const bookingData = {
        ...formData,
        serviceId: service._id,
        serviceName: service.name,
        totalAmount: service.basePrice,
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      })

      if (response.ok) {
        const booking = await response.json()
        alert("Booking created successfully! You will be contacted by the service provider soon.")
        navigate("/customer-dashboard")
      } else {
        const errorData = await response.json()
        alert(errorData.message || "Failed to create booking. Please try again.")
      }
    } catch (error) {
      console.error("Error creating booking:", error)
      alert("Failed to create booking. Please try again.")
    }

    setLoading(false)
  }

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  if (serviceLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading service details...</p>
        </div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="text-6xl mb-6">❌</div>
          <h1 className="text-3xl font-bold text-black mb-4">Service Not Found</h1>
          <p className="text-gray-600 mb-8">The service you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate("/services")}
            className="bg-black text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Browse Services
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNumber ? "bg-black text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div className={`w-16 h-1 mx-2 ${step > stepNumber ? "bg-black" : "bg-gray-200"}`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Service Details</span>
            <span>Schedule</span>
            <span>Contact Info</span>
            <span>Confirmation</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
          {/* Step 1: Service Details */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-black mb-6">Service Details</h2>
              <div className="border border-gray-200 rounded-xl p-6 mb-6">
                <div className="flex items-start">
                  <div className="text-4xl mr-4">{service.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-black">{service.name}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>

                    {/* Provider Info */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold text-black mb-2">Service Provider</h4>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            {service.providerId?.businessName || service.providerName}
                          </p>
                          <div className="flex items-center mt-1">
                            <span className="text-yellow-400">★</span>
                            <span className="text-sm text-gray-600 ml-1">
                              {service.rating > 0 ? service.rating : "New Provider"}
                            </span>
                            {service.totalReviews > 0 && (
                              <span className="text-xs text-gray-500 ml-2">({service.totalReviews} reviews)</span>
                            )}
                          </div>
                        </div>
                        <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                          Verified
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-black">Starting at ${service.basePrice}</span>
                      <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {service.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-black mb-2">
                  Describe your specific needs (optional)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell us more about what you need help with..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                />
              </div>

              <button
                onClick={nextStep}
                className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                Continue to Schedule
              </button>
            </div>
          )}

          {/* Step 2: Schedule */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-black mb-6">Choose Date & Time</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Preferred Date</label>
                  <input
                    type="date"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Preferred Time</label>
                  <select
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select time</option>
                    <option value="8:00 AM">8:00 AM</option>
                    <option value="9:00 AM">9:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="1:00 PM">1:00 PM</option>
                    <option value="2:00 PM">2:00 PM</option>
                    <option value="3:00 PM">3:00 PM</option>
                    <option value="4:00 PM">4:00 PM</option>
                    <option value="5:00 PM">5:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={prevStep}
                  className="flex-1 border-2 border-black text-black py-3 rounded-lg font-semibold hover:bg-black hover:text-white transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={!formData.preferredDate || !formData.preferredTime}
                  className="flex-1 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  Continue to Contact Info
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Contact Information */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-black mb-6">Contact Information</h2>

              <div className="space-y-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Full Name</label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">Email</label>
                  <input
                    type="email"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">Service Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows={3}
                    placeholder="Enter the full address where service is needed"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={prevStep}
                  className="flex-1 border-2 border-black text-black py-3 rounded-lg font-semibold hover:bg-black hover:text-white transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={
                    !formData.customerName || !formData.customerPhone || !formData.customerEmail || !formData.address
                  }
                  className="flex-1 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  Continue to Confirmation
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-black mb-6">Booking Confirmation</h2>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-black mb-4">Booking Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Service:</span>
                    <span className="font-semibold">{service.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Provider:</span>
                    <span className="font-semibold">{service.providerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span>{new Date(formData.preferredDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time:</span>
                    <span>{formData.preferredTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Address:</span>
                    <span className="text-right">{formData.address}</span>
                  </div>
                  <hr className="my-3" />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Starting Price:</span>
                    <span>${service.basePrice}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> The final price may vary based on the complexity of the work. The service
                  provider will provide a detailed quote before starting the work. You only pay after the service is
                  completed to your satisfaction.
                </p>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={prevStep}
                  className="flex-1 border-2 border-black text-black py-3 rounded-lg font-semibold hover:bg-black hover:text-white transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Confirm Booking"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookingForm
