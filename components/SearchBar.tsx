"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSearch() {
    router.push(`/rent?q=${encodeURIComponent(query)}`);
  }

  return (
    <div className="flex w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-lg">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        placeholder="Enter a city, neighborhood, or ZIP code"
        className="flex-1 px-5 py-4 text-gray-900 outline-none"
      />
      <button
        onClick={handleSearch}
        className="bg-teal-700 px-8 font-semibold text-white hover:bg-teal-800"
      >
        Search
      </button>
    </div>
  );
}