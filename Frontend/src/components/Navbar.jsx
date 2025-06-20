import { useState , useEffect} from "react"
import { useLocation, Link ,useNavigate} from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Login from "./Login"
import NotificationCenter from "./NotificationCenter"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false) //ismobile 
  const location = useLocation()
  const [showLogin, setShowLogin] = useState(false)
  const [loginType, setLoginType] = useState("")
  const { user, logout,token } = useAuth()
  const navigate = useNavigate()
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (user && token) {
      fetchUnreadCount()
      const interval = setInterval(fetchUnreadCount, 30000)
      return () => clearInterval(interval)
    }
  }, [user, token])

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/notifications?unreadOnly=true", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setUnreadCount(data.unreadCount)
      }
    } catch (error) {
      console.error("Error fetching unread count:", error)
    }
  }

  const handleLoginClick = (type) => {
    setLoginType(type)
    setShowLogin(true)
  }

  const handleLogout = () => {
    logout()
    navigate("/") // Redirect to home page after logout
    setIsOpen(false)
  }

  const isActive = (path) =>
    location.pathname === path
      ? "text-black border-b-2 border-black"
      : "text-gray-700 hover:text-black"

  const isActiveMobile = (path) =>
    location.pathname === path
      ? "text-black bg-gray-100 font-semibold"
      : "text-gray-700 hover:text-black hover:bg-gray-50"

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
              <Link to="/" className={`px-3 py-2 text-sm font-medium ${isActive("/")}`}>Home</Link>
              <Link to="/services" className={`px-3 py-2 text-sm font-medium ${isActive("/services")}`}>Services</Link>
              <Link to="/how-it-works" className={`px-3 py-2 text-sm font-medium ${isActive("/how-it-works")}`}>How It Works</Link>
              <Link to="/why-choose-us" className={`px-3 py-2 text-sm font-medium ${isActive("/why-choose-us")}`}>Why Choose Us</Link>
              <Link to="/contact" className={`px-3 py-2 text-sm font-medium ${isActive("/contact")}`}>Contact</Link>
            </div>

            {/* User Actions */}
            <div className="hidden lg:flex items-center space-x-3">
              {user ? (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowNotifications(true)}
                    className="relative p-2 text-gray-700 hover:text-black transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}

                  </button>
                  <Link
                    to={
                      user.role === "customer"
                        ? "/customer-dashboard"
                        : user.role === "provider"
                        ? "/provider-dashboard"
                        : "/admin"
                    }                    
                    className="flex items-center space-x-2 text-gray-700 hover:text-black px-3 py-2 text-sm font-medium"
                  >
                    <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden xl:block">Dashboard</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleLoginClick("customer")}
                    className="flex items-center space-x-2 text-gray-700 hover:text-black px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:border-gray-400"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="hidden md:block">Customer</span>
                  </button>
                  <button
                    onClick={() => handleLoginClick("provider")}
                    className="flex items-center space-x-2 text-white bg-black hover:bg-gray-800 px-4 py-2 text-sm font-medium rounded-lg"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="hidden md:block">Provider</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">                      
              <button
                  onClick={() => {
                    setShowNotifications(true)
                    setIsOpen(false)
                  }}
                  className="relative p-2 text-gray-700 hover:text-black transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>      

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
              {["/", "/services", "/how-it-works", "/why-choose-us", "/contact"].map(path => (
                <Link
                  key={path}
                  to={path}
                  className={`block px-3 py-3 text-base font-medium rounded-lg ${isActiveMobile(path)}`}
                  onClick={() => setIsOpen(false)}
                >
                  {path === "/" ? "Home" : path.replace("/", "").replace(/-/g, " ")}
                </Link>
              ))}
              {user ? (
                <div className="pt-4 border-t border-gray-100 mt-4">
                  <div className="flex items-center px-3 py-2 mb-2">
                    <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black">{user.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                  </div>
                  <Link
                    to={
                      user.role === "customer"
                        ? "/customer-dashboard"
                        : user.role === "provider"
                        ? "/provider-dashboard"
                        : "/admin"
                    }                    
                    className="block text-gray-700 hover:text-black hover:bg-gray-50 px-3 py-3 text-base font-medium rounded-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left text-gray-500 hover:text-gray-700 hover:bg-gray-50 px-3 py-3 text-base font-medium rounded-lg"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-100 mt-4 space-y-2">
                  <button
                    onClick={() => {
                      handleLoginClick("customer")
                      setIsOpen(false)
                    }}
                    className="flex items-center justify-center w-full text-gray-700 border border-gray-300 hover:border-gray-400 px-4 py-3 text-base font-medium rounded-lg"
                  >
                    Customer Login
                  </button>
                  <button
                    onClick={() => {
                      handleLoginClick("provider")
                      setIsOpen(false)
                    }}
                    className="flex items-center justify-center w-full bg-black text-white px-4 py-3 text-base font-medium rounded-lg hover:bg-gray-800"
                  >
                    Provider Login
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Login Modal */}
      {showLogin && <Login onClose={() => setShowLogin(false)} initialUserType={loginType} />}

      {/* Notification Center */}
      <NotificationCenter isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
        
    </>
  )
}

export default Navbar
