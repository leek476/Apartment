import { listings as sampleListings, type Listing } from "@/data/listings";
import { getSupabaseClient, hasSupabaseConfig } from "./supabase";

export async function getListings(): Promise<Listing[]> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    console.warn("Supabase is not configured; showing sample listings instead of published listings.");
    return sampleListings;
  }

  const { data, error } = await supabase
    .from("listings")
    .select("id,title,address,city,zip,price,beds,baths,sqft,image,images,pet_friendly")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Could not load published listings: ${error.message}`);
  if (!data) throw new Error("Could not load published listings: Supabase returned no data.");

  const publishedListings: Listing[] = data.map((row) => ({
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
  }));

  return [...publishedListings, ...sampleListings];
}

export async function getListingById(id: string): Promise<Listing | null> {
  const listings = await getListings();
  return listings.find((listing) => listing.id === id) ?? null;
}

export function isSupabaseConfigured(): boolean {
  return hasSupabaseConfig();
}