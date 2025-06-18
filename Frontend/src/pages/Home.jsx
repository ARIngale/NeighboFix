import Hero from "../components/Hero"
import ServicePreview from "../components/ServicePreview"
import HowItWorksPreview from "../components/HowItWorksPreview"
import Testimonials from "../components/Testimonials"

const Home = () =>{
    return (
        <>
            <Hero/>
            <ServicePreview/>
            <HowItWorksPreview/>
            <Testimonials/>
        </>
    )
}

export default Home