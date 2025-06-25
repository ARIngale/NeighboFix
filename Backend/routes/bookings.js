const express = require("express")
const router = express.Router()
const Booking = require("../models/Booking")
const Service = require("../models/Service")
const Payment = require("../models/Payment")
const auth = require("../middleware/auth")
const PlatformEarnings = require("../models/PlatformEarnings") 
const { createNotification } = require("./notifications")
const Invoice = require("../models/Invoice")
const Razorpay = require("razorpay")
const crypto = require("crypto");

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

router.get("/filter", auth, async (req, res) => {
  try {
    const { status, upcoming, past } = req.query

    const filter = {}

    // Role-based filter
    if (req.user.role === "customer") {
      filter.customerId = req.user.userId
    } else if (req.user.role === "provider") {
      filter.providerId = req.user.userId
    }

    // === Filter Logic ===
    if (upcoming === "true") {
      filter.status = { $in: ["pending", "confirmed", "in-progress"] }
    } else if (past === "true") {
      filter.status = { $in: ["completed", "cancelled"] }
    } else if (status && status !== "all") {
      filter.status = status // exact match (e.g. pending, in-progress, etc.)
    }
    // else → status === "all" or not provided → no filter on status

    const bookings = await Booking.find(filter)
      .populate("serviceId")
      .populate(
        req.user.role === "customer" ? "providerId" : "customerId",
        "name email phone"
      )
      .sort({ preferredDate: -1, createdAt: -1 })

    res.json({ bookings })
  } catch (error) {
    console.error("Error filtering bookings:", error)
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

      await createNotification(
        service.providerId,
        "New Booking Request",
        `You have a new booking request for ${service.name}`,
        "booking",
        newBooking._id,
        "Booking",
        `/provider-dashboard?tab=bookings`,
        "high",
      )
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

    // Permission check
    if (req.user.role === "customer" && booking.customerId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Access denied" })
    }

    if (req.user.role === "provider" && booking.providerId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Access denied" })
    }

    // Update booking fields
    Object.keys(req.body).forEach((key) => {
      booking[key] = req.body[key]
    })

    const updatedBooking = await booking.save()

    // === Create Payment if Completed ===
    if (req.body.status === "completed" && req.user.role === "provider") {
      const payment = new Payment({
        bookingId: booking._id,
        customerId: booking.customerId,
        providerId: booking.providerId,
        amount: booking.totalAmount || 75,
        paymentMethod: "cash",
        paymentStatus: "pending",
      })
      await payment.save()

      // Notify customer
      await createNotification(
        booking.customerId,
        "Booking Completed",
        `Your booking with ${req.user.name} has been marked as completed.`,
        "status_update",
        booking._id,
        "Booking",
        "/customer-dashboard?tab=bookings",
        "high"
      )
    }

    // === Other status update notification ===
    if (req.body.status && req.body.status !== "completed") {
      const recipientId = req.user.role === "provider" ? booking.customerId : booking.providerId
      const dashboardPath = req.user.role === "provider" ? "customer-dashboard" : "provider-dashboard"
      const statusText = req.body.status.charAt(0).toUpperCase() + req.body.status.slice(1)

      await createNotification(
        recipientId,
        "Booking Status Update",
        `Booking status updated to "${statusText}" by ${req.user.name}.`,
        "status_update",
        booking._id,
        "Booking",
        `/${dashboardPath}?tab=bookings`,
        "medium"
      )
    }

    res.json(updatedBooking)
  } catch (error) {
    console.error("Error updating booking:", error)
    res.status(400).json({ message: error.message })
  }
})

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})


// Complete booking with payment
// router.post("/:id/complete", auth, async (req, res) => {
//   try {
//     const booking = await Booking.findById(req.params.id)
//     if (!booking) {
//       return res.status(404).json({ message: "Booking not found" })
//     }

//     if (req.user.role !== "provider" || booking.providerId.toString() !== req.user.userId) {
//       return res.status(403).json({ message: "Access denied" })
//     }

//     // Update booking status
//     booking.status = "completed"
//     await booking.save()

//     // Prepare amount and payment method
//     const amount = req.body.amount || booking.totalAmount || 75
//     const paymentMethod = req.body.paymentMethod || "cash"

//     // Create payment record
//     const payment = new Payment({
//       bookingId: booking._id,
//       customerId: booking.customerId,
//       providerId: booking.providerId,
//       amount,
//       paymentMethod,
//       paymentStatus: "completed",
//     })

//     await payment.save()

//     // Calculate commission and provider earnings
//     const commissionRate = 0.15 // 15%
//     const commissionAmount = amount * commissionRate
//     const providerAmount = amount - commissionAmount

//     // Create platform earnings record
//     const platformEarning = new PlatformEarnings({
//       bookingId: booking._id,
//       providerId: booking.providerId,
//       customerId: booking.customerId,
//       serviceAmount: amount,
//       commissionRate,
//       commissionAmount,
//       providerAmount,
//       paymentMethod,
//       status: "completed",
//     })

//     await platformEarning.save()

//     // Generate invoice
//     const invoiceNumber = `INV-${Date.now()}-${booking._id.toString().slice(-6)}`
//     const invoice = new Invoice({
//       invoiceNumber,
//       bookingId: booking._id,
//       customerId: booking.customerId,
//       providerId: booking.providerId,
//       serviceAmount: amount,
//       commissionAmount,
//       providerAmount,
//       commissionRate: commissionRate * 100,
//       paymentMethod: req.body.paymentMethod || "cash",
//       status: "paid",
//     })
//     await invoice.save()

//     await createNotification(
//       booking.customerId,
//       "Service Completed",
//       `Your ${booking.serviceName} service has been completed successfully`,
//       "booking",
//       booking._id,
//       "Booking",
//       `/dashboard?tab=bookings`,
//       "high",
//     )

//     const populatedBooking = await Booking.findById(booking._id)
//       .populate("serviceId")
//       .populate("customerId", "name phone email")

//     res.json({
//       booking: populatedBooking,
//       payment,
//       platformEarning,
//       message: "Service completed and earnings recorded successfully!",
//     })
//   } catch (error) {
//     console.error("Error completing booking:", error)
//     res.status(400).json({ message: error.message })
//   }
// })

router.post("/:id/complete", auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
    if (!booking) return res.status(404).json({ message: "Booking not found" })

    if (req.user.role !== "provider" || booking.providerId.toString() !== req.user.userId)
      return res.status(403).json({ message: "Access denied" })

    const { amount, paymentMethod, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body

    // --- Card Payment: Razorpay verification ---
    if (paymentMethod === "card") {
      const body = razorpay_order_id + "|" + razorpay_payment_id
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex")

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ message: "Invalid Razorpay signature" })
      }
    }

    // ✅ Update booking
    booking.status = "completed"
    await booking.save()

    const serviceAmount = amount || booking.totalAmount || 75

    // ✅ Save Payment
    const payment = new Payment({
      bookingId: booking._id,
      customerId: booking.customerId,
      providerId: booking.providerId,
      amount: serviceAmount,
      paymentMethod,
      transactionId: razorpay_payment_id || "CASH",
      paymentStatus: "completed",
    })

    await payment.save()

    // ✅ Platform earnings
    const commissionRate = 0.15
    const commissionAmount = serviceAmount * commissionRate
    const providerAmount = serviceAmount - commissionAmount

    const platformEarning = new PlatformEarnings({
      bookingId: booking._id,
      providerId: booking.providerId,
      customerId: booking.customerId,
      serviceAmount,
      commissionRate,
      commissionAmount,
      providerAmount,
      paymentMethod,
      status: "completed",
    })

    await platformEarning.save()

    // ✅ Invoice
    const invoice = new Invoice({
      invoiceNumber: `INV-${Date.now()}-${booking._id.toString().slice(-6)}`,
      bookingId: booking._id,
      customerId: booking.customerId,
      providerId: booking.providerId,
      serviceAmount,
      commissionAmount,
      providerAmount,
      commissionRate: commissionRate * 100,
      paymentMethod,
      status: "paid",
    })

    await invoice.save()

    // ✅ Notify customer
    await createNotification(
      booking.customerId,
      "Service Completed",
      `Your ${booking.serviceName} service has been completed successfully`,
      "booking",
      booking._id,
      "Booking",
      `/dashboard?tab=bookings`,
      "high"
    )

    const populatedBooking = await Booking.findById(booking._id)
      .populate("serviceId")
      .populate("customerId", "name phone email")

    res.json({
      booking: populatedBooking,
      payment,
      platformEarning,
      message: "Service completed and payment recorded successfully!",
    })
  } catch (error) {
    console.error("Error completing booking:", error)
    res.status(400).json({ message: error.message })
  }
})


router.post("/create-order", auth, async (req, res) => {
  try {
    const { amount, bookingId } = req.body

    if (!amount || !bookingId) {
      return res.status(400).json({ message: "Amount and booking ID required" })
    }

    const options = {
      amount: parseInt(amount * 100), // amount in paise
      currency: "INR",
      receipt: `receipt_order_${bookingId}`,
    }

    const order = await razorpay.orders.create(options)

    res.json({ order })
  } catch (error) {
    console.error("Razorpay order error:", error)
    res.status(500).json({ message: "Failed to create Razorpay order" })
  }
})


router.get("/:id/invoice", auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" })
    }

    // Check permissions
    if (
      req.user.role === "customer" &&
      booking.customerId.toString() !== req.user.userId &&
      req.user.role === "provider" &&
      booking.providerId.toString() !== req.user.userId
    ) {
      return res.status(403).json({ message: "Access denied" })
    }

    const invoice = await Invoice.findOne({ bookingId: req.params.id })
      .populate("bookingId")
      .populate("customerId", "name email phone address")
      .populate("providerId", "name businessName email phone")

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" })
    }

    res.json(invoice)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
