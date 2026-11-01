import { NextResponse } from "next/server";

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

  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !adminEmail || !fromEmail) {
    console.error("Apartment request email is not configured. Set RESEND_API_KEY, ADMIN_EMAIL, and RESEND_FROM_EMAIL.");
    return NextResponse.json(
      { error: "Request submission is temporarily unavailable. Please try again later." },
      { status: 503 },
    );
  }

  const message = [
    "New apartment search request",
    "",
    `Name: ${name.trim()}`,
    `Email: ${email.trim()}`,
    `Phone: ${phone.trim()}`,
    `Preferred city: ${city}`,
    `ZIP code: ${zip}`,
    `Monthly budget: ${budget}`,
    `Bedrooms: ${bedrooms}`,
    `Desired move-in date: ${moveIn}`,
  ].join("\n");

  const emailResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [adminEmail],
      reply_to: email.trim(),
      subject: `Apartment search request: ${name.trim()}`,
      text: message,
    }),
  });

  if (!emailResponse.ok) {
    console.error(`Resend failed to deliver apartment request (HTTP ${emailResponse.status}).`);
    return NextResponse.json(
      { error: "We couldn’t send your request right now. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
