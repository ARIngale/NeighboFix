const mongoose = require("mongoose")

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    serviceAmount: {
      type: Number,
      required: true,
    },
    commissionAmount: {
      type: Number,
      required: true,
    },
    providerAmount: {
      type: Number,
      required: true,
    },
    commissionRate: {
      type: Number, // Stored as percentage e.g., 10 for 10%
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "upi", "netbanking"],
      default: "cash",
    },
    status: {
      type: String,
      enum: ["paid", "unpaid"],
      default: "paid",
    },
  },
  {
    timestamps: true, // includes createdAt and updatedAt
  },
)

module.exports = mongoose.model("Invoice", invoiceSchema)
