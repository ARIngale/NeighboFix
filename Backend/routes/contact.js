const express = require("express")
const router = express.Router()
const Contact = require("../models/Contact")
const auth = require("../middleware/auth")
const nodemailer = require("nodemailer")

// Get all contact messages
router.get("/",auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only Admin can access this endpoint" })
    }
    const contacts = await Contact.find().sort({ createdAt: -1 })
    res.json(contacts)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})


// PATCH /api/contact/:id/read
router.patch("/:id/read", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only Admin can access this endpoint" });
    }

    const updated = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: "read" },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    console.error("Error updating status to read:", error);
    res.status(500).json({ message: "Failed to mark as read" });
  }
});



// PATCH /api/contact/:id/respond
router.patch("/:id/respond", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only Admin can access this endpoint" })
    }

    const { responseMessage } = req.body

    const contact = await Contact.findById(req.params.id)
    if (!contact) return res.status(404).json({ message: "Message not found" })

    // Send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    const mailOptions = {
      from: `"NeighboFix Service Team" <${process.env.MAIL_USER}>`, 
      to: contact.email,
      subject: "Response to your contact message",
      text: responseMessage,
    };
    

    await transporter.sendMail(mailOptions)

    // Update status to responded
    contact.status = "responded"
    await contact.save()

    res.json({ message: "Response sent and status updated" })
  } catch (error) {
    console.error("Error in responding:", error)
    res.status(500).json({ message: "Failed to send response" })
  }
})


// Create new contact message
router.post("/", async (req, res) => {
  const contact = new Contact(req.body)
  try {
    const newContact = await contact.save()
    res.status(201).json(newContact)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

module.exports = router
