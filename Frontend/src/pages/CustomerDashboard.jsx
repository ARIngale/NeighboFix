"use client"

import { useState } from "react"
import { Link } from "react-router-dom"


const CustomerDashboard = () => {

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

      </div>

    </div>
  )
}

export default CustomerDashboard
