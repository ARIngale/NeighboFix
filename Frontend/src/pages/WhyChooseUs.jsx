"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import Testimonials from "../components/Testimonials"

const WhyChooseUs = () => {
  const [activeFeature, setActiveFeature] = useState(0)

  const features = [
    {
      title: "Verified Professionals",
      description:
        "All our service providers are thoroughly background-checked, licensed, and insured for your peace of mind.",
      icon: "✅",
      benefits: [
        "Background checks on all professionals",
        "Licensed and certified experts",
        "Fully insured for your protection",
        "Regular quality assessments",
        "Continuous training programs",
      ],
      stats: { number: "100%", label: "Verified Pros" },
      image: "images/verified.png",
    },
    {
      title: "Quick Response Time",
      description:
        "Get help when you need it most. We offer same-day service and emergency support for urgent repairs.",
      icon: "⚡",
      benefits: [
        "Same-day service available",
        "24/7 emergency support",
        "Average response time under 2 hours",
        "Real-time tracking of your service provider",
        "Instant booking confirmation",
      ],
      stats: { number: "< 2hrs", label: "Response Time" },
      image: "images/quick_response.png",
    },
    {
      title: "Affordable Pricing",
      description:
        "Transparent, competitive pricing with no hidden fees. You know exactly what you'll pay before work begins.",
      icon: "💰",
      benefits: [
        "Upfront pricing with no surprises",
        "Competitive rates in your area",
        "No hidden fees or charges",
        "Multiple payment options available",
        "Price match guarantee",
      ],
      stats: { number: "0", label: "Hidden Fees" },
      image: "images/affordable_pricing.png",
    },
    {
      title: "Local & Trusted",
      description:
        "We work with local professionals who understand your community and are committed to quality service.",
      icon: "🏘️",
      benefits: [
        "Local professionals who know your area",
        "Community-focused service",
        "Supporting local businesses",
        "Familiar with local building codes",
        "Quick response in your neighborhood",
      ],
      stats: { number: "50+", label: "Cities Served" },
      image: "images/payafterjobdone.png",
    },
  ]

  const stats = [
    { number: "10,000+", label: "Happy Customers", icon: "😊" },
    { number: "500+", label: "Verified Professionals", icon: "👨‍🔧" },
    { number: "50+", label: "Cities Served", icon: "🏙️" },
    { number: "4.9/5", label: "Average Rating", icon: "⭐" },
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "Austin, TX",
      rating: 5,
      comment: "Amazing service! The plumber arrived on time and fixed my issue quickly. Highly recommend!",
      service: "Plumbing Repair",
    },
    {
      name: "Mike Chen",
      location: "Seattle, WA",
      rating: 5,
      comment: "Professional electrician, fair pricing, and excellent work quality. Will definitely use again.",
      service: "Electrical Work",
    },
    {
      name: "Emily Davis",
      location: "Denver, CO",
      rating: 5,
      comment: "The gardening service transformed my backyard. Exceeded my expectations!",
      service: "Gardening",
    },
  ]

  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">Why Choose NeighboFix?</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're committed to providing the best home service experience with trusted professionals, transparent
            pricing, and exceptional customer support.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center bg-gray-50 p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-3xl md:text-4xl font-bold text-black mb-2">{stat.number}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Interactive Features Section */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-black text-center mb-12">What Makes Us Different</h2>

          {/* Feature Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {features.map((feature, index) => (
              <button
                key={index}
                onClick={() => setActiveFeature(index)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeFeature === index
                    ? "bg-black text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span className="mr-2">{feature.icon}</span>
                {feature.title}
              </button>
            ))}
          </div>

          {/* Active Feature Content */}
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center mb-6">
                  <div className="text-6xl mr-4">{features[activeFeature].icon}</div>
                  <div>
                    <h3 className="text-2xl font-bold text-black">{features[activeFeature].title}</h3>
                    <div className="bg-black text-white px-4 py-2 rounded-lg inline-block mt-2">
                      <span className="text-2xl font-bold">{features[activeFeature].stats.number}</span>
                      <span className="text-sm ml-2">{features[activeFeature].stats.label}</span>
                    </div>
                  </div>
                </div>
                <p className="text-lg text-gray-600 mb-6">{features[activeFeature].description}</p>
                <ul className="space-y-3">
                  {features[activeFeature].benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <img
                    src={features[activeFeature].image}
                    alt={features[activeFeature].title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
                <div className="absolute -top-4 -right-4 bg-black text-white p-4 rounded-full">
                  <span className="text-3xl">{features[activeFeature].icon}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <Testimonials/>

        {/* Guarantee Section */}
        <div className="text-center">
          <div className="bg-black text-white p-12 rounded-2xl">
            <div className="text-6xl mb-6">🛡️</div>
            <h3 className="text-3xl font-bold mb-4">Our 100% Satisfaction Guarantee</h3>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              We stand behind our work. If you're not completely satisfied with the service, we'll make it right or
              refund your money. That's our promise to you.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="text-3xl mb-2">💯</div>
                <h4 className="font-semibold mb-2">Quality Guaranteed</h4>
                <p className="text-sm opacity-75">Professional work every time</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🔄</div>
                <h4 className="font-semibold mb-2">Free Redo</h4>
                <p className="text-sm opacity-75">We'll fix it right if needed</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">💰</div>
                <h4 className="font-semibold mb-2">Money Back</h4>
                <p className="text-sm opacity-75">Full refund if not satisfied</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
                to="/services"
                className="bg-white text-black px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Browse Services
              </Link>
              <Link 
              to="/"
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-black transition-colors">
                Learn More
                </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WhyChooseUs
