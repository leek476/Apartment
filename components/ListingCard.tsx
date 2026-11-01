import Link from "next/link";

import type { Listing } from "@/data/listings";

type ListingCardProps = {
  listing: Listing;
};

export default function ListingCard({ listing }: ListingCardProps) {
  return (
    <Link href={`/rent/${listing.id}`} className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative h-52 w-full overflow-hidden">
        <img
          src={listing.image}
          alt={listing.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{listing.title}</h3>
            <p className="text-sm text-gray-600">{listing.address}</p>
            <p className="text-sm text-gray-500">{listing.city}</p>
          </div>
          <span className="text-lg font-bold text-teal-700">${listing.price.toLocaleString()}/mo</span>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>{listing.beds} bd</span>
          <span>{listing.baths} ba</span>
          <span>{listing.sqft.toLocaleString()} sqft</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="rounded-full bg-teal-50 px-2 py-1 text-teal-700">
            {listing.petFriendly ? "Pet friendly" : "No pets"}
          </span>
          <span className="text-gray-500">View details</span>
        </div>
      </div>
    </Link>
  );
}
