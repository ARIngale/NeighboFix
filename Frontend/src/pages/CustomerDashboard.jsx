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

    useEffect(() => {
        setBookings(sampleData);
    },[])

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
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="max-w-4xl">
                <h3 className="text-lg font-semibold text-black mb-6">Profile Information</h3>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <div>
                <h3 className="text-lg font-semibold text-black mb-6">My Reviews</h3>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  )
}

export default CustomerDashboard
