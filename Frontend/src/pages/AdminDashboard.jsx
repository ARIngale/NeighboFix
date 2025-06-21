"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"

const AdminDashboard = () => {
  const { token } = useAuth()
  const [analytics, setAnalytics] = useState({})
  const [monthlyData, setMonthlyData] = useState([])
  const [providerEarnings, setProviderEarnings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [contactMessages, setContactMessages] = useState([])
  const [showModal,setShowModal]=useState(false)
  const [selectedMessage, setSelectedMessage] = useState("");
  const [unVerified,setUnVerified]=useState([]);

  useEffect(() => {
    fetchAnalytics()
    fetchMonthlyData()
    fetchProviderEarnings()
    fetchContactMessages()
    fetchUnVerifiedProviders()
  }, [])

  const openModal =async (message, id, status)  => {
    setSelectedMessage(message);
    setShowModal(true);
    if (status === "new") {
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/contact/${id}/read`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchContactMessages(); // Refresh messages to reflect status change
      } catch (error) {
        console.error("Error marking message as read:", error);
      }
    }
  };
  const fetchUnVerifiedProviders = async () => {
    try {
      const token = localStorage.getItem("token") // or from your auth context
  
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/users?role=provider&status=unverified`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
  
      if (!response.ok) {
        throw new Error("Failed to fetch verified providers")
      }
  
      const data = await response.json()
      setUnVerified(data.users)
      return data.users
    } catch (error) {
      console.error("Error fetching verified providers:", error.message)
      return []
    }
  }
  
  

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/analytics`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      } else {
        console.error("Failed to fetch analytics")
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMonthlyData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/earnings/monthly`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setMonthlyData(data)
      }
    } catch (error) {
      console.error("Error fetching monthly data:", error)
    }
  }

  const fetchProviderEarnings = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/providers/earnings`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setProviderEarnings(data)
      }
    } catch (error) {
      console.error("Error fetching provider earnings:", error)
    }
  }


  const fetchContactMessages = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/contact`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setContactMessages(data);
      } else {
        console.error("Failed to fetch contact messages");
      }
    } catch (error) {
      console.error("Error fetching contact messages:", error);
    }
  };

  const markAsResponded = async (id, responseMessage) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/contact/${id}/respond`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ responseMessage }),
      });
  
      if (res.ok) {
        fetchContactMessages();
      } else {
        console.error("Failed to respond");
      }
    } catch (error) {
      console.error("Error responding to contact:", error);
    }
  };
  const handleVerify = async (userId) => {
    const updated = await updateUserStatus(userId, { isVerified: true })
    if (updated) {
      // Refetch or update UI
      fetchUnVerifiedProviders()
    }
  }
  const updateUserStatus = async (userId, updateData = { isVerified: true }) => {
    try {
      const token = localStorage.getItem("token")
  
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      })
  
      if (!response.ok) {
        throw new Error("Failed to update user")
      }
  
      const updatedUser = await response.json()
      return updatedUser
    } catch (error) {
      console.error("Error updating user:", error.message)
      return null
    }
  }
  

  
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <>
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-black">NeighboFix Admin Dashboard</h1>
              <p className="text-gray-600">Platform owner earnings and analytics</p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-sm text-gray-600">Your Total Earnings</p>
                <p className="text-3xl font-bold text-green-600">${analytics.totalPlatformEarnings?.toFixed(2) || 0}</p>
                <p className="text-xs text-gray-500">15% commission from all services</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${analytics.monthlyPlatformEarnings?.toFixed(2) || 0}
                </p>
                <p className="text-xs text-gray-500">Your monthly commission</p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-black mb-2">Your Earnings</h3>
            <p className="text-3xl font-bold text-green-600">${analytics.totalPlatformEarnings?.toFixed(2) || 0}</p>
            <p className="text-sm text-gray-600 mt-1">Total commission earned</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-black mb-2">Service Volume</h3>
            <p className="text-3xl font-bold text-blue-600">${analytics.totalServiceVolume?.toFixed(2) || 0}</p>
            <p className="text-sm text-gray-600 mt-1">Total services processed</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-black mb-2">Provider Earnings</h3>
            <p className="text-3xl font-bold text-purple-600">${analytics.totalProviderEarnings?.toFixed(2) || 0}</p>
            <p className="text-sm text-gray-600 mt-1">Total paid to providers</p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-black mb-2">Avg Commission</h3>
            <p className="text-3xl font-bold text-yellow-600">${analytics.avgCommissionPerBooking?.toFixed(2) || 0}</p>
            <p className="text-sm text-gray-600 mt-1">Per completed booking</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: "overview", label: "Overview" },
                { id: "earnings", label: "Monthly Earnings" },
                { id: "providers", label: "Provider Earnings" },
                { id: "transactions", label: "Recent Transactions" },
                { id: "contacts", label: "Contact Messages" },
                { id: "unverified", label: "Unverified Providers" }
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
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-black mb-4">Platform Statistics</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Total Providers</span>
                        <span className="font-semibold">{analytics.totalProviders || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Customers</span>
                        <span className="font-semibold">{analytics.totalCustomers || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Services</span>
                        <span className="font-semibold">{analytics.totalServices || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Bookings</span>
                        <span className="font-semibold">{analytics.totalBookings || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Completion Rate</span>
                        <span className="font-semibold text-green-600">{analytics.completionRate || 0}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-black mb-4">Revenue Breakdown</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Commission Rate</span>
                        <span className="font-semibold text-green-600">15%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Provider Share</span>
                        <span className="font-semibold text-blue-600">85%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Your Total Commission</span>
                        <span className="font-semibold text-green-600">
                          ${analytics.totalPlatformEarnings?.toFixed(2) || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Providers Total Earned</span>
                        <span className="font-semibold text-purple-600">
                          ${analytics.totalProviderEarnings?.toFixed(2) || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Monthly Earnings Tab */}
            {activeTab === "earnings" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-black">Monthly Earnings Breakdown</h3>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Month
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Bookings
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Service Volume
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Provider Earnings
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Your Commission
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {monthlyData.map((month, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {new Date(month._id.year, month._id.month - 1).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{month.totalBookings}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${month.totalServiceVolume.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600">
                            ${month.providerEarnings.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                            ${month.platformCommission.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Provider Earnings Tab */}
            {activeTab === "providers" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-black">Provider Earnings Breakdown</h3>
                <div className="grid grid-cols-1 gap-4">
                  {providerEarnings.map((provider, index) => (
                    <div key={provider._id._id} className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-semibold text-black">
                            {provider._id.name || provider._id.businessName}
                          </h4>
                          <p className="text-gray-600">{provider._id.email}</p>
                          <p className="text-sm text-gray-500">{provider.totalBookings} completed bookings</p>
                        </div>
                        <div className="text-right">
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <p className="text-sm text-gray-600">Gross Earnings</p>
                              <p className="text-lg font-bold text-blue-600">${provider.grossEarnings.toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Net Earnings</p>
                              <p className="text-lg font-bold text-purple-600">${provider.netEarnings.toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Commission Paid</p>
                              <p className="text-lg font-bold text-green-600">${provider.commissionPaid.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Transactions Tab */}
            {activeTab === "transactions" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-black">Recent Commission Transactions</h3>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Service
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Provider
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Service Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Provider Gets
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Your Commission
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {analytics.recentTransactions?.map((transaction) => (
                        <tr key={transaction._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(transaction.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {transaction.bookingId?.serviceId?.name || "Service"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {transaction.providerId.name || transaction.providerId.businessName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${transaction.serviceAmount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600">
                            ${transaction.providerAmount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                            ${transaction.commissionAmount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Contact messages tab */}
            {activeTab === "contacts" && (
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-black">Contact Messages</h3>
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {contactMessages.map((msg) => (
                            <tr key={msg._id}>
                              <td className="px-6 py-4 text-sm">{msg.name}</td>
                              <td className="px-6 py-4 text-sm text-blue-600">{msg.email}</td>
                              <td className="px-6 py-4 text-sm">
                                <button
                                  onClick={() => openModal(msg.message, msg._id, msg.status)}
                                  className="text-blue-600 underline text-sm"
                                >
                                  View
                                </button>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500">{new Date(msg.createdAt).toLocaleString()}</td>
                              <td className="px-6 py-4 text-sm">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    msg.status === "new"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : msg.status === "read"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-green-100 text-green-800"
                                  }`}
                                >
                                  {msg.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm">
                                {msg.status !== "responded" && (
                                  <button
                                    className="bg-green-600 text-white px-3 py-1 rounded"
                                    onClick={() => {
                                      const reply = prompt(`Type your response to ${msg.email}:`)
                                      if (reply) markAsResponded(msg._id, reply)
                                    }}
                                  >
                                    Respond
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                    </table>
                    </div>
                </div>
                )}
  
           {/* Unverified Provider tab */}
            {activeTab === "unverified" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-black">Unverified Providers</h3>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Business Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {unVerified.map((provider) => (
                        <tr key={provider._id}>
                          <td className="px-6 py-4 text-sm">{provider.name}</td>
                          <td className="px-6 py-4 text-sm text-blue-600">{provider.email}</td>
                          <td className="px-6 py-4 text-sm">{provider.phone}</td>
                          <td className="px-6 py-4 text-sm">{provider.businessName || "—"}</td>
                          <td className="px-6 py-4 text-sm">
                            <button
                              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                              onClick={() => handleVerify(provider._id)}
                            >
                              Verify
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      

    </div>
    {showModal && (
      <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full mx-4">
        <h2 className="text-lg font-semibold mb-4">Full Message</h2>
        <div className="max-h-64 overflow-y-auto text-gray-800 whitespace-pre-wrap text-sm border p-2 rounded">
          {selectedMessage}
        </div>
        <div className="mt-4 text-right">
          <button
            onClick={() => setShowModal(false)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
    </div>
  </div>
)}

    </>
  )
}

export default AdminDashboard
