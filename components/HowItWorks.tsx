import { ClipboardList, Search, Home, ArrowRight } from "lucide-react";

const steps = [
  { icon: ClipboardList, title: "Submit Your Request", text: "Tell us what you're looking for by filling out our simple form." },
  { icon: Search, title: "We Search for You", text: "We connect with trusted property managers and landlords in your area." },
  { icon: Home, title: "Get Matched", text: "You'll receive available rental options that fit your needs." },
];

export default function HowItWorks() {
  return (
    <section id="how" className="bg-[#e4f0e6] px-6 py-12">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <h2 className="text-3xl font-bold text-[#1e5a3a]">How It Works</h2>
          <p className="mt-1 text-sm text-gray-700">Getting started is easy. Here&apos;s how it works:</p>
          <div className="mt-8 grid gap-6 md:grid-cols-3 md:divide-x md:divide-gray-300">
            {steps.map(({ icon: Icon, title, text }, i) => (
              <div key={title} className="md:px-5 md:first:pl-0">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1e5a3a] text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <Icon size={34} strokeWidth={1.5} className="text-[#1e5a3a]" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-gray-900">{title}</h3>
                <p className="mt-1 text-sm text-gray-600">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div
          className="relative overflow-hidden rounded-2xl bg-[#1e5a3a] bg-cover bg-center p-8 text-white"
          style={{ backgroundImage: "url('/images/skyline.webp')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d2416]/90 to-[#0d2416]/30" />
          <div className="relative">
            <p className="text-[10px] font-semibold tracking-[0.2em]">LOOKING FOR AN APARTMENT IN</p>
            <h3 className="mt-2 text-3xl font-bold leading-tight">Oklahoma<br />or Texas?</h3>
            <p className="mt-3 max-w-[220px] text-sm text-white/90">
              We&apos;re here to help you find the right place, in the right location.
            </p>
            <a
              href="#find"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-[#1e5a3a]"
            >
              Get Started <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}