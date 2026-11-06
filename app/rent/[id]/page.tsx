import Link from "next/link";
import { notFound } from "next/navigation";
import ListingGallery from "@/components/ListingGallery";
import ListingSetupNotice from "@/components/ListingSetupNotice";
import { getListingById, isSupabaseConfigured } from "@/lib/listings";

export const dynamic = "force-dynamic";

export default async function ListingDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const listing = await getListingById(params.id);
  if (!listing) notFound();

  const images = listing.images.length ? listing.images : [listing.image];
  const supabaseConfigured = isSupabaseConfigured();

  return (
    <main className="min-h-screen bg-[#f5f7f5] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Link href="/rent" className="text-sm font-semibold text-[#1e5a3a] hover:underline">
          ← All apartments
        </Link>

        {!supabaseConfigured && <ListingSetupNotice />}

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(18rem,0.8fr)]">
          <ListingGallery images={images} title={listing.title} />

          <section className="h-fit rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#1e5a3a]">
              Apartment details
            </p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">{listing.title}</h1>
            <p className="mt-3 text-gray-600">
              {listing.address}, {listing.city} {listing.zip}
            </p>
            <p className="mt-6 text-3xl font-bold text-[#1e5a3a]">
              ${listing.price.toLocaleString()}
              <span className="text-base font-medium text-gray-600"> / month</span>
            </p>

            <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-100 pt-5">
              <div>
                <dt className="text-sm text-gray-500">Bedrooms</dt>
                <dd className="mt-1 font-semibold text-gray-900">
                  {listing.beds === 0 ? "Studio" : listing.beds}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Bathrooms</dt>
                <dd className="mt-1 font-semibold text-gray-900">{listing.baths}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Size</dt>
                <dd className="mt-1 font-semibold text-gray-900">
                  {listing.sqft.toLocaleString()} sqft
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Pets</dt>
                <dd className="mt-1 font-semibold text-gray-900">
                  {listing.petFriendly ? "Pet friendly" : "No pets"}
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </main>
  );
}
