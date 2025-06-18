import { useState } from "react"

const ProviderDashboard = () => {
    const [activeTab, setActiveTab] = useState("overview")

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
        </div>
      </div>
    </div>

    )
}

export default ProviderDashboard;