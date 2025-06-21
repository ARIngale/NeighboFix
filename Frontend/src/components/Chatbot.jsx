"use client"

import { useState, useRef, useEffect } from "react"

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      type: "bot",
      message: "Hello! I'm your NeighboFix assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const chatRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase()

    if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
      return "Hello! Welcome to NeighboFix. I'm here to help you with any questions about our services. What would you like to know?"
    }

    if (message.includes("service") || message.includes("what do you offer")) {
      return "We offer a wide range of home services including:\n\n🔧 Plumbing\n⚡ Electrical\n🌱 Gardening\n🔨 Carpentry\n🎨 Painting\n🧹 Cleaning\n❄️ HVAC\n\nWhich service interests you?"
    }

    if (message.includes("price") || message.includes("cost") || message.includes("how much")) {
      return "Our pricing:\n\nPlumbing: $75+\nElectrical: $85+\nGardening: $50+\nCarpentry: $80+\nPainting: $60+\n\nYou'll get an upfront quote before any work begins."
    }

    if (message.includes("book") || message.includes("schedule") || message.includes("appointment")) {
      return "To book:\n\n1. Browse our services\n2. Choose a service\n3. Pick date/time\n4. Confirm your booking\n\nNeed help finding a service?"
    }

    if (message.includes("emergency") || message.includes("urgent") || message.includes("asap")) {
      return "🚨 Emergency services available:\n\n• 24/7 plumbing\n• Electrical repairs\n• HVAC issues\n\nCall: (555) 911-HELP"
    }

    if (message.includes("hours") || message.includes("open") || message.includes("available")) {
      return "We operate:\n\nMon–Sat: 7 AM–8 PM\nSunday: 9 AM–6 PM\nEmergency: 24/7"
    }

    if (message.includes("area") || message.includes("location") || message.includes("where")) {
      return "We serve 50+ cities including Austin, Seattle, Denver, Phoenix.\n\nEnter your ZIP during booking to check availability."
    }

    if (message.includes("guarantee") || message.includes("quality") || message.includes("insurance")) {
      return "We guarantee:\n\n✅ Licensed & insured pros\n✅ Background-checked\n✅ Satisfaction guaranteed\n✅ Free re-service if not happy"
    }

    if (message.includes("payment") || message.includes("pay") || message.includes("card")) {
      return "We accept:\n\n💳 Cards\n💳 PayPal\n💳 Apple/Google Pay\n💵 Cash (for some)\n\nYou pay only after the job is done!"
    }

    if (message.includes("review") || message.includes("rating") || message.includes("feedback")) {
      return "🌟 4.9/5 rating\n🌟 10,000+ happy customers\n🌟 Reviews available per service\n\nYour feedback matters!"
    }

    if (message.includes("contact") || message.includes("support") || message.includes("help")) {
      return "📞 Contact us:\n\nEmail: support@neighbofix.com\nPhone: (555) 123-HELP\nLive Chat: 24/7"
    }

    if (message.includes("cancel") || message.includes("reschedule") || message.includes("change")) {
      return "📅 Need changes?\n\n✅ Free cancellation (2+ hrs before)\n✅ Easy rescheduling\n✅ No fees for advance notice"
    }

    return "I can help with:\n\n🔧 Services\n📅 Bookings\n🚨 Emergencies\n💳 Payments\n⭐ Reviews\n📞 Support\n\nWhat would you like to ask?"
  }

  const sendMessage = () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      type: "user",
      message: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    setTimeout(() => {
      const botResponse = getBotResponse(inputMessage)
      const botMessage = {
        type: "bot",
        message: botResponse,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000)
  }

  const quickReplies = [
    "What services do you offer?",
    "How much does it cost?",
    "How do I book a service?",
    "Do you offer emergency services?",
    "What areas do you serve?",
    "Contact support",
  ]

  const handleQuickReply = (reply) => {
    setInputMessage(reply)
    setTimeout(() => sendMessage(), 100)
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-black text-white p-4 rounded-full shadow-lg hover:bg-gray-800 transition-all duration-200 z-40 hover:scale-110"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          ref={chatRef}
          className="fixed bottom-24 right-6 w-80 sm:w-96 h-96 sm:h-[500px] bg-white border-2 border-black rounded-lg shadow-xl z-40 flex flex-col max-w-[calc(100vw-3rem)]"
        >
          {/* Header */}
          <div className="bg-black text-white p-4 rounded-t-lg flex-shrink-0 flex items-center justify-between">
            <div>
              <h3 className="font-bold">NeighboFix Assistant</h3>
              <p className="text-sm opacity-75 flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Online now
              </p>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-700 rounded transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs sm:max-w-sm p-3 rounded-lg ${
                    msg.type === "user" ? "bg-black text-white" : "bg-gray-100 text-black"
                  }`}
                >
                  <p className="text-sm break-words whitespace-pre-line">{msg.message}</p>
                  <p className="text-xs opacity-50 mt-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-black p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length === 1 && (
            <div className="px-4 pb-2 flex-shrink-0">
              <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {quickReplies.slice(0, 4).map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickReply(reply)}
                    className="text-xs bg-gray-100 text-black px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t flex-shrink-0">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black text-sm"
                disabled={isTyping}
              />
              <button
                onClick={sendMessage}
                disabled={isTyping || !inputMessage.trim()}
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Chatbot
