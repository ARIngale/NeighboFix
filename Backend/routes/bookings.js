const express = require("express")
const router = express.Router()
const Booking = require("../models/Booking")
const Service = require("../models/Service")
const Payment = require("../models/Payment")
const auth = require("../middleware/auth")

// Get bookings (filtered by user role)
router.get("/", auth, async (req, res) => {
  try {
    let bookings
    if (req.user.role === "customer") {
      bookings = await Booking.find({ customerId: req.user.userId })
        .populate("serviceId")
        .populate("providerId", "name businessName phone email")
        .sort({ createdAt: -1 })
    } else if (req.user.role === "provider") {
      bookings = await Booking.find({ providerId: req.user.userId })
        .populate("serviceId")
        .populate("customerId", "name phone email")
        .sort({ createdAt: -1 })
    }
    res.json(bookings)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Create new booking (customers only)
router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({ message: "Only customers can create bookings" })
    }

    const service = await Service.findById(req.body.serviceId)
    if (!service) {
      return res.status(404).json({ message: "Service not found" })
    }

    const booking = new Booking({
      ...req.body,
      customerId: req.user.userId,
      providerId: service.providerId,
      totalAmount: service.basePrice,
    })

    const newBooking = await booking.save()
    const populatedBooking = await Booking.findById(newBooking._id)
      .populate("serviceId")
      .populate("providerId", "name businessName phone email")

    res.status(201).json(populatedBooking)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Update booking status
router.patch("/:id", auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" })
    }

    // Check permissions
    if (req.user.role === "customer" && booking.customerId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Access denied" })
    }
    if (req.user.role === "provider" && booking.providerId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Access denied" })
    }

    Object.keys(req.body).forEach((key) => {
      booking[key] = req.body[key]
    })

    const updatedBooking = await booking.save()
    
    // If booking is completed, create payment record
    if (req.body.status === "completed" && req.user.role === "provider") {
      const payment = new Payment({
        bookingId: booking._id,
        customerId: booking.customerId,
        providerId: booking.providerId,
        amount: booking.totalAmount || 75,
        paymentMethod: "cash", // Default for now
        paymentStatus: "pending"
      })
      await payment.save()
    }

    res.json(updatedBooking)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Complete booking with payment
router.post("/:id/complete", auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" })
    }

    if (req.user.role !== "provider" || booking.providerId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Access denied" })
    }

    // Update booking status
    booking.status = "completed"
    await booking.save()

    // Create payment record
    const payment = new Payment({
      bookingId: booking._id,
      customerId: booking.customerId,
      providerId: booking.providerId,
      amount: req.body.amount || booking.totalAmount || 75,
      paymentMethod: req.body.paymentMethod || "cash",
      paymentStatus: "completed"
    })

    await payment.save()

    const populatedBooking = await Booking.findById(booking._id)
      .populate("serviceId")
      .populate("customerId", "name phone email")

    res.json({
      booking: populatedBooking,
      payment: payment,
      message: "Service completed successfully!"
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

module.exports = router
