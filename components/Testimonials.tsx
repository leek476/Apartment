import { Star } from "lucide-react";
import Handwritten from "./Handwritten";
import Faq from "./Faq";

const reviews = [
  { text: "I was overwhelmed looking for an apartment, but Rentlattice made it so easy. I got great options and found my new home in just a few days!", name: "Jasmine T.", place: "Dallas, TX" },
  { text: "The process was simple and professional. I really appreciate their responsiveness and helpful team.", name: "Marcus L.", place: "Oklahoma City, OK" },
  { text: "Rentlattice saved me so much time. They connected me with amazing landlords and I'm now in the perfect apartment!", name: "Tasha R.", place: "Houston, TX" },
];

export default function Testimonials() {
  return (
    <section className="bg-[#f1f7f1] px-6 py-12">
      <div className="mx-auto grid max-w-7xl items-start gap-8 lg:grid-cols-[0.8fr_1.6fr_1fr]">
        <div
          className="relative min-h-[260px] overflow-hidden rounded-xl bg-[#52775d] bg-cover bg-center"
          style={{ backgroundImage: "url('/images/woman-phone.webp')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
          <Handwritten className="absolute right-4 top-6 max-w-[150px] -rotate-6 text-3xl text-white">
            Real people. Real support. Real homes.
          </Handwritten>
        </div>

        <div>
          <h3 className="text-xl font-bold text-[#1e5a3a]">What Our Customers Say</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {reviews.map((r) => (
              <figure key={r.name} className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="flex gap-0.5 text-amber-400">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <blockquote className="mt-2 text-xs leading-relaxed text-gray-700">“{r.text}”</blockquote>
                <figcaption className="mt-3 text-xs">
                  <p className="font-semibold text-gray-900">– {r.name}</p>
                  <p className="text-gray-500">{r.place}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        <Faq />
      </div>
    </section>
  );
}
