import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

let client: SupabaseClient<Database> | null = null;

function isValidSupabaseUrl(url: string) {
  if (!url) return false;

  const normalized = url.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
  return (
    /^https:\/\/[^\s/]+\.supabase\.co$/i.test(normalized) ||
    /^http:\/\/localhost:\d+$/i.test(normalized) ||
    /^http:\/\/127\.0\.0\.1:\d+$/i.test(normalized)
  );
}

export function hasSupabaseConfig() {
  const configuredUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!configuredUrl || !anonKey) return false;

  const normalizedUrl = configuredUrl
    .replace(/\/rest\/v1\/?$/, "")
    .replace(/\/+$/, "");
  return (
    isValidSupabaseUrl(normalizedUrl) &&
    !normalizedUrl.includes("your-project") &&
    !anonKey.includes("your-supabase-anon-key") &&
    !anonKey.includes("replace-with-your-anon-key")
  );
}

export function getSupabaseClient() {
  const configuredUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!configuredUrl || !anonKey) return null;

  const normalizedUrl = configuredUrl
    .replace(/\/rest\/v1\/?$/, "")
    .replace(/\/+$/, "");

  if (!hasSupabaseConfig()) {
    console.warn(
      "Supabase settings are not configured correctly. Use your actual project URL and anon key, not placeholders.",
    );
    return null;
  }

  client ??= createClient<Database>(normalizedUrl, anonKey);
  return client;
}