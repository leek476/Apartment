export default function ListingSetupNotice() {
  return (
    <aside className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      Apartment listings are unavailable until the database is configured. Set
      NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to load apartments published by an admin.
    </aside>
  );
}
