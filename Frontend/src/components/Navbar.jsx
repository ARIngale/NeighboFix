
import { useState } from "react"
import { useLocation, Link } from "react-router-dom"
import Login from "./Login"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false) //mobile menu
  const location = useLocation();
  const [showLogin, setShowLogin] = useState(false)
  const [loginType, setLoginType] = useState("")

  const handleloginclick = (type) => {
    setLoginType(type)
    setShowLogin(true)
  }

  const isActive = (path) =>
    location.pathname === path
      ? "text-black border-b-2 border-black"
      : "text-gray-700 hover:text-black";
  
    const isActiveMobile = (path) =>
        location.pathname === path
            ? "text-black bg-gray-100 font-semibold"
            : "text-gray-700 hover:text-black hover:bg-gray-50";


  return (
    <>
      <nav className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">N</span>
                </div>
                <span className="text-2xl font-bold text-black">NeighboFix</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
                <Link
                to="/"
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${isActive("/")}`}
                >
                Home
                </Link>
                <Link
                to="/services"
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${isActive("/services")}`}
                >
                Services
                </Link>
                <Link
                to="/how-it-works"
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${isActive("/how-it-works")}`}
                >
                How It Works
                </Link>
                <Link
                to="/why-choose-us"
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${isActive("/why-choose-us")}`}
                >
                Why Choose Us
                </Link>
                <Link
                to="/contact"
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${isActive("/contact")}`}
                >
                Contact
                </Link>
            </div>

            {/* User Actions */}
            <div className="hidden lg:flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                  {/* Customer Login Button */}
                  <button
                    onClick={() => handleloginclick("customer")}
                    className="flex items-center space-x-2 text-gray-700 hover:text-black px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:border-gray-400 transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span className="hidden md:block">Customer</span>
                  </button>

                  {/* Provider Login Button */}
                  <button
                    onClick={() => handleloginclick("provider")}
                    className="flex items-center space-x-2 text-white bg-black hover:bg-gray-800 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="hidden md:block">Provider</span>
                  </button>
                </div>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-700 hover:text-black focus:outline-none p-2"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100">
            <div className="px-4 pt-2 pb-3 space-y-1">
            <Link
                to="/"
                className={`block px-3 py-3 text-base font-medium rounded-lg transition-colors duration-200 ${isActiveMobile("/")}`}
                onClick={() => setIsOpen(false)}
            >
                Home
            </Link>
            <Link
                to="/services"
                className={`block px-3 py-3 text-base font-medium rounded-lg transition-colors duration-200 ${isActiveMobile("/services")}`}
                onClick={() => setIsOpen(false)}
            >
                Services
            </Link>
            <Link
                to="/how-it-works"
                className={`block px-3 py-3 text-base font-medium rounded-lg transition-colors duration-200 ${isActiveMobile("/how-it-works")}`}
                onClick={() => setIsOpen(false)}
            >
                How It Works
            </Link>
            <Link
                to="/why-choose-us"
                className={`block px-3 py-3 text-base font-medium rounded-lg transition-colors duration-200 ${isActiveMobile("/why-choose-us")}`}
                onClick={() => setIsOpen(false)}
            >
                Why Choose Us
            </Link>
            <Link
                to="/contact"
                className={`block px-3 py-3 text-base font-medium rounded-lg transition-colors duration-200 ${isActiveMobile("/contact")}`}
                onClick={() => setIsOpen(false)}
            >
                Contact
            </Link>
            <div className="pt-4 border-t border-gray-100 mt-4 space-y-2">
                  <button
                    onClick={() => {
                      handleloginclick("customer")
                      setIsOpen(false)
                    }}
                    className="flex items-center justify-center w-full text-gray-700 hover:text-black border border-gray-300 hover:border-gray-400 px-4 py-3 text-base font-medium rounded-lg transition-all duration-200"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Customer Login
                  </button>
                  <button
                    onClick={() => {
                      handleloginclick("provider")
                      setIsOpen(false)
                    }}
                    className="flex items-center justify-center w-full bg-black text-white px-4 py-3 text-base font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Provider Login
                  </button>
                </div>
            </div>
          </div>
        )}
      </nav>
      {showLogin && <Login onClose={() => setShowLogin(false)} initialUserType={loginType} />}
    </>
  )
}

export default Navbar
