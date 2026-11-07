import type { Listing } from "@/data/listings";
import { getSupabaseClient, hasSupabaseConfig } from "./supabase";

export async function getListings(): Promise<Listing[]> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    console.warn("Supabase is not configured; no apartment listings can be loaded.");
    return [];
  }

  const { data, error } = await supabase
    .from("listings")
    .select("id,title,address,city,zip,price,beds,baths,sqft,image,images,pet_friendly,admin_rating")
    .order("created_at", { ascending: false });

  let publishedListings: Listing[];
  if (error?.message.includes("admin_rating")) {
    const { data: legacyData, error: legacyError } = await supabase
      .from("listings")
      .select("id,title,address,city,zip,price,beds,baths,sqft,image,images,pet_friendly")
      .order("created_at", { ascending: false });

    if (legacyError) {
      throw new Error(`Could not load published listings: ${legacyError.message}`);
    }
    if (!legacyData) throw new Error("Could not load published listings: Supabase returned no data.");

    publishedListings = legacyData.map((row) => ({
      id: row.id,
      title: row.title,
      address: row.address,
      city: row.city,
      zip: row.zip,
      price: row.price,
      beds: row.beds,
      baths: Number(row.baths),
      sqft: row.sqft,
      image: row.image,
      images: row.images?.length ? row.images : [row.image],
      petFriendly: row.pet_friendly,
      adminRating: 5,
    }));
  } else {
    if (error) throw new Error(`Could not load published listings: ${error.message}`);
    if (!data) throw new Error("Could not load published listings: Supabase returned no data.");

    publishedListings = data.map((row) => ({
      id: row.id,
      title: row.title,
      address: row.address,
      city: row.city,
      zip: row.zip,
      price: row.price,
      beds: row.beds,
      baths: Number(row.baths),
      sqft: row.sqft,
      image: row.image,
      images: row.images?.length ? row.images : [row.image],
      petFriendly: row.pet_friendly,
      adminRating: row.admin_rating ?? 5,
    }));
  }

  return publishedListings;
}

export async function getListingById(id: string): Promise<Listing | null> {
  const listings = await getListings();
  return listings.find((listing) => listing.id === id) ?? null;
}

export function isSupabaseConfigured(): boolean {
  return hasSupabaseConfig();
}