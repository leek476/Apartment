import Link from "next/link";

import { listings } from "@/data/listings";

export default function RentPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-teal-700">Available rentals</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">Rent in Colorado</h1>
        </div>
        <Link href="/" className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:border-teal-700 hover:text-teal-700">
          Back home
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {listings.map((listing) => (
          <article key={listing.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-2 text-xl font-semibold text-gray-900">{listing.title}</h2>
            <p className="text-gray-600">{listing.address}</p>
            <p className="mt-3 text-2xl font-bold text-teal-700">${listing.price.toLocaleString()}/mo</p>
            <p className="mt-4 text-sm text-gray-600">
              {listing.beds} bd · {listing.baths} ba · {listing.sqft.toLocaleString()} sqft
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}
