"use client"

import { useState } from "react"

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitMessage("Thank you for your message! We'll get back to you soon.")
        setFormData({ name: "", email: "", message: "" })
      } else {
        setSubmitMessage("Sorry, there was an error sending your message. Please try again.")
      }
    } catch (error) {
      setSubmitMessage("Sorry, there was an error sending your message. Please try again.")
    }

    setIsSubmitting(false)
  }

  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">Contact & Support</h1>
          <p className="text-xl text-gray-600">We're here to help with any questions or concerns</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-black mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="contact-name" className="block text-sm font-medium text-black mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="contact-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>

              <div>
                <label htmlFor="contact-email" className="block text-sm font-medium text-black mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="contact-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium text-black mb-2">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>

              {submitMessage && (
                <p className={`text-center ${submitMessage.includes("Thank you") ? "text-green-600" : "text-red-600"}`}>
                  {submitMessage}
                </p>
              )}
            </form>
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold text-black mb-6">Get in Touch</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="text-2xl mr-4">📞</div>
                <div>
                  <h3 className="font-semibold text-black">Phone</h3>
                  <p className="text-gray-600">1-800-NEIGHBO (1-800-634-4426)</p>
                  <p className="text-sm text-gray-500">Available 24/7 for emergencies</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="text-2xl mr-4">✉️</div>
                <div>
                  <h3 className="font-semibold text-black">Email</h3>
                  <p className="text-gray-600">support@neighbofix.com</p>
                  <p className="text-sm text-gray-500">We respond within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="text-2xl mr-4">📍</div>
                <div>
                  <h3 className="font-semibold text-black">Address</h3>
                  <p className="text-gray-600">
                    123 Service Street
                    <br />
                    Hometown, ST 12345
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="text-2xl mr-4">🕒</div>
                <div>
                  <h3 className="font-semibold text-black">Business Hours</h3>
                  <p className="text-gray-600">
                    Monday - Friday: 7:00 AM - 8:00 PM
                    <br />
                    Saturday: 8:00 AM - 6:00 PM
                    <br />
                    Sunday: 9:00 AM - 5:00 PM
                  </p>
                  <p className="text-sm text-gray-500">Emergency services available 24/7</p>
                </div>
              </div>
            </div>

            {/* Social */}
            <div className="mt-8">
              <h3 className="font-semibold text-black mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-black hover:text-gray-600 transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-1.031-2.195-1.518-.63-.481-.477-1.041.044-1.522L12 3.58c1.088.432 2.364.934 3.626 1.478-.564-.345-1.161-.599-1.815-.777zm3.626 1.844L12 17.38c-1.031-.484-2.138-.93-3.181-1.319-.599.38-1.195.769-1.815 1.151 1.014-.423 2.005-.867 2.987-1.314z" />
                  </svg>
                </a>
                {/* Add more icons here */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
