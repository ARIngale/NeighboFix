"use client"

import { useAuth } from "../context/AuthContext"
import { useState, useEffect } from "react"
import AdminLogin from "./AdminLogin"

const AdminProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      setShowLogin(true)
    }
  }, [user, loading])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return (
      <>
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
          <div className="text-center max-w-md mx-auto">
            <div className="text-6xl mb-6">🔐</div>
            <h1 className="text-3xl font-bold text-black mb-4">Admin Access Required</h1>
            <p className="text-gray-600 mb-8">
              This section is restricted to platform administrators only. Please sign in with admin credentials to
              continue.
            </p>
            <button
              onClick={() => setShowLogin(true)}
              className="bg-black text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Admin Login
            </button>
          </div>
        </div>
        {showLogin && (
          <AdminLogin
            onClose={() => setShowLogin(false)}
            initialUserType="admin"
            onSuccess={() => {
              setShowLogin(false)
              window.location.reload()
            }}
          />
        )}
      </>
    )
  }

  return children
}

export default AdminProtectedRoute
