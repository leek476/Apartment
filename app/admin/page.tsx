"use client";

import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { Star } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase";

type Row = {
  id: string;
  title: string;
  city: string;
  price: number;
  image: string;
  image_path: string | null;
  images: string[] | null;
  image_paths: string[] | null;
  admin_rating: number;
};

const field =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#1e5a3a]";
const label = "mb-1 block text-xs font-semibold text-gray-900";
const maxImageSize = 8 * 1024 * 1024;
const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];

const emptyForm = {
  title: "",
  address: "",
  city: "",
  zip: "",
  price: "",
  beds: "1",
  baths: "1",
  sqft: "",
  petFriendly: false,
  adminRating: 5,
};

export default function AdminPage() {
  const supabase = getSupabaseClient();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingIn, setLoggingIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "success">("error");
  const [form, setForm] = useState(emptyForm);
  const [files, setFiles] = useState<File[]>([]);
  const [fileKey, setFileKey] = useState(0);
  const [saving, setSaving] = useState(false);
  const [addingPhotosId, setAddingPhotosId] = useState<string | null>(null);
  const [savingRatingId, setSavingRatingId] = useState<string | null>(null);
  const [ratingDrafts, setRatingDrafts] = useState<Record<string, number>>({});
  const [ratingColumnAvailable, setRatingColumnAvailable] = useState(true);
  const [rows, setRows] = useState<Row[]>([]);

  const loadRows = useCallback(async () => {
    const client = getSupabaseClient();
    if (!client) {
      throw new Error("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
    }

    const { data, error } = await client
      .from("listings")
      .select("id,title,city,price,image,image_path,images,image_paths,admin_rating")
      .order("created_at", { ascending: false });

    if (error) {
      if (error.message.includes("admin_rating")) {
        const { data: legacyData, error: legacyError } = await client
          .from("listings")
          .select("id,title,city,price,image,image_path,images,image_paths")
          .order("created_at", { ascending: false });

        if (legacyError) throw new Error(`Could not load listings: ${legacyError.message}`);
        setRows((legacyData ?? []).map((row) => ({ ...row, admin_rating: 5 })));
        setRatingColumnAvailable(false);
        return;
      }
      throw new Error(`Could not load listings: ${error.message}`);
    }
    setRatingColumnAvailable(true);
    setRows(data ?? []);
  }, []);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let active = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) {
        setMessage(`Could not check your sign-in: ${error.message}`);
      }
      const currentSession = data.session;
      if (currentSession?.user.app_metadata.role === "admin") {
        setSession(currentSession);
      } else {
        setSession(null);
        if (currentSession) {
          void supabase.auth.signOut().then(({ error: signOutError }) => {
            if (signOutError && active) {
              setMessage(`Could not clear a non-admin session: ${signOutError.message}`);
              setMessageType("error");
            }
          });
        }
      }
      setLoading(false);
    }).catch((error: unknown) => {
      if (!active) return;
      setMessage(error instanceof Error ? error.message : "Could not check your sign-in.");
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (nextSession?.user.app_metadata.role === "admin") {
        setSession(nextSession);
      } else {
        setSession(null);
      }
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (session?.user.app_metadata.role !== "admin") return;
    loadRows().catch((error: unknown) => {
      setMessage(error instanceof Error ? error.message : "Could not load published listings.");
      setMessageType("error");
    });
  }, [session, loadRows]);

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setLoggingIn(true);

    if (!supabase) {
      setMessage("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
      setLoggingIn(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.user.app_metadata.role !== "admin") {
        await supabase.auth.signOut();
        throw new Error(
          "Your password was accepted, but this Supabase account is not an admin. Grant this user's app_metadata.role as admin in Supabase, then sign in again. See supabase/setup.sql for the SQL."
        );
      }
      setSession(data.session);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Sign-in failed. Please try again.");
      setMessageType("error");
    } finally {
      setLoggingIn(false);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    if (!ratingColumnAvailable) {
      setMessage("Run the admin_rating SQL migration shown above before publishing listings with a star rating.");
      setMessageType("error");
      return;
    }
    if (!Number.isInteger(form.adminRating) || form.adminRating < 1 || form.adminRating > 5) {
      setMessage("Choose a star rating from 1 to 5.");
      setMessageType("error");
      return;
    }
    if (files.length === 0) {
      setMessage("Please choose at least one photo.");
      setMessageType("error");
      return;
    }
    if (files.some((file) => !allowedImageTypes.includes(file.type))) {
      setMessage("Choose JPG, PNG, or WebP photos only.");
      setMessageType("error");
      return;
    }
    if (files.some((file) => file.size > maxImageSize)) {
      setMessage("Each photo must be 8 MB or smaller.");
      setMessageType("error");
      return;
    }

    if (!supabase) {
      setMessage("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
      setMessageType("error");
      return;
    }

    setSaving(true);
    const uploadedPaths: string[] = [];

    try {
      const imageUrls: string[] = [];
      for (const file of files) {
        const extension =
          file.type === "image/jpeg" ? "jpg" : file.type === "image/png" ? "png" : "webp";
        const path = `${crypto.randomUUID()}.${extension}`;
        const { error: uploadError } = await supabase.storage
          .from("listing-images")
          .upload(path, file, { contentType: file.type, cacheControl: "3600", upsert: false });

        if (uploadError) throw new Error(`Photo upload failed: ${uploadError.message}`);
        uploadedPaths.push(path);
        imageUrls.push(supabase.storage.from("listing-images").getPublicUrl(path).data.publicUrl);
      }

      const { error: insertError } = await supabase.from("listings").insert({
        title: form.title.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        zip: form.zip.trim(),
        price: Number(form.price),
        beds: Number(form.beds),
        baths: Number(form.baths),
        sqft: Number(form.sqft),
        image: imageUrls[0],
        image_path: uploadedPaths[0],
        images: imageUrls,
        image_paths: uploadedPaths,
        pet_friendly: form.petFriendly,
        admin_rating: form.adminRating,
      });

      if (insertError) throw new Error(`Could not save listing: ${insertError.message}`);

      setMessage("Listing published and is now available to renters.");
      setMessageType("success");
      setForm(emptyForm);
      setFiles([]);
      setFileKey((k) => k + 1);
      try {
        await loadRows();
      } catch (error) {
        setMessage(
          error instanceof Error
            ? `Listing published, but the list could not refresh: ${error.message}`
            : "Listing published, but the list could not refresh.",
        );
        setMessageType("error");
      }
    } catch (error) {
      if (uploadedPaths.length > 0) {
        const { error: cleanupError } = await supabase.storage
          .from("listing-images")
          .remove(uploadedPaths);
        if (cleanupError) {
          console.error("Could not remove uploaded images after listing save failed:", cleanupError);
        }
      }
      setMessage(error instanceof Error ? error.message : "Could not publish listing. Please try again.");
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  }

  async function handleAddPhotos(id: string, selectedFiles: File[]) {
    if (selectedFiles.length === 0) return;
    setMessage("");

    if (selectedFiles.some((file) => !allowedImageTypes.includes(file.type))) {
      setMessage("Choose JPG, PNG, or WebP photos only.");
      setMessageType("error");
      return;
    }

    if (selectedFiles.some((file) => file.size > maxImageSize)) {
      setMessage("Each photo must be 8 MB or smaller.");
      setMessageType("error");
      return;
    }
    if (!supabase) {
      setMessage("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
      setMessageType("error");
      return;
    }

    const row = rows.find((listing) => listing.id === id);
    if (!row) {
      setMessage("Could not find this listing. Refresh the page and try again.");
      setMessageType("error");
      return;
    }

    setAddingPhotosId(id);
    const uploadedPaths: string[] = [];
    try {
      const imageUrls: string[] = [];
      for (const file of selectedFiles) {
        const extension =
          file.type === "image/jpeg" ? "jpg" : file.type === "image/png" ? "png" : "webp";
        const path = `${crypto.randomUUID()}.${extension}`;
        const { error: uploadError } = await supabase.storage
          .from("listing-images")
          .upload(path, file, { contentType: file.type, cacheControl: "3600", upsert: false });

        if (uploadError) throw new Error(`Photo upload failed: ${uploadError.message}`);
        uploadedPaths.push(path);
        imageUrls.push(supabase.storage.from("listing-images").getPublicUrl(path).data.publicUrl);
      }

      const images = [...(row.images?.length ? row.images : [row.image]), ...imageUrls];
      const imagePaths = Array.from(
        new Set([...(row.image_paths ?? []), ...(row.image_path ? [row.image_path] : []), ...uploadedPaths]),
      );
      const { error: updateError } = await supabase
        .from("listings")
        .update({ images, image_paths: imagePaths })
        .eq("id", id);

      if (updateError) throw new Error(`Could not save photos: ${updateError.message}`);

      setRows((current) =>
        current.map((listing) =>
          listing.id === id ? { ...listing, images, image_paths: imagePaths } : listing,
        ),
      );
      setMessage("Photos added to the listing.");
      setMessageType("success");
    } catch (error) {
      if (uploadedPaths.length > 0) {
        const { error: cleanupError } = await supabase.storage
          .from("listing-images")
          .remove(uploadedPaths);
        if (cleanupError) {
          console.error("Could not remove uploaded images after listing update failed:", cleanupError);
        }
      }
      setMessage(error instanceof Error ? error.message : "Could not add photos. Please try again.");
      setMessageType("error");
    } finally {
      setAddingPhotosId(null);
    }
  }

  async function handleSaveRating(id: string) {
    if (!ratingColumnAvailable) {
      setMessage("Run the admin_rating SQL migration shown above before saving star ratings.");
      setMessageType("error");
      return;
    }
    const rating = ratingDrafts[id] ?? rows.find((listing) => listing.id === id)?.admin_rating ?? 0;
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      setMessage("Choose a star rating from 1 to 5.");
      setMessageType("error");
      return;
    }
    if (!supabase) {
      setMessage("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
      setMessageType("error");
      return;
    }

    setSavingRatingId(id);
    setMessage("");
    try {
      const { error } = await supabase.from("listings").update({ admin_rating: rating }).eq("id", id);
      if (error) throw new Error(`Could not save apartment rating: ${error.message}`);

      setRows((current) =>
        current.map((listing) => (listing.id === id ? { ...listing, admin_rating: rating } : listing)),
      );
      setRatingDrafts((current) => ({ ...current, [id]: rating }));
      setMessage("Apartment rating saved.");
      setMessageType("success");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save apartment rating.");
      setMessageType("error");
    } finally {
      setSavingRatingId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this listing?")) return;
    if (!supabase) return;

    setMessage("");
    try {
      const row = rows.find((listing) => listing.id === id);
      const { error } = await supabase.from("listings").delete().eq("id", id);
      if (error) throw new Error(`Could not delete listing: ${error.message}`);

      setRows((current) => current.filter((listing) => listing.id !== id));
      const imagePaths = Array.from(
        new Set([...(row?.image_paths ?? []), ...(row?.image_path ? [row.image_path] : [])]),
      );
      if (imagePaths.length > 0) {
        const { error: storageError } = await supabase.storage.from("listing-images").remove(imagePaths);
        if (storageError) {
          setMessage(`Listing deleted, but its photo could not be removed: ${storageError.message}`);
          setMessageType("error");
          return;
        }
      }
      setMessage("Listing deleted.");
      setMessageType("success");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not delete listing.");
      setMessageType("error");
    }
  }

  async function handleSignOut() {
    if (!supabase) return;
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setSession(null);
    } catch (error) {
      setMessage(`Could not sign out: ${error instanceof Error ? error.message : "Please try again."}`);
      setMessageType("error");
    }
  }

  function update<K extends keyof typeof emptyForm>(key: K, value: (typeof emptyForm)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  if (loading) return <main className="p-10">Loading…</main>;

  if (!supabase) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f7f5] px-4">
        <section role="alert" className="w-full max-w-md rounded-xl bg-white p-6 shadow">
          <h1 className="text-xl font-bold text-gray-900">Admin setup required</h1>
          <p className="mt-2 text-sm text-gray-700">
            Configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, then restart the app.
          </p>
        </section>
      </main>
    );
  }

  if (!session || session.user.app_metadata.role !== "admin") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f7f5] px-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm rounded-xl bg-white p-6 shadow">
          <h1 className="text-xl font-bold text-gray-900">RentBridge admin</h1>
          <p className="mb-4 text-sm text-gray-600">Sign in to manage listings.</p>

          <label htmlFor="admin-email" className={label}>Email</label>
          <input
            id="admin-email"
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={field}
          />

          <label htmlFor="admin-password" className={`${label} mt-3`}>Password</label>
          <input
            id="admin-password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={field}
          />

          <button
            disabled={loggingIn}
            className="mt-5 w-full rounded-lg bg-[#1e5a3a] py-2.5 text-sm font-semibold text-white hover:bg-[#164a2e] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loggingIn ? "Signing in…" : "Sign in"}
          </button>
          {message && <p role="alert" className="mt-3 text-sm text-red-700">{message}</p>}
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f7f5] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Manage listings</h1>
          <button
            onClick={handleSignOut}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-white"
          >
            Sign out
          </button>
        </div>

        {!ratingColumnAvailable && (
          <section
            role="alert"
            className="mt-5 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950"
          >
            <h2 className="font-semibold">Finish the star-rating database setup</h2>
            <p className="mt-1">
              Listings can be viewed, but rating changes and new listings cannot be saved until the
              rating column is added in Supabase SQL Editor.
            </p>
            <pre className="mt-3 overflow-x-auto rounded bg-white p-3 text-xs">
              <code>
                {`alter table public.listings
  add column if not exists admin_rating smallint not null default 5
  check (admin_rating between 1 and 5);
notify pgrst, 'reload schema';`}
              </code>
            </pre>
            <p className="mt-2">After running it, refresh this page.</p>
          </section>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-6 grid gap-4 rounded-xl bg-white p-6 shadow-sm sm:grid-cols-2"
        >
          <h2 className="text-lg font-bold text-gray-900 sm:col-span-2">Add an apartment</h2>

          <div className="sm:col-span-2">
            <label htmlFor="listing-title" className={label}>Title</label>
            <input
              id="listing-title"
              required
              maxLength={120}
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="Bright 2BR in Midtown"
              className={field}
            />
          </div>

          <div>
            <label htmlFor="listing-address" className={label}>Street address</label>
            <input
              id="listing-address"
              required
              maxLength={200}
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
              className={field}
            />
          </div>

          <div>
            <label htmlFor="listing-city" className={label}>City and state</label>
            <input
              id="listing-city"
              required
              maxLength={100}
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
              placeholder="Tulsa, OK"
              className={field}
            />
          </div>

          <div>
            <label htmlFor="listing-zip" className={label}>ZIP code</label>
            <input
              id="listing-zip"
              required
              pattern="\d{5}(?:-\d{4})?"
              maxLength={10}
              value={form.zip}
              onChange={(e) => update("zip", e.target.value)}
              placeholder="74103"
              className={field}
            />
          </div>

          <div>
            <label htmlFor="listing-price" className={label}>Monthly rent ($)</label>
            <input
              id="listing-price"
              required
              type="number"
              min="1"
              max="100000"
              step="1"
              value={form.price}
              onChange={(e) => update("price", e.target.value)}
              className={field}
            />
          </div>

          <div>
            <label htmlFor="listing-beds" className={label}>Bedrooms (0 = studio)</label>
            <input
              id="listing-beds"
              required
              type="number"
              min="0"
              max="20"
              step="1"
              value={form.beds}
              onChange={(e) => update("beds", e.target.value)}
              className={field}
            />
          </div>

          <div>
            <label htmlFor="listing-baths" className={label}>Bathrooms</label>
            <input
              id="listing-baths"
              required
              type="number"
              min="0.5"
              max="20"
              step="0.5"
              value={form.baths}
              onChange={(e) => update("baths", e.target.value)}
              className={field}
            />
          </div>

          <div>
            <label htmlFor="listing-sqft" className={label}>Square feet</label>
            <input
              id="listing-sqft"
              required
              type="number"
              min="1"
              max="100000"
              step="1"
              value={form.sqft}
              onChange={(e) => update("sqft", e.target.value)}
              className={field}
            />
          </div>

          <div>
            <label htmlFor="listing-photo" className={label}>
              Photos (JPG, PNG, or WebP; each up to 8 MB)
            </label>
            <input
              id="listing-photo"
              key={fileKey}
              required
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => {
                setFiles(Array.from(e.target.files ?? []));
                setMessage("");
              }}
              className={field}
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-800 sm:col-span-2">
            <input
              type="checkbox"
              checked={form.petFriendly}
              onChange={(e) => update("petFriendly", e.target.checked)}
            />
            Pet friendly
          </label>

          <div className="sm:col-span-2">
            <span className={label}>Apartment rating</span>
            <div className="flex items-center gap-1" role="radiogroup" aria-label="Apartment rating">
              {Array.from({ length: 5 }, (_, index) => {
                const rating = index + 1;
                return (
                  <button
                    key={rating}
                    type="button"
                    role="radio"
                    aria-checked={form.adminRating === rating}
                    aria-label={`${rating} ${rating === 1 ? "star" : "stars"}`}
                    onClick={() => update("adminRating", rating)}
                    className="rounded p-1 text-amber-500 hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-[#1e5a3a]"
                  >
                    <Star
                      size={24}
                      fill={rating <= form.adminRating ? "currentColor" : "none"}
                      aria-hidden="true"
                    />
                  </button>
                );
              })}
              <span className="ml-2 text-sm text-gray-600">{form.adminRating} out of 5</span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Set the rating renters will see for this apartment.
            </p>
          </div>

          <div className="sm:col-span-2">
            <button
              disabled={saving || !ratingColumnAvailable}
              className="rounded-lg bg-[#1e5a3a] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#164a2e] disabled:opacity-60"
            >
              {saving ? "Publishing…" : "Publish listing"}
            </button>
            {message && (
              <p
                role={messageType === "error" ? "alert" : "status"}
                className={`mt-3 text-sm ${messageType === "error" ? "text-red-700" : "text-green-800"}`}
              >
                {message}
              </p>
            )}
          </div>
        </form>

        <h2 className="mt-10 text-lg font-bold text-gray-900">
          Published listings ({rows.length})
        </h2>
        <ul className="mt-3 divide-y divide-gray-200 rounded-xl bg-white shadow-sm">
          {rows.length === 0 && <li className="p-4 text-sm text-gray-600">No listings yet.</li>}
          {rows.map((r) => (
            <li key={r.id} className="space-y-4 p-4">
              <div className="flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={r.image} alt="" className="h-14 w-20 rounded object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{r.title}</p>
                  <p className="text-xs text-gray-600">
                    {r.city} · ${r.price.toLocaleString()}/mo
                  </p>
                </div>
                <label
                  htmlFor={`more-photos-${r.id}`}
                  className={`cursor-pointer text-sm font-semibold text-[#1e5a3a] hover:underline ${
                    addingPhotosId === r.id ? "pointer-events-none opacity-50" : ""
                  }`}
                >
                  {addingPhotosId === r.id ? "Uploading…" : "Add photos"}
                </label>
                <input
                  id={`more-photos-${r.id}`}
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  disabled={addingPhotosId === r.id}
                  onChange={(e) => {
                    void handleAddPhotos(r.id, Array.from(e.target.files ?? []));
                    e.currentTarget.value = "";
                  }}
                  className="sr-only"
                />
                <button
                  onClick={() => handleDelete(r.id)}
                  className="text-sm font-semibold text-red-700 hover:underline"
                >
                  Delete
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className={label}>Apartment rating</span>
                <div
                  className="flex items-center gap-1"
                  role="radiogroup"
                  aria-label={`Rating for ${r.title}`}
                >
                  {Array.from({ length: 5 }, (_, index) => {
                    const rating = index + 1;
                    const currentRating = ratingDrafts[r.id] ?? r.admin_rating;
                    return (
                      <button
                        key={rating}
                        type="button"
                        role="radio"
                        aria-checked={currentRating === rating}
                        aria-label={`${rating} ${rating === 1 ? "star" : "stars"}`}
                        disabled={!ratingColumnAvailable}
                        onClick={() =>
                          setRatingDrafts((current) => ({ ...current, [r.id]: rating }))
                        }
                        className="rounded p-1 text-amber-500 hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-[#1e5a3a] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Star
                          size={22}
                          fill={rating <= currentRating ? "currentColor" : "none"}
                          aria-hidden="true"
                        />
                      </button>
                    );
                  })}
                </div>
                <button
                  type="button"
                  disabled={savingRatingId === r.id || !ratingColumnAvailable}
                  onClick={() => void handleSaveRating(r.id)}
                  className="rounded-lg bg-[#1e5a3a] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#164a2e] disabled:opacity-60"
                >
                  {savingRatingId === r.id ? "Saving…" : "Save rating"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}