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
  
  
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setServiceForm({ ...serviceForm, [name]: value })
      }
    
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
    </div>

    )
}

export default ProviderDashboard;