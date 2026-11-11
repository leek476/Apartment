import { Check } from "lucide-react";
import Handwritten from "./Handwritten";

const areas = [
  {
    state: "Oklahoma",
    cities: ["Oklahoma City", "Tulsa", "Norman", "Edmond", "Lawton"],
  },
  {
    state: "Texas",
    cities: ["Dallas", "Houston", "Austin", "San Antonio", "Fort Worth"],
  },
];

export default function ServiceAreas() {
  return (
    <section id="about" className="grid bg-[#f1f7f1] lg:grid-cols-[1.2fr_1fr]">
      <div className="px-6 py-12 lg:pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]">
        <h2 className="text-2xl font-bold text-[#1e5a3a] sm:text-3xl">Apartment searches in Oklahoma and Texas</h2>
        <p className="mt-1 text-sm text-gray-700">
          Tell us which of these cities you have in mind and our team can help with your search.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {areas.map((a) => (
            <div key={a.state} className="rounded-xl bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-lg font-bold text-gray-900">{a.state}</h3>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700">
                {a.cities.map((c) => (
                  <li key={c} className="flex items-center gap-2">
                    <Check size={14} className="shrink-0 text-[#1e5a3a]" /> {c}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div
        className="relative min-h-[280px] overflow-hidden bg-[#3a4a3f] bg-cover bg-center"
        style={{ backgroundImage: "url('/images/living-room.webp')" }}
      >
        <div className="absolute inset-0 bg-black/10" />
        <Handwritten className="absolute right-8 top-1/2 max-w-[260px] -translate-y-1/2 -rotate-6 text-3xl text-white">
          More than just apartments… we help you find a place to call home.
        </Handwritten>
      </div>
    </section>
  );
}