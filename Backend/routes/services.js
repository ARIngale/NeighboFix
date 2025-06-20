const express = require("express")
const router = express.Router()
const Service = require("../models/Service")
const User = require("../models/User")
const auth = require("../middleware/auth")

// Get all services (public)
router.get("/", async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sortBy } = req.query

    const query = { isActive: true }

    if (category && category !== "all") {
      query.category = category
    }

    if (search) {
      query.$or = [{ name: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }

    if (minPrice || maxPrice) {
      query.basePrice = {}
      if (minPrice) query.basePrice.$gte = Number.parseInt(minPrice)
      if (maxPrice) query.basePrice.$lte = Number.parseInt(maxPrice)
    }

    const sortOptions = {}
    switch (sortBy) {
      case "price_low":
        sortOptions.basePrice = 1
        break
      case "price_high":
        sortOptions.basePrice = -1
        break
      case "rating":
        sortOptions.rating = -1
        break
      case "newest":
        sortOptions.createdAt = -1
        break
      default:
        sortOptions.createdAt = -1
    }

    const services = await Service.find(query)
      .populate("providerId", "name businessName rating totalReviews isVerified")
      .sort(sortOptions)
    res.json(services)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get service by ID
router.get("/:id", async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate(
      "providerId",
      "name businessName rating totalReviews phone email address isVerified",
    )
    if (!service) {
      return res.status(404).json({ message: "Service not found" })
    }
    res.json(service)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get services by provider (for provider dashboard)
router.get("/provider/:providerId", auth, async (req, res) => {
  try {
    if (req.user.userId !== req.params.providerId && req.user.role !== "provider") {
      return res.status(403).json({ message: "Access denied" })
    }

    const services = await Service.find({
      providerId: req.params.providerId,
    }).sort({ createdAt: -1 })

    res.json(services)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Create new service (providers only)
router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "provider") {
      return res.status(403).json({ message: "Only providers can create services" })
    }

    const provider = await User.findById(req.user.userId)
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" })
    }

    const { name, description, icon, basePrice, category } = req.body

    // Validation
    if (!name || !description || !basePrice || !category) {
      return res.status(400).json({ message: "All fields are required" })
    }

    if (basePrice < 1) {
      return res.status(400).json({ message: "Price must be at least $1" })
    }

    const service = new Service({
      name,
      description,
      icon: icon || "🔧",
      basePrice: Number.parseInt(basePrice),
      category,
      providerId: req.user.userId,
      providerName: provider.businessName || provider.name,
    })

    const newService = await service.save()

    // Populate provider info before sending response
    await newService.populate("providerId", "name businessName rating totalReviews isVerified")

    res.status(201).json(newService)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Update service (provider only)
router.put("/:id", auth, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
    if (!service) {
      return res.status(404).json({ message: "Service not found" })
    }

    if (service.providerId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "You can only update your own services" })
    }

    const { name, description, icon, basePrice, category } = req.body

    // Validation
    if (basePrice && basePrice < 1) {
      return res.status(400).json({ message: "Price must be at least $1" })
    }

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      { name, description, icon, basePrice: Number.parseInt(basePrice), category },
      { new: true },
    ).populate("providerId", "name businessName rating totalReviews isVerified")

    res.json(updatedService)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Delete service (provider only)
router.delete("/:id", auth, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
    if (!service) {
      return res.status(404).json({ message: "Service not found" })
    }

    if (service.providerId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "You can only delete your own services" })
    }

    await Service.findByIdAndDelete(req.params.id)
    res.json({ message: "Service deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get service categories
router.get("/meta/categories", async (req, res) => {
  try {
    const categories = await Service.distinct("category", { isActive: true })
    res.json(categories)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router