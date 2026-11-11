import Hero from "@/components/Hero";
import ServiceAreas from "@/components/ServiceAreas";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div id="top">
      <Navbar />
      <main>
        <Hero />
        <ServiceAreas />
        <HowItWorks />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}