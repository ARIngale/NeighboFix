"use client"

import { useState } from "react"
import { Link } from "react-router-dom"


const CustomerDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview")

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
                    <p className="text-3xl font-bold text-black">0</p>
                    <p className="text-sm text-gray-600 mt-1">All time</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-black mb-2">Completed Services</h3>
                    <p className="text-3xl font-bold text-green-600">
                      0
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Successfully finished</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-black mb-2">Active Bookings</h3>
                    <p className="text-3xl font-bold text-yellow-600">
                     0
                    </p>
                    <p className="text-sm text-gray-600 mt-1">In progress</p>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-black mb-4">Recent Bookings</h3>

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
