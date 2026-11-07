import Link from "next/link";
import ApartmentRating from "@/components/ApartmentRating";
import ListingSetupNotice from "@/components/ListingSetupNotice";
import { getListings, isSupabaseConfigured } from "@/lib/listings";

export const dynamic = "force-dynamic";

export default async function RentPage() {
  const listings = await getListings();
  const supabaseConfigured = isSupabaseConfigured();

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-teal-700">Available rentals</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">Explore apartments</h1>
        </div>
        <Link href="/" className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:border-teal-700 hover:text-teal-700">
          Back home
        </Link>
      </div>

      {!supabaseConfigured && <ListingSetupNotice />}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {listings.map((listing) => (
          <Link
            key={listing.id}
            href={`/rent/${listing.id}`}
            className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
          >
            <article>
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="h-52 w-full object-cover"
                />
                {listing.images.length > 1 && (
                  <span className="absolute bottom-3 right-3 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white">
                    {listing.images.length} photos
                  </span>
                )}
              </div>
              <div className="p-5">
                <h2 className="mb-2 text-xl font-semibold text-gray-900">{listing.title}</h2>
                <ApartmentRating rating={listing.adminRating} />
                <p className="text-gray-600">{listing.address}, {listing.city} {listing.zip}</p>
                <p className="mt-3 text-2xl font-bold text-teal-700">${listing.price.toLocaleString()}/mo</p>
                <p className="mt-4 text-sm text-gray-600">
                  {listing.beds === 0 ? "Studio" : `${listing.beds} bd`} · {listing.baths} ba ·{" "}
                  {listing.sqft.toLocaleString()} sqft
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  {listing.petFriendly ? "Pet friendly" : "No pets"}
                </p>
                <span className="mt-4 inline-block text-sm font-semibold text-[#1e5a3a]">
                  View full details →
                </span>
              </div>
            </article>
          </Link>
        ))}
      </div>
      {listings.length === 0 && supabaseConfigured && (
        <section className="mt-8 rounded-xl border border-gray-200 bg-white p-8 text-center">
          <h2 className="text-lg font-bold text-gray-900">No apartments have been published yet</h2>
          <p className="mt-2 text-sm text-gray-600">
            Check back soon. New apartments will appear here after an admin publishes them.
          </p>
        </section>
      )}
    </main>
  );
}
