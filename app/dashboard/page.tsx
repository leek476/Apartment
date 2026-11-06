import Link from "next/link";
import ListingSetupNotice from "@/components/ListingSetupNotice";
import { getListings, isSupabaseConfigured } from "@/lib/listings";

export const dynamic = "force-dynamic";

type SearchParams = Record<string, string | string[] | undefined>;

function one(value: string | string[] | undefined): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value[0] ?? "";
  return "";
}

const field =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const city = one(params.city);
  const beds = one(params.beds);
  const maxPrice = Number(one(params.maxPrice)) || Infinity;

  const all = await getListings();
  const supabaseConfigured = isSupabaseConfigured();
  const cities = Array.from(new Set(all.map((l) => l.city))).sort();

  const shown = all.filter(
    (l) =>
      (!city || l.city === city) &&
      (beds === "" || l.beds >= Number(beds)) &&
      l.price <= maxPrice,
  );

  return (
    <main className="min-h-screen bg-[#f5f7f5] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="text-sm font-semibold text-[#1e5a3a] hover:underline">
          ← RentBridge home
        </Link>

        <h1 className="mt-6 text-3xl font-bold text-gray-900">Available apartments</h1>
        <p className="mt-1 text-gray-600">
          {shown.length} of {all.length} {all.length === 1 ? "listing" : "listings"}
        </p>

        {!supabaseConfigured && <ListingSetupNotice />}

        <form
          method="get"
          className="mt-6 grid gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto_auto]"
        >
          <select name="city" defaultValue={city} className={field} aria-label="City">
            <option value="">All cities</option>
            {cities.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <select name="beds" defaultValue={beds} className={field} aria-label="Minimum bedrooms">
            <option value="">Any bedrooms</option>
            <option value="0">Studio+</option>
            <option value="1">1+ bedrooms</option>
            <option value="2">2+ bedrooms</option>
            <option value="3">3+ bedrooms</option>
            <option value="4">4+ bedrooms</option>
          </select>

          <input
            name="maxPrice"
            type="number"
            min="0"
            defaultValue={one(params.maxPrice)}
            placeholder="Max rent per month ($)"
            className={field}
            aria-label="Maximum monthly rent"
          />

          <button className="rounded-lg bg-[#1e5a3a] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#164a2e]">
            Filter
          </button>
          <a
            href="/dashboard"
            className="rounded-lg border border-gray-300 px-6 py-2.5 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Clear
          </a>
        </form>

        {shown.length === 0 ? (
          <section className="mt-8 rounded-xl border border-gray-200 bg-white p-8 text-center">
            <h2 className="text-lg font-bold text-gray-900">
              {all.length === 0
                ? "No apartments have been published yet"
                : "No apartments match these filters"}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {all.length === 0
                ? "Check back soon. New listings appear here as soon as they are published."
                : "Try a different city, more bedrooms, or a higher maximum rent."}
            </p>
          </section>
        ) : (
          <section
            aria-label="Apartments"
            className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {shown.map((l) => (
              <Link
                key={l.id}
                href={`/rent/${l.id}`}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <article>
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={l.image} alt={l.title} className="h-52 w-full object-cover" />
                    {l.images.length > 1 && (
                      <span className="absolute bottom-3 right-3 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white">
                        {l.images.length} photos
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <h2 className="text-lg font-bold text-gray-900">{l.title}</h2>
                    <p className="mt-1 text-sm text-gray-600">
                      {l.address}, {l.city} {l.zip}
                    </p>
                    <p className="mt-3 text-2xl font-bold text-[#1e5a3a]">
                      ${l.price.toLocaleString()}
                      <span className="text-sm font-medium text-gray-600"> / month</span>
                    </p>
                    <p className="mt-2 text-sm text-gray-600">
                      {l.beds === 0 ? "Studio" : `${l.beds} bd`} · {l.baths} ba ·{" "}
                      {l.sqft.toLocaleString()} sqft
                    </p>
                    <p className="mt-2 text-sm text-gray-600">
                      {l.petFriendly ? "Pet friendly" : "No pets"}
                    </p>
                    <span className="mt-4 inline-block text-sm font-semibold text-[#1e5a3a]">
                      View full details →
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}