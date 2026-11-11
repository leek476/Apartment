"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar({ initialQuery = "" }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedQuery = query.trim();
    router.push(trimmedQuery ? `/rent?q=${encodeURIComponent(trimmedQuery)}` : "/rent");
  }

  return (
    <form
      onSubmit={handleSearch}
      role="search"
      className="flex w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-lg"
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter a city, street address, or ZIP code"
        aria-label="Search apartments by city, street address, or ZIP code"
        className="min-w-0 flex-1 px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-inset focus:ring-[#1e5a3a] sm:px-5 sm:py-4"
      />
      <button className="shrink-0 bg-teal-700 px-5 font-semibold text-white hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white sm:px-8">
        Search
      </button>
    </form>
  );
}