"use client";

import { useState } from "react";
import { Plus, ArrowRight } from "lucide-react";
import Link from "next/link";

const faqs = [
  { q: "Is there a fee for your service?", a: "No. Our service is completely free to you." },
  { q: "How long does it take to get matched?", a: "Most people hear back within a few business days." },
  { q: "Do you check landlord background?", a: "We only work with verified landlords and property managers." },
  { q: "Can I search for apartments in other states?", a: "Right now we focus on Oklahoma and Texas." },
  { q: "What information do I need to provide?", a: "Your contact details, preferred city, budget, bedrooms, and move-in date." },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div id="faq">
      <h3 className="text-xl font-bold text-[#1e5a3a]">Frequently Asked Questions</h3>
      <ul className="mt-4 divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
        {faqs.map((f, i) => (
          <li key={f.q}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between px-4 py-3 text-left text-sm text-gray-800"
              aria-expanded={open === i}
            >
              {f.q}
              <Plus size={16} className={`transition ${open === i ? "rotate-45" : ""}`} />
            </button>
            {open === i && <p className="px-4 pb-3 text-sm text-gray-600">{f.a}</p>}
          </li>
        ))}
      </ul>
      <Link
        href="/faq"
        className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#1e5a3a] px-5 py-2 text-sm font-semibold text-[#1e5a3a]"
      >
        View FAQ Page <ArrowRight size={16} />
      </Link>
    </div>
  );
}