"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

const Login = ({ onClose, initialUserType = "", redirectPath = null }) => {
  const [step, setStep] = useState(initialUserType ? "login" : "select")
  const [userType, setUserType] = useState(initialUserType)
  const [isLogin, setIsLogin] = useState(true)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    businessName: "",
    businessDescription: "",
  })
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: "",
    role: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const { login, register } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (initialUserType) {
      setUserType(initialUserType)
      setStep("login")
    }
  }, [initialUserType])

  const handleUserTypeSelect = (type) => {
    setUserType(type)
    setStep("login")
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleForgotPasswordChange = (e) => {
    setForgotPasswordData({
      ...forgotPasswordData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      let result
      if (isLogin) {
        result = await login(formData.email, formData.password, userType)
      } else {
        result = await register({
          ...formData,
          role: userType,
        })
      }

      if (result.success) {
        onClose()
        if (redirectPath) {
          navigate(redirectPath)
        } else {
          navigate(userType === "customer" ? "/customer-dashboard" : "/provider-dashboard")
        }
      } else {
        setError(result.message)
      }
    } catch (error) {
      setError("Something went wrong. Please try again.")
    }

    setLoading(false)
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("")

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(forgotPasswordData),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage("Password reset instructions have been sent to your email.")
        setTimeout(() => {
          setShowForgotPassword(false)
          setMessage("")
        }, 3000)
      } else {
        setError(data.message)
      }
    } catch (error) {
      setError("Failed to send reset email. Please try again.")
    }

    setLoading(false)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      businessName: "",
      businessDescription: "",
    })
    setError("")
    setMessage("")
  }

  const goBack = () => {
    if (showForgotPassword) {
      setShowForgotPassword(false)
      setError("")
      setMessage("")
      return
    }

    if (step === "login" || step === "register") {
      setStep("select")
      setUserType("")
      resetForm()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            {(step !== "select" && !initialUserType) || showForgotPassword ? (
              <button onClick={goBack} className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            ) : null}
            <h2 className="text-2xl font-bold text-black">
              {step === "select" && "Welcome to NeighboFix"}
              {step === "login" && !showForgotPassword && (isLogin ? "Sign In" : "Create Account")}
              {showForgotPassword && "Reset Password"}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Forgot Password Form */}
          {showForgotPassword && (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 mb-6">
                  Enter your email address and account type to receive password reset instructions.
                </p>
              </div>

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={forgotPasswordData.email}
                    onChange={handleForgotPasswordChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                    Account Type
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={forgotPasswordData.role}
                    onChange={handleForgotPasswordChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select account type</option>
                    <option value="customer">Customer</option>
                    <option value="provider">Service Provider</option>
                  </select>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                {message && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-600 text-sm">{message}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </div>
                  ) : (
                    "Send Reset Instructions"
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Step 1: User Type Selection */}
          {step === "select" && !showForgotPassword && (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 mb-8">Choose how you'd like to use NeighboFix</p>
              </div>

              <div className="space-y-4">
                {/* Customer Option */}
                <button
                  onClick={() => handleUserTypeSelect("customer")}
                  className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-black hover:bg-gray-50 transition-all duration-200 text-left group"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-200">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-black mb-1">I need services</h3>
                      <p className="text-gray-600 text-sm">
                        Book trusted professionals for home repairs and maintenance
                      </p>
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <span>✓ Book services</span>
                        <span className="mx-2">•</span>
                        <span>✓ Track bookings</span>
                        <span className="mx-2">•</span>
                        <span>✓ Leave reviews</span>
                      </div>
                    </div>
                  </div>
                </button>

                {/* Provider Option */}
                <button
                  onClick={() => handleUserTypeSelect("provider")}
                  className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-black hover:bg-gray-50 transition-all duration-200 text-left group"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors duration-200">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-black mb-1">I provide services</h3>
                      <p className="text-gray-600 text-sm">
                        Join our network of trusted professionals and grow your business
                      </p>
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <span>✓ Manage bookings</span>
                        <span className="mx-2">•</span>
                        <span>✓ Track earnings</span>
                        <span className="mx-2">•</span>
                        <span>✓ Build reputation</span>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Login/Register Form */}
          {step === "login" && !showForgotPassword && (
            <div className="space-y-6">
              {/* User Type Display */}
              <div className="flex items-center justify-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    userType === "customer" ? "bg-blue-100" : "bg-green-100"
                  }`}
                >
                  <svg
                    className={`w-4 h-4 ${userType === "customer" ? "text-blue-600" : "text-green-600"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {userType === "customer" ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    )}
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {userType === "customer" ? "Customer Account" : "Service Provider Account"}
                </span>
              </div>

              {/* Toggle Login/Register */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => {
                    setIsLogin(true)
                    resetForm()
                  }}
                  className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
                    isLogin ? "bg-white text-black shadow-sm" : "text-gray-600 hover:text-black"
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setIsLogin(false)
                    resetForm()
                  }}
                  className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
                    !isLogin ? "bg-white text-black shadow-sm" : "text-gray-600 hover:text-black"
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                      placeholder="Enter your full name"
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                    placeholder="Enter your password"
                  />
                </div>

                {!isLogin && (
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                      placeholder="Enter your phone number"
                    />
                  </div>
                )}

                {!isLogin && userType === "provider" && (
                  <>
                    <div>
                      <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
                        Business Name
                      </label>
                      <input
                        type="text"
                        id="businessName"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                        placeholder="Enter your business name"
                      />
                    </div>
                    <div>
                      <label htmlFor="businessDescription" className="block text-sm font-medium text-gray-700 mb-2">
                        Business Description
                      </label>
                      <textarea
                        id="businessDescription"
                        name="businessDescription"
                        value={formData.businessDescription}
                        onChange={handleChange}
                        required
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 resize-none"
                        placeholder="Describe your business and services"
                      />
                    </div>
                  </>
                )}

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Please wait...</span>
                    </div>
                  ) : isLogin ? (
                    "Sign In"
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>

              {isLogin && (
                <div className="text-center">
                  <button
                    onClick={() => {
                      setShowForgotPassword(true)
                      setForgotPasswordData({ ...forgotPasswordData, role: userType })
                    }}
                    className="text-sm text-gray-600 hover:text-black transition-colors duration-200"
                  >
                    Forgot your password?
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Login
