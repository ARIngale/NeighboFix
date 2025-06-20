const express = require("express")
const router = express.Router()
const Notification = require("../models/Notification")
const auth = require("../middleware/auth")

// Get user notifications
router.get("/", auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = req.query
    const query = { userId: req.user.userId }

    if (unreadOnly === "true") {
      query.isRead = false
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const unreadCount = await Notification.countDocuments({
      userId: req.user.userId,
      isRead: false,
    })

    res.json({
      notifications,
      unreadCount,
      totalPages: Math.ceil((await Notification.countDocuments(query)) / limit),
      currentPage: page,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Mark notification as read
router.patch("/:id/read", auth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { isRead: true },
      { new: true },
    )

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" })
    }

    res.json(notification)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Mark all notifications as read
router.patch("/mark-all-read", auth, async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user.userId, isRead: false }, { isRead: true })

    res.json({ message: "All notifications marked as read" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Create notification (internal use)
const createNotification = async (
  userId,
  title,
  message,
  type,
  relatedId = null,
  relatedModel = null,
  actionUrl = null,
  priority = "medium",
) => {
  try {
    const notification = new Notification({
      userId,
      title,
      message,
      type,
      relatedId,
      relatedModel,
      actionUrl,
      priority,
    })
    await notification.save()
    return notification
  } catch (error) {
    console.error("Error creating notification:", error)
  }
}

module.exports = { router, createNotification }
