
import { useState } from "react"
import { useLocation, Link } from "react-router-dom"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false) //mobile menu
  const location = useLocation();

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
            </div>
          </div>
        )}
      </nav>

    </>
  )
}

export default Navbar
