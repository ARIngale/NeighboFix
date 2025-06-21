import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Services from "./pages/Services"
import HowItWorks from "./pages/HowItWorks"
import WhyChooseUs from "./pages/WhyChooseUs"
import Contact from "./pages/Contact"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import CustomerDashboard from './pages/CustomerDashboard'
import ProviderDashboard from './pages/ProviderDashboard'
import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"
import ResetPassword from "./pages/ResetPassword"
import BookingForm from "./components/BookingForm"
import AdminDashboard from './pages/AdminDashboard'
import AdminProtectedRoute from './components/AdminProtectedRoute'

function App() {

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white text-black">
        <Navbar/>
        <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/why-choose-us" element={<WhyChooseUs />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={
                <AdminProtectedRoute> 
                  <AdminDashboard />
                </AdminProtectedRoute>
                } />
              <Route
                path="/book/:serviceId"
                element={
                  <ProtectedRoute requiredRole="customer">
                    <BookingForm />
                  </ProtectedRoute>
                }
              />
              <Route
              path="/customer-dashboard"
              element={
                <ProtectedRoute requiredRole="customer">
                  <CustomerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/provider-dashboard"
              element={
                <ProtectedRoute requiredRole="provider">
                  <ProviderDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/reset-password" element={<ResetPassword />} />
            </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
