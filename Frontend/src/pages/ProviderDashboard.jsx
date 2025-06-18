const ProviderDashboard = () => {
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
        </div>
        </div>
    )
}

export default ProviderDashboard;