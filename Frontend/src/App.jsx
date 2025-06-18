import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Services from "./pages/Services"
import HowItWorks from "./pages/HowItWorks"
import WhyChooseUs from "./pages/WhyChooseUs"
import Contact from "./pages/Contact"

function App() {

  return (
    <Router>
       <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/why-choose-us" element={<WhyChooseUs />} />
            <Route path="/contact" element={<Contact />} />
        </Routes>
    </Router>
  )
}

export default App
