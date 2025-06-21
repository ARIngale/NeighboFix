const mongoose = require("mongoose")

const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      enum: ["service", "provider"],
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

// Ensure unique favorites per user
favoriteSchema.index({ userId: 1, serviceId: 1, providerId: 1 }, { unique: true })

module.exports = mongoose.model("Favorite", favoriteSchema)
