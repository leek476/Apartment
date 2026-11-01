import Hero from "@/components/Hero";
import ServiceAreas from "@/components/ServiceAreas";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";

export default function Home() {
  return (
    <div id="top">
      <header className="absolute inset-x-0 top-0 z-10 bg-transparent px-6 py-3">
        <div className="mx-auto max-w-7xl">
          <Logo light />
        </div>
      </header>
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