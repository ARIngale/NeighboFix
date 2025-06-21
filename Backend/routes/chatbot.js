const express = require("express")
const router = express.Router()

// Enhanced chatbot responses with more comprehensive coverage
const responses = {
  greeting: [
    "Hello! How can I help you with your home service needs today?",
    "Hi there! I'm here to assist you with NeighboFix services.",
    "Welcome to NeighboFix! What can I help you with?",
    "Good day! How may I assist you with finding the right home service?",
  ],
  services: {
    general: [
      "We offer plumbing, electrical, gardening, carpentry, appliance repair, painting, cleaning, and HVAC services. Which one interests you?",
      "Our services include home repairs, maintenance, and improvements. What type of service do you need?",
      "We have verified professionals for: Plumbing, Electrical work, Gardening, Carpentry, Appliance repair, Painting, Cleaning, and HVAC. What do you need help with?",
    ],
    plumbing: [
      "Our plumbing services include leak repairs, pipe installations, drain cleaning, faucet repairs, and emergency plumbing. Starting at $75.",
      "We handle all plumbing needs: leaky pipes, clogged drains, water heater issues, and bathroom/kitchen plumbing installations.",
    ],
    electrical: [
      "Our electrical services cover wiring, outlet installations, lighting fixtures, electrical repairs, and safety inspections. Starting at $85.",
      "We provide licensed electrical work including panel upgrades, outlet repairs, lighting installation, and electrical troubleshooting.",
    ],
    gardening: [
      "Gardening services include lawn mowing, landscaping, tree trimming, garden maintenance, and seasonal cleanup. Starting at $50.",
      "We offer complete garden care: lawn maintenance, plant care, landscaping design, and outdoor cleanup services.",
    ],
    carpentry: [
      "Carpentry services include furniture repair, custom woodwork, cabinet installation, and home repairs. Starting at $70.",
      "Our carpenters handle custom furniture, home repairs, deck building, and interior woodwork projects.",
    ],
  },
  booking: [
    "To book a service: 1) Select your service, 2) Choose date & time, 3) Provide contact details, 4) Confirm booking. It's that simple!",
    "Booking is easy! Browse services, pick a time slot, fill in your details, and we'll send a verified professional to your location.",
    "You can book in 3 steps: Choose service → Pick time → Confirm details. The whole process takes less than 5 minutes!",
  ],
  pricing: [
    "Our pricing is transparent with no hidden fees. You'll see the starting price upfront, and the final cost depends on the job complexity.",
    "We offer competitive rates with upfront pricing. Prices start from $35 for basic services and vary based on the work required.",
    "All prices are shown upfront. You only pay after the job is completed to your satisfaction. No hidden charges!",
  ],
  emergency: [
    "For emergency services, we offer 24/7 support for urgent repairs. Call us immediately for plumbing, electrical, or HVAC emergencies.",
    "Emergency services are available 24/7. We prioritize urgent repairs and typically respond within 2 hours for emergencies.",
  ],
  payment: [
    "We accept cash, credit cards, and digital payments. You only pay after the service is completed to your satisfaction.",
    "Payment is due after job completion. We accept all major credit cards, cash, and digital wallet payments for your convenience.",
  ],
  providers: [
    "All our service providers are background-checked, licensed, insured, and verified. We ensure quality and reliability.",
    "Our professionals are thoroughly vetted with background checks, proper licensing, and insurance coverage for your peace of mind.",
  ],
  support: [
    "You can reach our support team at support@neighbofix.com or call 1-800-NEIGHBO. We're here to help 24/7!",
    "For additional support, contact us via email at support@neighbofix.com or through our customer service hotline.",
  ],
  hours: [
    "Our regular business hours are Monday-Friday 7AM-8PM, Saturday 8AM-6PM, Sunday 9AM-5PM. Emergency services available 24/7.",
    "We operate 7 days a week with extended hours. Emergency services are available around the clock for urgent needs.",
  ],
  areas: [
    "We currently serve over 50 cities and are expanding rapidly. Enter your zip code on our website to check service availability in your area.",
    "Our service area is growing! We cover major metropolitan areas and surrounding suburbs. Check our website for your specific location.",
  ],
}

// Enhanced keyword matching with more sophisticated logic
function getBotResponse(message) {
  const msg = message.toLowerCase()

  // Greeting detection
  if (msg.match(/\b(hello|hi|hey|good morning|good afternoon|good evening)\b/)) {
    return responses.greeting[Math.floor(Math.random() * responses.greeting.length)]
  }

  // Service-specific queries
  if (msg.includes("plumbing") || msg.includes("plumber") || msg.includes("leak") || msg.includes("pipe")) {
    return responses.services.plumbing[Math.floor(Math.random() * responses.services.plumbing.length)]
  }

  if (msg.includes("electrical") || msg.includes("electrician") || msg.includes("wiring") || msg.includes("outlet")) {
    return responses.services.electrical[Math.floor(Math.random() * responses.services.electrical.length)]
  }

  if (msg.includes("garden") || msg.includes("lawn") || msg.includes("landscaping") || msg.includes("mowing")) {
    return responses.services.gardening[Math.floor(Math.random() * responses.services.gardening.length)]
  }

  if (msg.includes("carpentry") || msg.includes("carpenter") || msg.includes("wood") || msg.includes("furniture")) {
    return responses.services.carpentry[Math.floor(Math.random() * responses.services.carpentry.length)]
  }

  // General service inquiry
  if (msg.match(/\b(service|services|what do you offer|what can you do)\b/)) {
    return responses.services.general[Math.floor(Math.random() * responses.services.general.length)]
  }

  // Booking related
  if (msg.match(/\b(book|schedule|appointment|how to book|booking process)\b/)) {
    return responses.booking[Math.floor(Math.random() * responses.booking.length)]
  }

  // Pricing related
  if (msg.match(/\b(price|cost|how much|pricing|rates|expensive|cheap)\b/)) {
    return responses.pricing[Math.floor(Math.random() * responses.pricing.length)]
  }

  // Emergency related
  if (msg.match(/\b(emergency|urgent|asap|immediate|24\/7|24 hours)\b/)) {
    return responses.emergency[Math.floor(Math.random() * responses.emergency.length)]
  }

  // Payment related
  if (msg.match(/\b(payment|pay|credit card|cash|how to pay)\b/)) {
    return responses.payment[Math.floor(Math.random() * responses.payment.length)]
  }

  // Provider/professional related
  if (msg.match(/\b(provider|professional|technician|worker|qualified|licensed)\b/)) {
    return responses.providers[Math.floor(Math.random() * responses.providers.length)]
  }

  // Support related
  if (msg.match(/\b(support|help|contact|phone|email|customer service)\b/)) {
    return responses.support[Math.floor(Math.random() * responses.support.length)]
  }

  // Hours related
  if (msg.match(/\b(hours|open|closed|when|time|available)\b/)) {
    return responses.hours[Math.floor(Math.random() * responses.hours.length)]
  }

  // Service area related
  if (msg.match(/\b(area|location|where|city|serve|available in)\b/)) {
    return responses.areas[Math.floor(Math.random() * responses.areas.length)]
  }

  // Thank you responses
  if (msg.match(/\b(thank|thanks|appreciate)\b/)) {
    return "You're welcome! Is there anything else I can help you with regarding our home services?"
  }

  // Goodbye responses
  if (msg.match(/\b(bye|goodbye|see you|talk later)\b/)) {
    return "Goodbye! Feel free to reach out anytime you need help with home services. Have a great day!"
  }

  // Default responses for unmatched queries
  const defaultResponses = [
    "I'm here to help with NeighboFix services! You can ask me about our services, booking process, pricing, or anything else related to home repairs and maintenance.",
    "I can help you with information about our home services, how to book, pricing, and more. What would you like to know?",
    "Feel free to ask me about plumbing, electrical, gardening, carpentry, or any other home services we offer!",
    "I'm your NeighboFix assistant! Ask me about our services, how to book, pricing, emergency services, or anything else you need help with.",
  ]

  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
}

// Chat endpoint
router.post("/chat", (req, res) => {
  try {
    const { message } = req.body

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ message: "Message is required" })
    }

    const botResponse = getBotResponse(message)

    res.json({
      message: botResponse,
      timestamp: new Date(),
    })
  } catch (error) {
    console.error("Chatbot error:", error)
    res.status(500).json({
      message:
        "I'm having some technical difficulties right now. Please try again in a moment or contact our support team at support@neighbofix.com",
    })
  }
})

module.exports = router
