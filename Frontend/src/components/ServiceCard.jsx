import { useNavigate } from "react-router-dom"
import FavoriteButton from "./FavoriteButton"
import { useAuth } from "../context/AuthContext"

const ServiceCard = ({ service, onBookNow }) => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleProviderClick = (e) => {
    e.stopPropagation()
    navigate(`/provider/${service.providerId._id}`)
  }

  return (
    <div
      onClick={() => navigate(`/service/${service._id}`)}
      className="group bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center text-2xl group-hover:bg-black group-hover:text-white">
            {service.icon}
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">Starting at</div>
            <div className="text-2xl font-bold text-black">${service.basePrice}</div>
          </div>
        </div>

        <h3 className="text-xl font-bold text-black mb-2">{service.name}</h3>
        <p className="text-gray-600 mb-3 line-clamp-2">{service.description}</p>

        <div
          onClick={handleProviderClick}
          className="block mb-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">{service.providerName}</p>
              <div className="flex items-center mt-1">
                <span className="text-yellow-400 text-sm">★</span>
                <span className="text-sm text-gray-600 ml-1">
                  {service.rating > 0 ? service.rating : "New"}
                </span>
                {service.totalReviews > 0 && (
                  <span className="text-xs text-gray-500 ml-2">({service.totalReviews} reviews)</span>
                )}
              </div>
            </div>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                service.providerId.isVerified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {service.providerId.isVerified ? "Verified" : "Unverified"}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
            {service.category}
          </span>
          <div className="flex items-center gap-2 mt-4">
            {user && user.role === "customer" && (
              <FavoriteButton
                serviceId={service._id}
                providerId={service.providerId._id}
                type="service"
                className="ml-0"
              />
            )}
            <button
              onClick={(e) => {
                e.stopPropagation()
                onBookNow(service._id)
              }}
              className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiceCard
