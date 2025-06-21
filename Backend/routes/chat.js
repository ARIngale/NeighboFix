const express = require("express")
const router = express.Router()
const Chat = require("../models/Chat")
const Booking = require("../models/Booking")
const auth = require("../middleware/auth")
const { createNotification } = require("./notifications")

// Get chat for a booking
router.get("/booking/:bookingId", auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId)
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" })
    }

    // Check if user is part of this booking
    if (booking.customerId.toString() !== req.user.userId && booking.providerId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Access denied" })
    }

    let chat = await Chat.findOne({ bookingId: req.params.bookingId })
      .populate("customerId", "name")
      .populate("providerId", "name businessName")
      .populate("messages.senderId", "name")

    if (!chat) {
      // Create new chat if doesn't exist
      chat = new Chat({
        bookingId: req.params.bookingId,
        customerId: booking.customerId,
        providerId: booking.providerId,
        messages: [],
      })
      await chat.save()
      chat = await Chat.findById(chat._id)
        .populate("customerId", "name")
        .populate("providerId", "name businessName")
        .populate("messages.senderId", "name")
    }

    // Mark messages as read for current user
    chat.messages.forEach((message) => {
      if (message.senderId._id.toString() !== req.user.userId) {
        message.isRead = true
      }
    })
    await chat.save()

    res.json(chat)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Send message
router.post("/booking/:bookingId/message", auth, async (req, res) => {
  try {
    const { message, messageType = "text" } = req.body

    const booking = await Booking.findById(req.params.bookingId)
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" })
    }

    // Check if user is part of this booking
    if (booking.customerId.toString() !== req.user.userId && booking.providerId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Access denied" })
    }

    let chat = await Chat.findOne({ bookingId: req.params.bookingId })

    if (!chat) {
      chat = new Chat({
        bookingId: req.params.bookingId,
        customerId: booking.customerId,
        providerId: booking.providerId,
        messages: [],
      })
    }

    const newMessage = {
      senderId: req.user.userId,
      message,
      messageType,
      isRead: false,
    }

    chat.messages.push(newMessage)
    chat.lastMessage = message
    chat.lastMessageTime = new Date()

    await chat.save()

    // Populate the new message
    await chat.populate("messages.senderId", "name")

    // Send notification to the other party
    const recipientId = booking.customerId.toString() === req.user.userId ? booking.providerId : booking.customerId

    await createNotification(
      recipientId,
      "New Message",
      `You have a new message regarding ${booking.serviceName}`,
      "chat",
      chat._id,
      "Chat",
      `/chat/${booking._id}`,
      "medium",
    )

    res.json(chat.messages[chat.messages.length - 1])
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Get all chats for user
router.get("/", auth, async (req, res) => {
  try {
    const chats = await Chat.find({
      $or: [{ customerId: req.user.userId }, { providerId: req.user.userId }],
      isActive: true,
    })
      .populate("customerId", "name")
      .populate("providerId", "name businessName")
      .populate("bookingId", "serviceName status")
      .sort({ lastMessageTime: -1 })

    res.json(chats)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
