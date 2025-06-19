const express = require("express")
const jwt = require("jsonwebtoken")
const router = express.Router()
const User = require("../models/User")
const crypto = require("crypto")
const nodemailer = require("nodemailer");

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone, role, businessName, businessDescription } = req.body

    // Check if user already exists with same email and role
    const existingUser = await User.findOne({ email, role })
    if (existingUser) {
      return res.status(400).json({ message: `${role} account with this email already exists` })
    }

    // Create new user
    const userData = {
      name,
      email,
      password,
      phone,
      role,
    }

    if (role === "provider") {
      userData.businessName = businessName
      userData.businessDescription = businessDescription
    }

    const user = new User(userData)
    await user.save()

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET || "secret",
      {
        expiresIn: "7d",
      },
    )

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        businessName: user.businessName,
        phone: user.phone,
        address: user.address,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ message: error.message })
  }
})

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body

    if (!email || !password || !role) {
      return res.status(400).json({ message: "Email, password, and role are required" })
    }

    // Find user with specific email and role
    const user = await User.findOne({ email, role })
    if (!user) {
      return res.status(400).json({ message: `No ${role} account found with this email` })
    }

    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET || "secret",
      {
        expiresIn: "7d",
      },
    )

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        businessName: user.businessName,
        phone: user.phone,
        address: user.address,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

// Forgot Password
router.post("/forgot-password", async (req, res) => {
  try {
    const { email, role } = req.body

    const user = await User.findOne({ email, role })
    if (!user) {
      return res.status(404).json({ message: `No ${role} account found with this email` })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex")
    user.resetPasswordToken = resetToken
    user.resetPasswordExpires = Date.now() + 3600000 // 1 hour

    await user.save()

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${email}`;

    // Nodemailer config
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Use app password, not raw password
      },
    });

    await transporter.sendMail({
      from: `"Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Link",
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.</p>`,
    });

    // In a real app, you would send an email here
    // For now, we'll just return the token (don't do this in production!)
    res.json({ message: "Password reset email sent" });

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Reset Password
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    })

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" })
    }

    user.password = newPassword
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined

    await user.save()

    res.json({ message: "Password reset successful" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
