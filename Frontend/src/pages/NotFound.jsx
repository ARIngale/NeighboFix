import { Link } from "react-router-dom"

const NotFound = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="text-9xl font-bold text-black mb-4">404</div>
        <div className="text-6xl mb-6">🔧</div>
        <h1 className="text-3xl font-bold text-black mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          Oops! The page you're looking for seems to have wandered off. Don't worry, our team of professionals can fix
          this too!
        </p>
        <div className="space-y-4">
          <Link
            to="/"
            className="block bg-black text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Go Home
          </Link>
          <Link
            to="/services"
            className="block border-2 border-black text-black px-8 py-3 rounded-lg text-lg font-semibold hover:bg-black hover:text-white transition-colors"
          >
            Browse Services
          </Link>
        </div>
        <div className="mt-8 text-sm text-gray-500">
          <p>Need help? Contact our support team:</p>
          <p className="font-semibold">(555) 123-HELP</p>
        </div>
      </div>
    </div>
  )
}

export default NotFound
