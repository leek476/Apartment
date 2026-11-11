import Link from "next/link";
import type { Listing } from "@/data/listings";
import ApartmentRating from "@/components/ApartmentRating";
import ListingSetupNotice from "@/components/ListingSetupNotice";
import { getListings, isSupabaseConfigured } from "@/lib/listings";

export const dynamic = "force-dynamic";

const budgetRanges: Record<string, { min: number; max: number }> = {
  "Under $1,000": { min: 0, max: 999 },
  "$1,000 – $1,500": { min: 1000, max: 1500 },
  "$1,500 – $2,000": { min: 1500, max: 2000 },
  "$2,000 – $3,000": { min: 2000, max: 3000 },
  "$3,000+": { min: 3000, max: Infinity },
};

const bedroomCounts: Record<string, number> = {
  Studio: 0,
  "1 Bedroom": 1,
  "2 Bedrooms": 2,
  "3 Bedrooms": 3,
  "4+ Bedrooms": 4,
};

type SearchParams = Record<string, string | string[] | undefined>;

function param(params: SearchParams, key: string): string {
  const value = params[key];
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value[0] ?? "";
  return "";
}

function cityName(value: string) {
  return value.split(",")[0].trim().toLowerCase();
}

function stateCode(value: string) {
  return value.split(",")[1]?.trim().toLowerCase() ?? "";
}

const field =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900";

function ResultCard({ listing, zip }: { listing: Listing; zip: string }) {
  return (
    <Link
      href={`/rent/${listing.id}`}
      className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
    >
      <article>
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={listing.image} alt={listing.title} className="h-52 w-full object-cover" />
          {listing.images.length > 1 && (
            <span className="absolute bottom-3 right-3 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white">
              {listing.images.length} photos
            </span>
          )}
        </div>
        <div className="p-5">
          {zip && listing.zip === zip && (
            <span className="mb-2 inline-block rounded bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800">
              In your ZIP code
            </span>
          )}
          <h2 className="text-lg font-bold text-gray-900">{listing.title}</h2>
          <div className="mt-2">
            <ApartmentRating rating={listing.adminRating} />
          </div>
          <p className="mt-1 text-sm text-gray-600">
            {listing.address}, {listing.city} {listing.zip}
          </p>
          <p className="mt-3 text-2xl font-bold text-[#1e5a3a]">
            ${listing.price.toLocaleString()}
            <span className="text-sm font-medium text-gray-600"> / month</span>
          </p>
          <p className="mt-2 text-sm text-gray-600">
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
  );
}

export default async function MatchesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const listings = await getListings();
  const cityOptions = Array.from(new Set(listings.map((l) => l.city))).sort();

  const city = param(params, "city");
  const zip = param(params, "zip");
  const budget = param(params, "budget");
  const bedrooms = param(params, "bedrooms");
  const moveIn = param(params, "moveIn");
  const requestStatus = param(params, "requestStatus");
  const requestWasSent = requestStatus === "sent";
  const emailNotificationFailed =
    requestStatus === "saved-email-not-configured" ||
    requestStatus === "saved-email-failed";
  const cameFromForm = Boolean(zip && moveIn);
  const supabaseConfigured = isSupabaseConfigured();

  const budgetRange = budgetRanges[budget];
  const minBeds = bedroomCounts[bedrooms];
  const hasFilters = Boolean(city || budgetRange || minBeds !== undefined);

  const byZipThenPrice = (a: Listing, b: Listing) => {
    const aZip = zip && a.zip === zip ? 0 : 1;
    const bZip = zip && b.zip === zip ? 0 : 1;
    return aZip - bZip || a.price - b.price;
  };

  const matches = listings
    .filter(
      (l) =>
        (!city || cityName(l.city) === cityName(city)) &&
        (!budgetRange || (l.price >= budgetRange.min && l.price <= budgetRange.max)) &&
        (minBeds === undefined || l.beds >= minBeds),
    )
    .sort(byZipThenPrice);

  // When nothing matches, show everything, with the same state first.
  const alternatives =
    hasFilters && matches.length === 0
      ? [...listings].sort((a, b) => {
          const aState = stateCode(a.city) === stateCode(city) ? 0 : 1;
          const bState = stateCode(b.city) === stateCode(city) ? 0 : 1;
          return aState - bState || a.price - b.price;
        })
      : [];

  const shown = hasFilters ? matches : [...listings].sort(byZipThenPrice);

  return (
    <main className="min-h-screen bg-[#f5f7f5] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="text-sm font-semibold text-[#1e5a3a] hover:underline">
          ← RentBridge home
        </Link>

        <header className="mt-6">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            {hasFilters
              ? `${matches.length} matching ${matches.length === 1 ? "apartment" : "apartments"}`
              : `All available apartments (${listings.length})`}
          </h1>
          {hasFilters && (
            <p className="mt-2 text-gray-600">
              {[city, bedrooms, budget && `${budget} per month`].filter(Boolean).join(" · ")}
            </p>
          )}
        </header>

        {!supabaseConfigured && <ListingSetupNotice />}

        {requestWasSent ? (
          <p role="status" className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-900">
            Thanks! Your request was sent to our agent. They&apos;ll follow up about your preferences.
          </p>
        ) : emailNotificationFailed ? (
          <p role="alert" className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            We are working on your request. We will reach out to you shortly.
          </p>
        ) : cameFromForm ? (
          <p role="status" className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            We couldn&apos;t send your request to the agent, but you can still review the available
            apartments below. Please submit the form again later if you&apos;d like the agent to contact you.
          </p>
        ) : null}

        {/* Filter bar */}
        <form
          method="get"
          className="mt-6 grid gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto_auto]"
        >
          {zip && <input type="hidden" name="zip" value={zip} />}
          {moveIn && <input type="hidden" name="moveIn" value={moveIn} />}

          <select name="city" defaultValue={city} className={field} aria-label="City">
            <option value="">All cities</option>
            {cityOptions.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <select name="budget" defaultValue={budget} className={field} aria-label="Monthly budget">
            <option value="">Any budget</option>
            {Object.keys(budgetRanges).map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>

          <select name="bedrooms" defaultValue={bedrooms} className={field} aria-label="Bedrooms">
            <option value="">Any bedrooms</option>
            {Object.keys(bedroomCounts).map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>

          <button
            type="submit"
            className="rounded-lg bg-[#1e5a3a] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#164a2e]"
          >
            Search
          </button>
          <a
            href="?"
            className="rounded-lg border border-gray-300 px-6 py-2.5 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Clear
          </a>
        </form>

        {/* Results */}
        {shown.length > 0 && (
          <section aria-label="Apartments" className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((l) => (
              <ResultCard key={l.id} listing={l} zip={zip} />
            ))}
          </section>
        )}

        {/* No exact match: show alternatives */}
        {listings.length === 0 ? (
          <section className="mt-8 rounded-xl border border-gray-200 bg-white p-8 text-center">
            <h2 className="text-lg font-bold text-gray-900">No apartments have been published yet</h2>
            <p className="mt-2 text-sm text-gray-600">
              Check back soon. Apartments will appear here when an admin publishes them.
            </p>
          </section>
        ) : hasFilters && matches.length === 0 && (
          <>
            <section className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="text-xl font-bold text-gray-900">No apartments match all your filters</h2>
              <p className="mt-2 text-gray-600">
                Try a different city, a higher budget, or fewer bedrooms. Here are other available
                apartments, starting with ones in the same state.
              </p>
            </section>
            <section aria-label="Other apartments" className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {alternatives.map((l) => (
                <ResultCard key={l.id} listing={l} zip={zip} />
              ))}
            </section>
          </>
        )}

        <div className="mt-10">
          <Link
            href="/#find"
            className="inline-flex rounded-lg bg-[#1e5a3a] px-5 py-3 text-sm font-semibold text-white hover:bg-[#164a2e]"
          >
            Start a new search
          </Link>
        </div>
      </div>
    </main>
  );
}