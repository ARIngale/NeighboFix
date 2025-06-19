const express = require("express")
const router = express.Router()
const Review = require("../models/Review")
const PlatformReview = require("../models/PlatformReview")
const Booking = require("../models/Booking")
const Service = require("../models/Service")
const User = require("../models/User")
const auth = require("../middleware/auth")

// Get provider reviews
router.get("/provider/:providerId", async (req, res) => {
  try {
    const reviews = await Review.find({
      providerId: req.params.providerId,
      reviewType: "provider",
      isApproved: true,
    })
      .populate("customerId", "name")
      .sort({ createdAt: -1 })
    res.json(reviews)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get service reviews
router.get("/service/:serviceId", async (req, res) => {
  try {
    const reviews = await Review.find({
      serviceId: req.params.serviceId,
      reviewType: "provider",
      isApproved: true,
    })
      .populate("customerId", "name")
      .sort({ createdAt: -1 })
    res.json(reviews)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get customer's reviews
router.get("/customer/:customerId", auth, async (req, res) => {
  try {
    if (req.user.userId !== req.params.customerId) {
      return res.status(403).json({ message: "Access denied" })
    }

    const reviews = await Review.find({
      customerId: req.params.customerId,
      reviewType: "provider",
    })
      .populate("serviceId", "name")
      .populate("providerId", "name businessName")
      .sort({ createdAt: -1 })
    res.json(reviews)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get platform reviews
router.get("/platform", async (req, res) => {
  try {
    const reviews = await PlatformReview.find({ isApproved: true })
      .populate("customerId", "name")
      .sort({ createdAt: -1 })
    res.json(reviews)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get featured platform reviews
router.get("/platform/featured", async (req, res) => {
  try {
    const reviews = await PlatformReview.find({ isApproved: true, isFeatured: true })
      .populate("customerId", "name")
      .sort({ createdAt: -1 })
      .limit(6)
    res.json(reviews)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Create provider review (customers only, after completed booking)
router.post("/provider", auth, async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({ message: "Only customers can leave reviews" })
    }

    const { bookingId, rating, comment } = req.body

    // Validation
    if (!bookingId || !rating || !comment) {
      return res.status(400).json({ message: "All fields are required" })
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" })
    }

    // Verify booking exists and is completed
    const booking = await Booking.findById(bookingId)
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" })
    }

    if (booking.customerId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "You can only review your own bookings" })
    }

    if (booking.status !== "completed") {
      return res.status(400).json({ message: "You can only review completed bookings" })
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ bookingId, reviewType: "provider" })
    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this booking" })
    }

    const customer = await User.findById(req.user.userId)
    const service = await Service.findById(booking.serviceId)

    const review = new Review({
      customerId: req.user.userId,
      customerName: customer.name,
      bookingId,
      serviceId: booking.serviceId,
      providerId: booking.providerId,
      serviceName: booking.serviceName,
      rating: Number.parseInt(rating),
      comment,
      reviewType: "provider",
      isApproved: true, // Auto-approve for now
    })

    const newReview = await review.save()

    // Update service rating
    const allServiceReviews = await Review.find({
      serviceId: booking.serviceId,
      reviewType: "provider",
      isApproved: true,
    })
    const avgRating = allServiceReviews.reduce((sum, r) => sum + r.rating, 0) / allServiceReviews.length

    await Service.findByIdAndUpdate(booking.serviceId, {
      rating: Math.round(avgRating * 10) / 10,
      totalReviews: allServiceReviews.length,
    })

    // Update provider rating
    const allProviderReviews = await Review.find({
      providerId: booking.providerId,
      reviewType: "provider",
      isApproved: true,
    })
    const providerAvgRating = allProviderReviews.reduce((sum, r) => sum + r.rating, 0) / allProviderReviews.length

    await User.findByIdAndUpdate(booking.providerId, {
      rating: Math.round(providerAvgRating * 10) / 10,
      totalReviews: allProviderReviews.length,
    })

    // Populate the review before sending response
    await newReview.populate("customerId", "name")

    res.status(201).json(newReview)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Create platform review (customers only)
router.post("/platform", auth, async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({ message: "Only customers can leave platform reviews" })
    }

    const { rating, comment, category } = req.body

    // Validation
    if (!rating || !comment) {
      return res.status(400).json({ message: "Rating and comment are required" })
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" })
    }

    const customer = await User.findById(req.user.userId)

    const review = new PlatformReview({
      customerId: req.user.userId,
      customerName: customer.name,
      rating: Number.parseInt(rating),
      comment,
      category: category || "overall",
      isApproved: true, // Auto-approve for now
    })

    const newReview = await review.save()
    await newReview.populate("customerId", "name")

    res.status(201).json(newReview)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

module.exports = router
