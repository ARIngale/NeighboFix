"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "../context/AuthContext"

const ChatWindow = ({ bookingId, onClose }) => {
  const { user, token } = useAuth()
  const [chat, setChat] = useState(null)
  const [newMessage, setNewMessage] = useState("")
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    fetchChat()
    // Set up polling for real-time updates
    const interval = setInterval(fetchChat, 5000) // Poll every 5 seconds
    return () => clearInterval(interval)
  }, [bookingId])

  useEffect(() => {
    scrollToBottom()
  }, [chat?.messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  const fetchChat = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/chat/booking/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
  
      if (response.ok) {
        const data = await response.json()
        setChat(data)
      } else if (response.status === 404) {
        // No chat exists yet – initialize an empty chat structure
        setChat({
          bookingId: { serviceName: "Service" }, // fallback if needed
          messages: [],
          providerId: null,
          customerId: null,
        })
      } else {
        console.error("Failed to fetch chat:", response.status)
      }
    } catch (error) {
      console.error("Error fetching chat:", error)
    } finally {
    //   
    }
  }
  

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    setSending(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/chat/booking/${bookingId}/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: newMessage }),
      })

      if (response.ok) {
        setNewMessage("")
        fetchChat()
      }
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setSending(false)
    }
  }


  if (!chat) return null

  const otherParty = user.role === "customer" ? chat.providerId : chat.customerId

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full h-[600px] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-black">Chat with {otherParty?.businessName || otherParty?.name}</h3>
            <p className="text-sm text-gray-600">Regarding: {chat.bookingId?.serviceName}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chat.messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <div className="text-4xl mb-2">💬</div>
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            chat.messages.map((message, index) => (
              <div key={index} className={`flex ${message.senderId._id === user.id ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.senderId._id === user.id ? "bg-black text-white" : "bg-gray-100 text-black"
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {sending ? "..." : "Send"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ChatWindow
