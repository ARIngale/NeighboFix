import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"
import Login from "../components/Login"
import FavoriteButton from "../components/FavoriteButton"

const Services = () => {

  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [showLogin, setShowLogin] = useState(false)
  const [redirectService, setRedirectService] = useState(null)
  const [loading, setLoading] = useState(true)

  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchServices()
  }, []);

  useEffect(() => {
    filterAndSortServices();
  }, [services, selectedCategory, searchTerm, priceRange, sortBy]);

  const fetchServices = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/services`)
      const data = await response.json()
      setServices(data)
      setFilteredServices(data)
    } catch (error) {
      console.error("Error fetching services:", error)
    } finally {
      setLoading(false)
    }
  }
  const filterAndSortServices = () => {
    let filtered = [...services];

    if (selectedCategory !== "All") {
      filtered = filtered.filter((s) => s.category === selectedCategory);
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.providerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (priceRange !== "All") {
      const [min, max] = priceRange === "200+" ? [201, Infinity] : priceRange.split("-").map(Number);
      filtered = filtered.filter((s) => s.basePrice >= min && s.basePrice <= max);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price-low":
          return a.basePrice - b.basePrice;
        case "price-high":
          return b.basePrice - a.basePrice;
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

    setFilteredServices(filtered);
  };

  const handleBookNow = (serviceId) => {
    if (!user) {
      setRedirectService(serviceId)
      setShowLogin(true)
    } else {
      navigate(`/book/${serviceId}`)
    }
  }

  const handleLoginSuccess = () => {
    setShowLogin(false)
    if (redirectService) {
      navigate(`/book/${redirectService}`)
      setRedirectService(null)
    }
  }


  const categories = ["All", ...new Set(services.map((s) => s.category))];

  
  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">Our Services</h1>
          <p className="text-xl text-gray-600">Professional home services for every need</p>
        </div>

        {/* Filters */}
        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Input */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">Search Services</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or description..."
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">Price Range</label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="All">All Prices</option>
                <option value="0-50">$0 - $50</option>
                <option value="51-100">$51 - $100</option>
                <option value="101-200">$101 - $200</option>
                <option value="200+">$200+</option>
              </select>
            </div>

            {/* Sort Filter */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="name">Name (A-Z)</option>
                <option value="price-low">Price (Low to High)</option>
                <option value="price-high">Price (High to Low)</option>
                <option value="rating">Rating (High to Low)</option>
              </select>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredServices.length} of {services.length} services
            {searchTerm && ` for "${searchTerm}"`}
          </div>
        </div>

        {/* Service Cards */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <div
                onClick={() => navigate(`/service/${service._id}`)}
                key={service._id}
                className="group bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center text-2xl group-hover:bg-black group-hover:text-white">
                      {service.icon}
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500 mb-1">Starting at</div>
                      <div className="text-2xl font-bold text-black">${service.basePrice}</div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-black mb-2">{service.name}</h3>
                  <p className="text-gray-600 mb-3 line-clamp-2">{service.description}</p>

                  <div
                    onClick={(e) => {
                      e.stopPropagation(); // prevent triggering outer onClick
                      navigate(`/provider/${service.providerId._id}`);
                    }}
                    className="block mb-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                  >                    
                <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{service.providerName}</p>
                        <div className="flex items-center mt-1">
                          <span className="text-yellow-400 text-sm">★</span>
                          <span className="text-sm text-gray-600 ml-1">
                            {service.rating > 0 ? service.rating : "New"}
                          </span>
                          {service.totalReviews > 0 && (
                            <span className="text-xs text-gray-500 ml-2">({service.totalReviews} reviews)</span>
                          )}
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          service.providerId.isVerified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {service.providerId.isVerified ? "Verified" : "Unverified"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                      {service.category}
                    </span>
                    <div className="flex items-center gap-2 mt-4">
                    {user && user.role === "customer" && (
                      <FavoriteButton
                        serviceId={service?._id}
                        providerId={service?.providerId?._id}
                        type="service"
                        className="ml-0"
                      />
                    )}
                      <button
                        onClick={() => handleBookNow(service._id)}
                        className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-black mb-2">No services found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
                setPriceRange("All");
                setSortBy("name");
              }}
              className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Custom Service CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gray-50 p-8 rounded-lg border-2 border-dashed border-gray-300">
            <h3 className="text-2xl font-bold text-black mb-4">Don't see what you need?</h3>
            <p className="text-gray-600 mb-6">We work with various professionals. Let us know what service you need!</p>
            <Link
              to="/contact"
              className="bg-black text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-800 inline-block"
            >
              Request Custom Service
            </Link>
          </div>
        </div>
      </div>
      {/* Login Modal */}
      {showLogin && (
        <Login
          onClose={() => {
            setShowLogin(false)
            setRedirectService(null)
          }}
          initialUserType="customer"
          onSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
};

export default Services;
