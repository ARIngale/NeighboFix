"use client"

import { useAuth } from "../context/AuthContext"
import { useState, useEffect } from "react"
import Login from "./Login"

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading } = useAuth()
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      setShowLogin(true)
    } else if (!loading && user && requiredRole && user.role !== requiredRole) {
      // If user is logged in but doesn't have the required role
      setShowLogin(true)
    }
  }, [user, loading, requiredRole])

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

  if (!user) {
    return (
      <>
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
          <div className="text-center max-w-md mx-auto">
            <div className="text-6xl mb-6">🔒</div>
            <h1 className="text-3xl font-bold text-black mb-4">Login Required</h1>
            <p className="text-gray-600 mb-8">
              You need to be logged in as a {requiredRole || "user"} to access this page. Please sign in to continue.
            </p>
            <button
              onClick={() => setShowLogin(true)}
              className="bg-black text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Sign In as {requiredRole || "User"}
            </button>
          </div>
        </div>
        {showLogin && (
          <Login
            onClose={() => setShowLogin(false)}
            initialUserType={requiredRole || "customer"}
            onSuccess={() => {
              setShowLogin(false)
              window.location.reload() // Refresh to update the auth state
            }}
          />
        )}
      </>
    )
  }

  if (requiredRole && user.role !== requiredRole) {
    return (
      <>
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
          <div className="text-center max-w-md mx-auto">
            <div className="text-6xl mb-6">⚠️</div>
            <h1 className="text-3xl font-bold text-black mb-4">Wrong Account Type</h1>
            <p className="text-gray-600 mb-8">
              You are logged in as a {user.role}, but this page requires a {requiredRole} account. Please login with the
              correct account type.
            </p>
            <div className="space-y-4">
              <button
                onClick={() => setShowLogin(true)}
                className="bg-black text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-colors block w-full"
              >
                Login as {requiredRole}
              </button>
              <button
                onClick={() => window.history.back()}
                className="border-2 border-black text-black px-8 py-3 rounded-lg text-lg font-semibold hover:bg-black hover:text-white transition-colors block w-full"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
        {showLogin && (
          <Login
            onClose={() => setShowLogin(false)}
            initialUserType={requiredRole}
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

export default ProtectedRoute
