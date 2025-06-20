const express = require("express")
const router = express.Router()
const PlatformEarnings = require("../models/PlatformEarnings")
const Booking = require("../models/Booking")
const User = require("../models/User")
const Service = require("../models/Service")
const Payment = require("../models/Payment")
const auth = require("../middleware/auth")

// Get platform analytics and earnings (Admin only)
router.get("/analytics", auth, async (req, res) => {
  try {
    // Total platform earnings (commission only)
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Only Admin can access this endpoint" })
    }
    const totalEarnings = await PlatformEarnings.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$commissionAmount" } } },
    ])

    // Monthly earnings
    const currentMonth = new Date()
    currentMonth.setDate(1)
    currentMonth.setHours(0, 0, 0, 0)

    const monthlyEarnings = await PlatformEarnings.aggregate([
      {
        $match: {
          status: "completed",
          createdAt: { $gte: currentMonth },
        },
      },
      { $group: { _id: null, total: { $sum: "$commissionAmount" } } },
    ])

    // Total service volume (gross amount)
    const totalServiceVolume = await PlatformEarnings.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$serviceAmount" } } },
    ])

    // Total provider earnings
    const totalProviderEarnings = await PlatformEarnings.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$providerAmount" } } },
    ])

    // Total bookings
    const totalBookings = await Booking.countDocuments()
    const completedBookings = await Booking.countDocuments({ status: "completed" })

    // Total providers and customers
    const totalProviders = await User.countDocuments({ role: "provider" })
    const totalCustomers = await User.countDocuments({ role: "customer" })

    // Total services
    const totalServices = await Service.countDocuments()

    // Recent transactions
    const recentTransactions = await PlatformEarnings.find({ status: "completed" })
      .populate("providerId", "name businessName")
      .populate("customerId", "name")
      .populate({
        path: "bookingId",
        populate: {
          path: "serviceId",
          select: "name",
        },
      })
      .sort({ createdAt: -1 })
      .limit(10)

    // Top providers by commission generated
    const topProviders = await PlatformEarnings.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: "$providerId",
          totalProviderEarnings: { $sum: "$providerAmount" },
          totalCommissionGenerated: { $sum: "$commissionAmount" },
          totalServiceVolume: { $sum: "$serviceAmount" },
          totalBookings: { $sum: 1 },
        },
      },
      { $sort: { totalCommissionGenerated: -1 } },
      { $limit: 5 },
    ])

    // Populate provider details
    await User.populate(topProviders, { path: "_id", select: "name businessName email" })

    // Average commission per booking
    const avgCommissionPerBooking = completedBookings > 0 ? (totalEarnings[0]?.total || 0) / completedBookings : 0

    res.json({
      // Platform earnings (your money)
      totalPlatformEarnings: totalEarnings[0]?.total || 0,
      monthlyPlatformEarnings: monthlyEarnings[0]?.total || 0,

      // Service volume metrics
      totalServiceVolume: totalServiceVolume[0]?.total || 0,
      totalProviderEarnings: totalProviderEarnings[0]?.total || 0,

      // Platform metrics
      totalBookings,
      completedBookings,
      totalProviders,
      totalCustomers,
      totalServices,

      // Performance metrics
      completionRate: totalBookings > 0 ? Math.round((completedBookings / totalBookings) * 100) : 0,
      avgCommissionPerBooking: Math.round(avgCommissionPerBooking * 100) / 100,
      commissionRate: 15, // 15%

      // Data for tables
      recentTransactions,
      topProviders,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get monthly earnings breakdown (Admin only)
router.get("/earnings/monthly", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Only Admin can access this endpoint" })
    }
    const monthlyBreakdown = await PlatformEarnings.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          platformCommission: { $sum: "$commissionAmount" },
          providerEarnings: { $sum: "$providerAmount" },
          totalServiceVolume: { $sum: "$serviceAmount" },
          totalBookings: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 12 },
    ])

    res.json(monthlyBreakdown)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get provider earnings breakdown (Admin only)
router.get("/providers/earnings", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Only Admin can access this endpoint" })
    }
    
    const providerEarnings = await PlatformEarnings.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: "$providerId",
          netEarnings: { $sum: "$providerAmount" }, // What provider actually gets
          grossEarnings: { $sum: "$serviceAmount" }, // Total service amount
          commissionPaid: { $sum: "$commissionAmount" }, // Commission to platform
          totalBookings: { $sum: 1 },
        },
      },
      { $sort: { netEarnings: -1 } },
    ])

    await User.populate(providerEarnings, { path: "_id", select: "name businessName email" })

    res.json(providerEarnings)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
