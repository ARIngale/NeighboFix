"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const sampleData = [
    {
      _id: "1",
      serviceName: "Plumber",
      address: "123 Main Street, Pune",
      preferredDate: "2025-06-20",
      preferredTime: "10:00 AM",
      status: "pending",
    },
    {
      _id: "2",
      serviceName: "Electrician",
      address: "45 Sector 10, Mumbai",
      preferredDate: "2025-06-22",
      preferredTime: "2:30 PM",
      status: "confirmed",
    },
    {
      _id: "3",
      serviceName: "AC Repair",
      address: "Flat 501, Skyline Residency, Nagpur",
      preferredDate: "2025-06-25",
      preferredTime: "5:00 PM",
      status: "completed",
    },
  ];

const CustomerDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview")
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([])
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
  })
  const [updating, setUpdating] = useState(false)


    useEffect(() => {
        setBookings(sampleData);
        setReviews([
            { bookingId: "3", rating: 5, comment: "Excellent AC repair service." },
          ])
        
    },[])

    const hasReviewed = (bookingId) => {
        return reviews.some((review) => review.bookingId === bookingId)
    }

    const handleProfileUpdate = () => {
        alert("updated")
    }

    const handleProfileChange = (e) => {
        const { name, value } = e.target
        if (name.includes("address.")) {
          const addressField = name.split(".")[1]
          setProfile((prev) => ({
            ...prev,
            address: {
              ...prev.address,
              [addressField]: value,
            },
          }))
        } else {
          setProfile((prev) => ({
            ...prev,
            [name]: value,
          }))
        }
      }

      

    const getStatusColor = (status) => {
        switch (status) {
          case "completed":
            return "text-green-700 bg-green-100 border border-green-300";
          case "in-progress":
            return "text-blue-700 bg-blue-100 border border-blue-300";
          case "confirmed":
            return "text-yellow-700 bg-yellow-100 border border-yellow-300";
          case "pending":
            return "text-gray-700 bg-gray-100 border border-gray-300";
          case "cancelled":
            return "text-red-700 bg-red-100 border border-red-300";
          default:
            return "text-gray-700 bg-gray-50 border border-gray-200";
        }
      };
      
    
      const getStatusMessage = (status) => {
        switch (status) {
          case "pending":
            return "Waiting for provider confirmation"
          case "confirmed":
            return "Provider confirmed - service scheduled"
          case "in-progress":
            return "Service is currently in progress"
          case "completed":
            return "Service completed successfully"
          case "cancelled":
            return "Service was cancelled"
          default:
            return status
        }
      }

      const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
          <span key={index} className={`text-lg ${index < rating ? "text-yellow-400" : "text-gray-300"}`}>
            ★
          </span>
        ))
      }


  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-black">Welcome back,User</h1>
              <p className="text-gray-600">Manage your bookings and profile</p>
            </div>
            <Link
              to="/services"
              className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Book New Service
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: "overview", label: "Overview" },
                { id: "bookings", label: "My Bookings" },
                { id: "profile", label: "Profile" },
                { id: "reviews", label: "My Reviews" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-black text-black"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">

            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-black mb-2">Total Bookings</h3>
                    <p className="text-3xl font-bold text-black">{bookings.length}</p>
                    <p className="text-sm text-gray-600 mt-1">All time</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-black mb-2">Completed Services</h3>
                    <p className="text-3xl font-bold text-green-600">
                      {bookings.filter((b) => b.status === "completed").length}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Successfully finished</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-black mb-2">Active Bookings</h3>
                    <p className="text-3xl font-bold text-yellow-600">
                      {bookings.filter((b) => ["pending", "confirmed", "in-progress"].includes(b.status)).length}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">In progress</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4">Recent Bookings</h3>
                  <div className="space-y-4">
                    {bookings.slice(0, 3).map((booking) => (
                      <div key={booking._id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-black">{booking.serviceName}</h4>
                            <p className="text-gray-600">{booking.address}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(booking.preferredDate).toLocaleDateString()} at {booking.preferredTime}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">{getStatusMessage(booking.status)}</p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}
                            >
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === "bookings" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-black">All Bookings</h3>
                  <Link
                    to="/services"
                    className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
                  >
                    Book New Service
                  </Link>
                </div>

                {bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📅</div>
                    <h3 className="text-xl font-semibold text-black mb-2">No bookings yet</h3>
                    <p className="text-gray-600 mb-4">Book your first service to get started!</p>
                    <Link
                      to="/services"
                      className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Browse Services
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking._id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-xl font-semibold text-black">{booking.serviceName}</h4>
                            <p className="text-gray-600">{booking.description}</p>
                            {booking.providerId && (
                              <p className="text-sm text-gray-500 mt-1">
                                Provider: {booking.providerId.businessName || booking.providerId.name}
                              </p>
                            )}
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}
                          >
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                          <div>
                            <p className="text-gray-600">
                              <strong>Date:</strong> {new Date(booking.preferredDate).toLocaleDateString()}
                            </p>
                            <p className="text-gray-600">
                              <strong>Time:</strong> {booking.preferredTime}
                            </p>
                            <p className="text-gray-600">
                              <strong>Amount:</strong> ${booking.totalAmount || 75}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">
                              <strong>Address:</strong> {booking.address}
                            </p>
                            <p className="text-gray-600">
                              <strong>Contact:</strong> {booking.customerPhone}
                            </p>
                            <p className="text-gray-600">
                              <strong>Status:</strong> {getStatusMessage(booking.status)}
                            </p>
                          </div>
                        </div>

                        {booking.status === "completed" && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                              <div className="text-sm text-green-600 font-medium">
                                ✅ Service completed successfully!
                              </div>
                              <div className="space-x-2">
                                {!hasReviewed(booking._id) ? (
                                  <button
                                    onClick={() => handleLeaveReview(booking)}
                                    className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors text-sm"
                                  >
                                    Leave Review
                                  </button>
                                ) : (
                                  <span className="text-sm text-green-600 font-medium">✅ Reviewed</span>
                                )}
                                <Link
                                  to={`/book/${booking.serviceId}`}
                                  className="border border-black text-black px-4 py-2 rounded hover:bg-black hover:text-white transition-colors text-sm inline-block"
                                >
                                  Book Again
                                </Link>
                              </div>
                            </div>
                          </div>
                        )}

                        {booking.status === "in-progress" && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="text-sm text-blue-600 font-medium">
                              🔄 Service is currently in progress. The provider will update you when complete.
                            </div>
                          </div>
                        )}

                        {booking.status === "confirmed" && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="text-sm text-yellow-600 font-medium">
                              ⏰ Service confirmed! The provider will contact you soon.
                            </div>
                          </div>
                        )}

                        {booking.status === "pending" && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="text-sm text-gray-600 font-medium">
                              ⏳ Waiting for provider confirmation. You'll be notified once confirmed.
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="max-w-4xl">
                <h3 className="text-lg font-semibold text-black mb-6">Profile Information</h3>

                <form onSubmit={handleProfileUpdate} className="space-y-8">
                  {/* Personal Information */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="text-md font-semibold text-black mb-4">Personal Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Full Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={profile.name}
                          onChange={handleProfileChange}
                          required
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Email Address *</label>
                        <input
                          type="email"
                          name="email"
                          value={profile.email}
                          onChange={handleProfileChange}
                          required
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                          placeholder="Enter your email"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-black mb-2">Phone Number *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={profile.phone}
                          onChange={handleProfileChange}
                          required
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="text-md font-semibold text-black mb-4">Address Information</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Street Address</label>
                        <input
                          type="text"
                          name="address.street"
                          value={profile.address.street}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                          placeholder="Enter your street address"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">City</label>
                          <input
                            type="text"
                            name="address.city"
                            value={profile.address.city}
                            onChange={handleProfileChange}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                            placeholder="City"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">State</label>
                          <input
                            type="text"
                            name="address.state"
                            value={profile.address.state}
                            onChange={handleProfileChange}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                            placeholder="State"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">ZIP Code</label>
                          <input
                            type="text"
                            name="address.zipCode"
                            value={profile.address.zipCode}
                            onChange={handleProfileChange}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                            placeholder="ZIP Code"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updating}
                      className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updating ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Updating...</span>
                        </div>
                      ) : (
                        "Update Profile"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <div>
                <h3 className="text-lg font-semibold text-black mb-6">My Reviews</h3>

                {reviews.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">⭐</div>
                    <h3 className="text-xl font-semibold text-black mb-2">No reviews yet</h3>
                    <p className="text-gray-600">Complete a service to leave your first review!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review._id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-lg font-semibold text-black">{review.serviceName}</h4>
                            <p className="text-gray-600">
                              Provider: {review.providerId?.businessName || review.providerId?.name}
                            </p>
                            <div className="flex items-center mt-2">
                              <div className="flex items-center mr-3">{renderStars(review.rating)}</div>
                              <span className="text-sm text-gray-500">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed">"{review.comment}"</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  )
}

export default CustomerDashboard
