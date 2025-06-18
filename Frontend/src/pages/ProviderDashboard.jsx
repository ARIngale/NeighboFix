import { useState } from "react"

const ProviderDashboard = () => {
    const [activeTab, setActiveTab] = useState("overview")
    const [services, setServices] = useState([])
    const [showServiceModal, setShowServiceModal] = useState(false)
    const [editingService, setEditingService] = useState(null)
    const [serviceForm, setServiceForm] = useState({
      name: "",
      description: "",
      icon: "🔧",
      basePrice: "",
      category: "",
    })
    const [analytics, setAnalytics] = useState({})
    const [bookings, setBookings] = useState([
        {
          _id: "1",
          serviceName: "Plumbing Repair",
          description: "Fix leaking kitchen pipe.",
          customerName: "Rahul Sharma",
          customerPhone: "9876543210",
          customerEmail: "rahul@example.com",
          preferredDate: new Date().toISOString(),
          preferredTime: "10:00 AM",
          address: "123 MG Road, Pune",
          status: "pending", // other statuses: confirmed, in-progress, completed, cancelled
        },
        {
          _id: "2",
          serviceName: "Electrical Fix",
          description: "Repair bedroom fan.",
          customerName: "Sneha Desai",
          customerPhone: "9123456780",
          customerEmail: "sneha@example.com",
          preferredDate: new Date().toISOString(),
          preferredTime: "2:00 PM",
          address: "456 JM Road, Pune",
          status: "confirmed",
        },
      ])
      const [showPaymentModal, setShowPaymentModal] = useState(false)
      const [selectedBooking, setSelectedBooking] = useState(null)
      const [feedback, setFeedback] = useState([])
      const [paymentForm, setPaymentForm] = useState({
        amount: "",
        paymentMethod: "cash",
        notes: "",
      })
      
  
    
      const handleServiceSubmit = (e) => {
        e.preventDefault(); // <-- Add this
        if (!serviceForm.name || !serviceForm.basePrice) {
          alert("Name and Base Price are required!");
          return;
        }
      
        if (editingService) {
          const updated = services.map((s) =>
            s._id === editingService._id ? { ...s, ...serviceForm } : s
          );
          setServices(updated);
          setEditingService(null);
        } else {
          const newService = {
            ...serviceForm,
            _id: Date.now().toString(),
          };
          setServices([...services, newService]);
        }
      
        setShowServiceModal(false);
        resetForm();
      };
      
      const handleEditService = (service) => {
        setEditingService(service)
        setServiceForm({ ...service })
        setShowServiceModal(true)
      }
    
      const handleDeleteService = (id) => {
        if (window.confirm("Are you sure you want to delete this service?")) {
          setServices(services.filter((s) => s._id !== id))
        }
      }
    
      const resetForm = () => {
        setServiceForm({
          name: "",
          description: "",
          icon: "🔧",
          basePrice: "",
          category: "",
        })
      }

      const handleBookingAction = (id, newStatus) => {
        const updatedBookings = bookings.map((booking) =>
          booking._id === id ? { ...booking, status: newStatus } : booking
        )
        setBookings(updatedBookings)
      }

      const getStatusColor = (status) => {
        switch (status) {
          case "completed":
            return "text-green-600 bg-green-100"
          case "in-progress":
            return "text-blue-600 bg-blue-100"
          case "confirmed":
            return "text-yellow-600 bg-yellow-100"
          case "pending":
            return "text-gray-600 bg-gray-100"
          case "cancelled":
            return "text-red-600 bg-red-100"
          default:
            return "text-gray-600 bg-gray-100"
        }
      }

    const handleCompleteService = (booking) => {
        setSelectedBooking(booking)
        setPaymentForm({
        amount: booking.totalAmount || "75",
        paymentMethod: "cash",
        notes: "",
        })
        setShowPaymentModal(true)
    }

    const handlePaymentSubmit = async (e) => {
        e.preventDefault()
        setShowPaymentModal(false)
        setSelectedBooking(null)
        alert("Service completed and payment recorded successfully!")

    }
    
    const generateInsights = () => {
        const completedBookings = bookings.filter((b) => b.status === "completed")
        const totalRating = feedback.reduce((sum, review) => sum + review.rating, 0)
        const avgRating = feedback.length > 0 ? (totalRating / feedback.length).toFixed(1) : 0
    
        const insights = []
    
        if (avgRating >= 4.5) {
          insights.push("Excellent work! Your high ratings show customers love your service quality.")
        } else if (avgRating >= 4.0) {
          insights.push("Good job! Consider focusing on areas mentioned in reviews to reach 4.5+ stars.")
        } else if (avgRating > 0) {
          insights.push("There's room for improvement. Focus on customer communication and service quality.")
        }
    
        if (completedBookings.length > 10) {
          insights.push("Great job on completing many services! Consider expanding your service offerings.")
        }
    
        if (services.length < 3) {
          insights.push("Consider adding more services to attract a wider range of customers.")
        }
    
        return insights.length > 0
          ? insights
          : ["Keep up the good work! Complete more services to get personalized insights."]
      }
      
    return (
        <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-black">Provider Dashboard</h1>
                <p className="text-gray-600">Welcome back,!</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Earnings</p>
                  <p className="text-2xl font-bold text-green-600">${0}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Rating</p>
                  <p className="text-2xl font-bold text-black">{0} ⭐</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: "overview", label: "Overview" },
                { id: "bookings", label: "Active Bookings" },
                { id: "services", label: "My Services" },
                { id: "analytics", label: "Analytics" },
                { id: "feedback", label: "Feedback" },
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

            {/* Overview*/}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-black mb-2">Total Jobs</h3>
                    <p className="text-3xl font-bold text-black">{analytics.completedJobs || 0}</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-black mb-2">This Month</h3>
                    <p className="text-3xl font-bold text-blue-600">{analytics.monthlyBookings || 0}</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-black mb-2">Reviews</h3>
                    <p className="text-3xl font-bold text-yellow-600">{analytics.totalReviews || 0}</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-black mb-2">Earnings</h3>
                    <p className="text-3xl font-bold text-green-600">${analytics.totalEarnings || 0}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Active Bookings Tab */}
            {activeTab === "bookings" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-black">Active Service Requests</h3>

                {bookings.filter((b) => b.status !== "completed" && b.status !== "cancelled").length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📋</div>
                    <h3 className="text-xl font-semibold text-black mb-2">No active bookings</h3>
                    <p className="text-gray-600">New service requests will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings
                      .filter((b) => b.status !== "completed" && b.status !== "cancelled")
                      .map((booking) => (
                        <div key={booking._id} className="border border-gray-200 rounded-lg p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="text-xl font-semibold text-black">{booking.serviceName}</h4>
                              <p className="text-gray-600">{booking.description}</p>
                            </div>
                            <span
                                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}
                                >
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                            <div>
                              <p className="text-gray-600">
                                <strong>Customer:</strong> {booking.customerName}
                              </p>
                              <p className="text-gray-600">
                                <strong>Phone:</strong> {booking.customerPhone}
                              </p>
                              <p className="text-gray-600">
                                <strong>Email:</strong> {booking.customerEmail}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">
                                <strong>Date:</strong> {new Date(booking.preferredDate).toLocaleDateString()}
                              </p>
                              <p className="text-gray-600">
                                <strong>Time:</strong> {booking.preferredTime}
                              </p>
                              <p className="text-gray-600">
                                <strong>Address:</strong> {booking.address}
                              </p>
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            {booking.status === "pending" && (
                              <>
                                <button
                                  onClick={() => handleBookingAction(booking._id, "confirmed")}
                                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() => handleBookingAction(booking._id, "cancelled")}
                                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                                >
                                  Decline
                                </button>
                              </>
                            )}
                            {booking.status === "confirmed" && (
                              <button
                                onClick={() => handleBookingAction(booking._id, "in-progress")}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                              >
                                Start Job
                              </button>
                            )}
                            {booking.status === "in-progress" && (
                              <button
                                onClick={() => handleCompleteService(booking)}
                                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
                              >
                                Complete & Get Payment
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* Services Tab */}
            {activeTab === "services" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-black">My Services</h3>
                  <button
                    onClick={() => {
                      setEditingService(null)
                      setServiceForm({
                        name: "",
                        description: "",
                        icon: "🔧",
                        basePrice: "",
                        category: "",
                      })
                      setShowServiceModal(true)
                    }}
                    className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
                  >
                    Add New Service
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map((service) => (
                    <div key={service._id} className="border border-gray-200 rounded-lg p-6">
                      <div className="text-4xl mb-4">{service.icon}</div>
                      <h4 className="text-xl font-semibold text-black mb-2">{service.name}</h4>
                      <p className="text-gray-600 mb-4">{service.description}</p>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold text-black">Starting at ${service.basePrice}</span>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{service.category}</span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditService(service)}
                          className="flex-1 bg-black text-white px-3 py-2 rounded text-sm hover:bg-gray-800 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteService(service._id)}
                          className="flex-1 border border-red-600 text-red-600 px-3 py-2 rounded text-sm hover:bg-red-600 hover:text-white transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {services.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🛠️</div>
                    <h3 className="text-xl font-semibold text-black mb-2">No services yet</h3>
                    <p className="text-gray-600 mb-4">Add your first service to start receiving bookings!</p>
                    <button
                      onClick={() => setShowServiceModal(true)}
                      className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Add Your First Service
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === "analytics" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-black">Performance Analytics</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-black mb-4">Booking Status</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Pending</span>
                        <span className="font-semibold text-gray-600">{analytics.pendingBookings || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Confirmed</span>
                        <span className="font-semibold text-yellow-600">{analytics.confirmedBookings || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>In Progress</span>
                        <span className="font-semibold text-blue-600">{analytics.inProgressBookings || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Completed</span>
                        <span className="font-semibold text-green-600">{analytics.completedJobs || 0}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-black mb-4">Performance Metrics</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Response Rate</span>
                        <span className="font-semibold">{analytics.responseRate || 0}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average Rating</span>
                        <span className="font-semibold">{analytics.averageRating || 0}/5</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Reviews</span>
                        <span className="font-semibold">{analytics.totalReviews || 0}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-black mb-4">Earnings</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Total Earnings</span>
                        <span className="font-semibold text-green-600">${analytics.totalEarnings || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>This Month</span>
                        <span className="font-semibold text-green-600">${analytics.monthlyEarnings || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg per Job</span>
                        <span className="font-semibold">$75</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-black mb-4">Monthly Trends</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium text-black mb-2">Booking Trends</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>This Month</span>
                          <span className="font-semibold">{analytics.monthlyBookings || 0} bookings</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Completion Rate</span>
                          <span className="font-semibold">
                            {analytics.totalBookings > 0
                              ? Math.round((analytics.completedJobs / analytics.totalBookings) * 100)
                              : 0}
                            %
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium text-black mb-2">Revenue Trends</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Monthly Revenue</span>
                          <span className="font-semibold text-green-600">${analytics.monthlyEarnings || 0}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Growth Rate</span>
                          <span className="font-semibold text-green-600">+15%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Feedback Tab */}
            {activeTab === "feedback" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-black">Customer Feedback & Insights</h3>

                {/* Key Insights */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-black mb-4">Key Insights</h4>
                  <div className="space-y-3">
                    {generateInsights().map((insight, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-4 h-4 bg-blue-500 rounded-full mr-3 mt-1 flex-shrink-0"></div>
                        <span className="text-gray-700">{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-black mb-2">Average Rating</h4>
                    <p className="text-3xl font-bold text-green-600">
                      {feedback.length > 0
                        ? (feedback.reduce((sum, r) => sum + r.rating, 0) / feedback.length).toFixed(1)
                        : "0.0"}
                    </p>
                    <p className="text-sm text-gray-600">Based on {feedback.length} reviews</p>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-black mb-2">Completion Rate</h4>
                    <p className="text-3xl font-bold text-yellow-600">
                      {bookings.length > 0
                        ? Math.round((bookings.filter((b) => b.status === "completed").length / bookings.length) * 100)
                        : 0}
                      %
                    </p>
                    <p className="text-sm text-gray-600">Of all bookings</p>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-black mb-2">Response Time</h4>
                    <p className="text-3xl font-bold text-purple-600">2.5h</p>
                    <p className="text-sm text-gray-600">Average response</p>
                  </div>
                </div>

                {/* Recent Reviews */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-black mb-4">Recent Customer Reviews</h4>
                  {feedback.length > 0 ? (
                    <div className="space-y-4">
                      {feedback.slice(0, 5).map((review) => (
                        <div key={review._id} className="border-l-4 border-green-500 pl-4">
                          <div className="flex items-center mb-2">
                            <div className="text-yellow-400 mr-2">
                              {"★".repeat(review.rating)}
                              {"☆".repeat(5 - review.rating)}
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-1">"{review.comment}"</p>
                          <p className="text-sm text-gray-500">{review.serviceName} - Customer</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-4">💬</div>
                      <p className="text-gray-600">No reviews yet. Complete some services to receive feedback!</p>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    {/* Service Modal */}
    {showServiceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-black">{editingService ? "Edit Service" : "Add New Service"}</h3>
                <button onClick={() => setShowServiceModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleServiceSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Service Name</label>
                  <input
                    type="text"
                    value={serviceForm.name}
                    onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="e.g., Plumbing Repair"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">Description</label>
                  <textarea
                    value={serviceForm.description}
                    onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                    required
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Describe your service..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">Icon</label>
                  <select
                    value={serviceForm.icon}
                    onChange={(e) => setServiceForm({ ...serviceForm, icon: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="🔧">🔧 Plumbing</option>
                    <option value="⚡">⚡ Electrical</option>
                    <option value="🌱">🌱 Gardening</option>
                    <option value="🔨">🔨 Carpentry</option>
                    <option value="🎨">🎨 Painting</option>
                    <option value="🧹">🧹 Cleaning</option>
                    <option value="❄️">❄️ HVAC</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">Starting Price ($)</label>
                  <input
                    type="number"
                    value={serviceForm.basePrice}
                    onChange={(e) => setServiceForm({ ...serviceForm, basePrice: e.target.value })}
                    required
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">Category</label>
                  <select
                    value={serviceForm.category}
                    onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="">Select Category</option>
                    <option value="Home Repair">Home Repair</option>
                    <option value="Outdoor">Outdoor</option>
                    <option value="Appliances">Appliances</option>
                    <option value="Home Improvement">Home Improvement</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowServiceModal(false)}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 bg-black text-white py-3 rounded-lg hover:bg-gray-800">
                    {editingService ? "Update Service" : "Add Service"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
    )}

        {/* Payment Modal */}
        {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-black">Complete Service & Payment</h3>
                <button onClick={() => setShowPaymentModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-black">{selectedBooking?.serviceName}</h4>
                <p className="text-gray-600">Customer: {selectedBooking?.customerName}</p>
                <p className="text-gray-600">Date: {new Date(selectedBooking?.preferredDate).toLocaleDateString()}</p>
              </div>

              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Service Amount ($)</label>
                  <input
                    type="number"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                    required
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="75"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">Payment Method</label>
                  <select
                    value={paymentForm.paymentMethod}
                    onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Credit/Debit Card</option>
                    <option value="digital_wallet">Digital Wallet</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">Notes (Optional)</label>
                  <textarea
                    value={paymentForm.notes}
                    onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Any additional notes about the service..."
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(false)}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700">
                    Complete Service
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>

    )
}

export default ProviderDashboard;