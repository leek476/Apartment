"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const cities = [
  "Oklahoma City, OK", "Tulsa, OK", "Norman, OK", "Edmond, OK", "Lawton, OK",
  "Dallas, TX", "Houston, TX", "Austin, TX", "San Antonio, TX", "Fort Worth, TX",
];
const budgets = ["Under $1,000", "$1,000 – $1,500", "$1,500 – $2,000", "$2,000 – $3,000", "$3,000+"];
const bedrooms = ["Studio", "1 Bedroom", "2 Bedrooms", "3 Bedrooms", "4+ Bedrooms"];

const input =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#1e5a3a] focus:ring-1 focus:ring-[#1e5a3a]";
const label = "mb-1 block text-xs font-semibold text-gray-900";

export default function RequestForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const form = e.currentTarget;
    const request = Object.fromEntries(new FormData(form).entries());
    const search = new URLSearchParams({
      city: String(request.city),
      zip: String(request.zip),
      budget: String(request.budget),
      bedrooms: String(request.bedrooms),
      moveIn: String(request.moveIn),
    });

    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      if (response.ok) {
        search.set("requestStatus", "sent");
      } else {
        const result: unknown = await response.json().catch(() => null);
        const code =
          result && typeof result === "object" && "code" in result
            ? result.code
            : undefined;
        search.set(
          "requestStatus",
          code === "EMAIL_NOT_CONFIGURED" ? "email-not-configured" : "not-sent",
        );
      }
    } catch {
      search.set("requestStatus", "not-sent");
    } finally {
      setIsSubmitting(false);
    }
    router.push(`/matches?${search.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-6 shadow-xl">
      <h2 className="text-xl font-bold text-gray-900">Request Your Apartment Search</h2>
      <p className="mb-4 text-xs text-gray-600">
        Tell us what you need and our local team will look for a match.
      </p>

      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label htmlFor="request-name" className={label}>Full Name *</label>
          <input id="request-name" name="name" required maxLength={100} autoComplete="name" placeholder="Your full name" className={input} />
        </div>
        <div>
          <label htmlFor="request-email" className={label}>Email Address *</label>
          <input id="request-email" name="email" type="email" required maxLength={254} autoComplete="email" placeholder="you@example.com" className={input} />
        </div>
        <div>
          <label htmlFor="request-phone" className={label}>Phone Number *</label>
          <input id="request-phone" name="phone" type="tel" required maxLength={30} autoComplete="tel" placeholder="(XXX) XXX-XXXX" className={input} />
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="request-city" className={label}>Preferred City *</label>
          <select id="request-city" name="city" required defaultValue="" className={input}>
            <option value="" disabled>Select a city</option>
            {cities.map((city) => <option key={city} value={city}>{city}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="request-zip" className={label}>ZIP Code *</label>
          <input id="request-zip" name="zip" required maxLength={10} inputMode="numeric" autoComplete="postal-code" placeholder="ZIP code" className={input} />
        </div>
        <div>
          <label htmlFor="request-budget" className={label}>Monthly Budget *</label>
          <select id="request-budget" name="budget" required defaultValue="" className={input}>
            <option value="" disabled>Select range</option>
            {budgets.map((budget) => <option key={budget} value={budget}>{budget}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="request-bedrooms" className={label}>Bedrooms *</label>
          <select id="request-bedrooms" name="bedrooms" required defaultValue="" className={input}>
            <option value="" disabled>Select</option>
            {bedrooms.map((bedroom) => <option key={bedroom} value={bedroom}>{bedroom}</option>)}
          </select>
        </div>
      </div>

      <div className="mt-3">
        <label htmlFor="request-move-in" className={label}>Desired Move-in Date *</label>
        <input id="request-move-in" name="moveIn" type="date" required className={input} />
      </div>

      <label className="mt-4 flex items-start gap-2 text-[11px] leading-snug text-gray-600">
        <input name="consent" value="yes" type="checkbox" required className="mt-0.5" />
        I agree to receive communications about rental opportunities and understand my
        information may be shared with relevant property managers and landlords.
      </label>

      {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#1e5a3a] py-3 text-sm font-semibold text-white hover:bg-[#164a2e] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Sending request…" : "Find My Apartment"} <ArrowRight size={16} />
      </button>
    </form>
  );
}
