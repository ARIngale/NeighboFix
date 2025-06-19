const express = require("express")
const router = express.Router()
const User = require("../models/User")
const Booking = require("../models/Booking")
const Service = require("../models/Service")
const Review = require("../models/Review")
const auth = require("../middleware/auth")

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
router.get("/analytics", auth, async (req, res) => {
  try {
    if (req.user.role !== "provider") {
      return res.status(403).json({ message: "Only providers can access analytics" })
    }

    const providerId = req.user.userId

    // Get all bookings for this provider
    const allBookings = await Booking.find({ providerId })
    const completedBookings = allBookings.filter((b) => b.status === "completed")
    const pendingBookings = allBookings.filter((b) => b.status === "pending")
    const confirmedBookings = allBookings.filter((b) => b.status === "confirmed")
    const inProgressBookings = allBookings.filter((b) => b.status === "in-progress")

    // Calculate monthly stats
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    const monthlyBookings = allBookings.filter((b) => {
      const bookingDate = new Date(b.createdAt)
      return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear
    })

    // Calculate earnings
    const totalEarnings = completedBookings.reduce((sum, booking) => sum + (booking.totalAmount || 75), 0)
    const monthlyEarnings = monthlyBookings
      .filter((b) => b.status === "completed")
      .reduce((sum, booking) => sum + (booking.totalAmount || 75), 0)

    // Get reviews
    const reviews = await Review.find({ providerId, reviewType: "provider", isApproved: true })
    const averageRating =
      reviews.length > 0 ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10 : 0

    const analytics = {
      totalBookings: allBookings.length,
      completedJobs: completedBookings.length,
      pendingBookings: pendingBookings.length,
      confirmedBookings: confirmedBookings.length,
      inProgressBookings: inProgressBookings.length,
      monthlyBookings: monthlyBookings.length,
      totalEarnings,
      monthlyEarnings,
      averageRating,
      totalReviews: reviews.length,
      responseRate:
        allBookings.length > 0
          ? Math.round(((allBookings.length - pendingBookings.length) / allBookings.length) * 100)
          : 0,
    }

    res.json(analytics)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
