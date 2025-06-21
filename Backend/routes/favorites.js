const express = require("express")
const router = express.Router()
const Favorite = require("../models/Favorite")
const Service = require("../models/Service")
const User = require("../models/User")
const auth = require("../middleware/auth")

// Get user favorites
router.get("/", auth, async (req, res) => {
  try {
    const { type } = req.query // 'service' or 'provider'
    const query = { userId: req.user.userId }

    if (type) {
      query.type = type
    }

    const favorites = await Favorite.find(query)
      .populate("serviceId")
      .populate("providerId", "name businessName email phone")
      .sort({ createdAt: -1 })

    res.json(favorites)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Add to favorites
router.post("/", auth, async (req, res) => {
  try {
    const { serviceId, providerId, type } = req.body

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({
      userId: req.user.userId,
      ...(type === "service" ? { serviceId } : { providerId }),
      type,
    })

    if (existingFavorite) {
      return res.status(400).json({ message: "Already in favorites" })
    }

    const favorite = new Favorite({
      userId: req.user.userId,
      serviceId: type === "service" ? serviceId : undefined,
      providerId: type === "provider" ? providerId : undefined,
      type,
    })

    await favorite.save()
    await favorite.populate(type === "service" ? "serviceId" : "providerId")

    res.status(201).json(favorite)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Remove from favorites
router.delete("/:id", auth, async (req, res) => {
  try {
    const favorite = await Favorite.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    })

    if (!favorite) {
      return res.status(404).json({ message: "Favorite not found" })
    }

    res.json({ message: "Removed from favorites" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Check if item is favorited
router.get("/check", auth, async (req, res) => {
  try {
    const { serviceId, providerId, type } = req.query

    const favorite = await Favorite.findOne({
      userId: req.user.userId,
      ...(type === "service" ? { serviceId } : { providerId }),
      type,
    })

    res.json({ isFavorited: !!favorite, favoriteId: favorite?._id })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
