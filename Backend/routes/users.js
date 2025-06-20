const express = require("express")
const router = express.Router()
const User = require("../models/User")
const Booking = require("../models/Booking")
const Service = require("../models/Service")
const Review = require("../models/Review")
const auth = require("../middleware/auth")
const Payment = require("../models/Payment")
const PlatformEarnings = require("../models/PlatformEarnings")

// Get user profile
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password")
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Update user profile
router.put("/profile", auth, async (req, res) => {
  try {
    const { name, phone, address, businessName, businessDescription, serviceCategories, hourlyRate } = req.body

    const updateData = { name, phone, address }

    // Add provider-specific fields if user is a provider
    if (req.user.role === "provider") {
      updateData.businessName = businessName
      updateData.businessDescription = businessDescription
      updateData.serviceCategories = serviceCategories
      updateData.hourlyRate = hourlyRate
    }

    const user = await User.findByIdAndUpdate(req.user.userId, updateData, { new: true }).select("-password")

    res.json(user)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Get user bookings
router.get("/bookings", auth, async (req, res) => {
  try {
    let bookings

    if (req.user.role === "customer") {
      bookings = await Booking.find({ customerId: req.user.userId })
        .populate("serviceId", "name icon")
        .populate("providerId", "name businessName")
        .sort({ createdAt: -1 })
    } else if (req.user.role === "provider") {
      bookings = await Booking.find({ providerId: req.user.userId })
        .populate("serviceId", "name icon")
        .populate("customerId", "name phone email")
        .sort({ createdAt: -1 })
    }

    res.json(bookings || [])
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get user services (providers only)
router.get("/services", auth, async (req, res) => {
  try {
    if (req.user.role !== "provider") {
      return res.status(403).json({ message: "Only providers can access this endpoint" })
    }

    const services = await Service.find({ providerId: req.user.userId }).sort({ createdAt: -1 })

    res.json(services)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get analytics (providers only)
// Get user analytics
router.get("/analytics", auth, async (req, res) => {
  try {
    if (req.user.role === "provider") {
      // Provider analytics with net earnings (after platform commission)
      const totalBookings = await Booking.countDocuments({ providerId: req.user.userId })
      const completedBookings = await Booking.countDocuments({
        providerId: req.user.userId,
        status: "completed",
      })

      // Get net earnings from platform earnings table
      const earningsData = await PlatformEarnings.aggregate([
        { $match: { providerId: req.user.userId, status: "completed" } },
        {
          $group: {
            _id: null,
            totalEarnings: { $sum: "$providerAmount" }, // Net amount after commission
            totalGross: { $sum: "$serviceAmount" }, // Gross amount
            totalCommission: { $sum: "$commissionAmount" }, // Commission paid
          },
        },
      ])

      const currentMonth = new Date()
      currentMonth.setDate(1)
      currentMonth.setHours(0, 0, 0, 0)

      const monthlyEarnings = await PlatformEarnings.aggregate([
        {
          $match: {
            providerId: req.user.userId,
            status: "completed",
            createdAt: { $gte: currentMonth },
          },
        },
        {
          $group: {
            _id: null,
            monthlyEarnings: { $sum: "$providerAmount" },
            monthlyBookings: { $sum: 1 },
          },
        },
      ])

      const reviews = await Review.find({ providerId: req.user.userId })
      const averageRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0

      // Booking status breakdown
      const pendingBookings = await Booking.countDocuments({
        providerId: req.user.userId,
        status: "pending",
      })
      const confirmedBookings = await Booking.countDocuments({
        providerId: req.user.userId,
        status: "confirmed",
      })
      const inProgressBookings = await Booking.countDocuments({
        providerId: req.user.userId,
        status: "in-progress",
      })

      res.json({
        totalBookings,
        completedJobs: completedBookings,
        totalEarnings: earningsData[0]?.totalEarnings || 0,
        totalGrossEarnings: earningsData[0]?.totalGross || 0,
        totalCommissionPaid: earningsData[0]?.totalCommission || 0,
        monthlyEarnings: monthlyEarnings[0]?.monthlyEarnings || 0,
        monthlyBookings: monthlyEarnings[0]?.monthlyBookings || 0,
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews: reviews.length,
        pendingBookings,
        confirmedBookings,
        inProgressBookings,
        responseRate: totalBookings > 0 ? Math.round((completedBookings / totalBookings) * 100) : 0,
      })
    } else if (req.user.role === "customer") {
      // Customer analytics
      const totalBookings = await Booking.countDocuments({ customerId: req.user.userId })
      const completedBookings = await Booking.countDocuments({
        customerId: req.user.userId,
        status: "completed",
      })

      const totalSpent = await Payment.aggregate([
        {
          $lookup: {
            from: "bookings",
            localField: "bookingId",
            foreignField: "_id",
            as: "booking",
          },
        },
        { $unwind: "$booking" },
        { $match: { "booking.customerId": req.user.userId, paymentStatus: "completed" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ])

      const reviews = await Review.find({ customerId: req.user.userId })

      res.json({
        totalBookings,
        completedBookings,
        totalSpent: totalSpent[0]?.total || 0,
        totalReviews: reviews.length,
      })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
