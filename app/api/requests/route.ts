import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";

const cities = [
  "Oklahoma City, OK", "Tulsa, OK", "Norman, OK", "Edmond, OK", "Lawton, OK",
  "Dallas, TX", "Houston, TX", "Austin, TX", "San Antonio, TX", "Fort Worth, TX",
];
const budgets = ["Under $1,000", "$1,000 – $1,500", "$1,500 – $2,000", "$2,000 – $3,000", "$3,000+"];
const bedroomOptions = ["Studio", "1 Bedroom", "2 Bedrooms", "3 Bedrooms", "4+ Bedrooms"];

function isString(value: unknown): value is string {
  return typeof value === "string";
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Please submit a valid apartment request." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Please submit a valid apartment request." }, { status: 400 });
  }

  const fields = body as Record<string, unknown>;
  const { name, email, phone, city, zip, budget, bedrooms, moveIn, consent } = fields;

  if (
    !isString(name) || !name.trim() || name.length > 100 ||
    !isString(email) || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !isString(phone) || phone.trim().length < 7 || phone.length > 30 ||
    !isString(city) || !cities.includes(city) ||
    !isString(zip) || !/^\d{5}(?:-\d{4})?$/.test(zip) ||
    !isString(budget) || !budgets.includes(budget) ||
    !isString(bedrooms) || !bedroomOptions.includes(bedrooms) ||
    !isString(moveIn) || !/^\d{4}-\d{2}-\d{2}$/.test(moveIn) ||
    consent !== "yes"
  ) {
    return NextResponse.json({ error: "Please check your details and try again." }, { status: 400 });
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    console.error("Apartment request database is not configured.");
    return NextResponse.json(
      { code: "DATABASE_NOT_CONFIGURED", error: "Request submission is not configured." },
      { status: 503 },
    );
  }

  const normalizedRequest = {
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    city,
    zip,
    budget,
    bedrooms,
    move_in: moveIn,
    consent: true,
  };
  const { error: insertError } = await supabase
    .from("apartment_requests")
    .insert(normalizedRequest);

  if (insertError) {
    if (insertError.code === "PGRST205" || insertError.code === "42P01") {
      console.error("Could not save apartment request: the apartment_requests table is missing.");
      return NextResponse.json(
        {
          code: "REQUEST_TABLE_NOT_CONFIGURED",
          error: "Request storage is not set up yet. Please contact the site administrator.",
        },
        { status: 503 },
      );
    }

    console.error(
      `Could not save apartment request (${insertError.code ?? "unknown"}): ${insertError.message}`,
    );
    return NextResponse.json(
      { code: "REQUEST_NOT_SAVED", error: "We couldn’t save your request. Please try again." },
      { status: 502 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !adminEmail || !fromEmail) {
    console.error("Apartment request email is not configured. Set RESEND_API_KEY, ADMIN_EMAIL, and RESEND_FROM_EMAIL.");
    return NextResponse.json(
      { ok: true, emailSent: false, code: "EMAIL_NOT_CONFIGURED" },
      { status: 202 },
    );
  }

  const message = [
    "New apartment search request",
    "",
    `Name: ${normalizedRequest.name}`,
    `Email: ${normalizedRequest.email}`,
    `Phone: ${normalizedRequest.phone}`,
    `Preferred city: ${city}`,
    `ZIP code: ${zip}`,
    `Monthly budget: ${budget}`,
    `Bedrooms: ${bedrooms}`,
    `Desired move-in date: ${moveIn}`,
  ].join("\n");

  let emailResponse: Response;
  try {
    emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [adminEmail],
        reply_to: normalizedRequest.email,
        subject: `Apartment search request: ${normalizedRequest.name}`,
        text: message,
      }),
    });
  } catch (error) {
    console.error("Could not deliver apartment request notification:", error);
    return NextResponse.json(
      { ok: true, emailSent: false, code: "EMAIL_FAILED" },
      { status: 202 },
    );
  }

  if (!emailResponse.ok) {
    console.error(`Resend failed to deliver apartment request (HTTP ${emailResponse.status}).`);
    return NextResponse.json(
      { ok: true, emailSent: false, code: "EMAIL_FAILED" },
      { status: 202 },
    );
  }

  return NextResponse.json({ ok: true, emailSent: true });
}
