"use client"

import { useState } from "react"
import { Link } from "react-router-dom"

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0)

  const steps = [
    {
      number: "1",
      title: "Choose a Service",
      description:
        "Browse our comprehensive list of home services and select what you need. From plumbing to electrical work, we have trusted professionals for every job.",
      icon: "🔍",
      details: [
        "Browse by category or search for specific services",
        "View service descriptions and starting prices",
        "Read reviews from other customers",
        "Compare different service providers",
      ],
      image: "images/pick_service.png",
    },
    {
      number: "2",
      title: "Pick a Time",
      description:
        "Select your preferred date and time slot that works best for your schedule. We offer flexible booking options including same-day service.",
      icon: "📅",
      details: [
        "Choose from available time slots",
        "Same-day and next-day options available",
        "Flexible rescheduling if needed",
        "Get instant confirmation",
      ],
      image: "images/pick_a_time.png",
    },
    {
      number: "3",
      title: "We Send a Pro",
      description:
        "A verified, licensed professional will arrive at your location with all necessary tools and equipment to complete the job efficiently.",
      icon: "👨‍🔧",
      details: [
        "All professionals are background-checked",
        "Licensed and insured for your protection",
        "Arrive with professional tools and equipment",
        "Real-time tracking of your service provider",
      ],
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop",
    },
    {
      number: "4",
      title: "Pay After Job Done",
      description:
        "Only pay when you're completely satisfied with the work. We accept various payment methods for your convenience.",
      icon: "💳",
      details: [
        "Pay only after job completion",
        "Multiple payment options available",
        "Satisfaction guaranteed or money back",
        "Leave a review to help others",
      ],
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
    },
  ]

  const features = [
    {
      title: "24/7 Support",
      description: "Round-the-clock customer support for all your needs",
      icon: "🕐",
    },
    {
      title: "Instant Booking",
      description: "Book services in just a few clicks",
      icon: "⚡",
    },
    {
      title: "Verified Pros",
      description: "All service providers are thoroughly vetted",
      icon: "✅",
    },
    {
      title: "Money Back Guarantee",
      description: "100% satisfaction guaranteed or your money back",
      icon: "💰",
    },
  ]

  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">How NeighboFix Works</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Getting your home fixed has never been easier. Follow these simple steps to book trusted professionals in
            your area.
          </p>
        </div>

        {/* Interactive Steps */}
        <div className="mb-20">
          {/* Step Navigation */}
          <div className="flex justify-center mb-12">
            <div className="flex space-x-4 bg-gray-100 p-2 rounded-lg">
              {steps.map((step, index) => (
                <button
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    activeStep === index
                      ? "bg-black text-white shadow-lg"
                      : "text-gray-600 hover:text-black hover:bg-white"
                  }`}
                >
                  Step {step.number}
                </button>
              ))}
            </div>
          </div>

          {/* Active Step Content */}
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center mb-6">
                  <div className="bg-black text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mr-4">
                    {steps[activeStep].number}
                  </div>
                  <div className="text-6xl">{steps[activeStep].icon}</div>
                </div>
                <h3 className="text-3xl font-bold text-black mb-4">{steps[activeStep].title}</h3>
                <p className="text-lg text-gray-600 mb-6">{steps[activeStep].description}</p>
                <ul className="space-y-3">
                  {steps[activeStep].details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <div className="bg-white p-4 rounded-xl shadow-lg">
                  <img
                    src={steps[activeStep].image}
                    alt={steps[activeStep].title}
                    className="w-full h-64 object-contain rounded-lg"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-black text-white p-4 rounded-full">
                  <span className="text-2xl">{steps[activeStep].icon}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-black text-center mb-12">Why Choose Our Process?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-black mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-black text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "How quickly can I get a service provider?",
                answer:
                  "Most services can be booked within 24 hours. For urgent repairs, we offer same-day service in most areas.",
              },
              {
                question: "Are all service providers insured?",
                answer:
                  "Yes, all our service providers are fully licensed, insured, and background-checked for your safety and peace of mind.",
              },
              {
                question: "What if I'm not satisfied with the service?",
                answer:
                  "We offer a 100% satisfaction guarantee. If you're not happy with the service, we'll make it right or refund your money.",
              },
              {
                question: "Can I reschedule my appointment?",
                answer:
                  "Yes, you can reschedule your appointment up to 2 hours before the scheduled time through your dashboard or by calling support.",
              },
            ].map((faq, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-black mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-black text-white p-12 rounded-2xl">
            <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-xl mb-8 opacity-90">
              Book your first service today and experience the NeighboFix difference!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/services"
                className="bg-white text-black px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Browse Services
              </Link>
              <Link
                to="/contact"
                className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-black transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HowItWorks
