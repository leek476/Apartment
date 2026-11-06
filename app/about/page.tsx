import Link from "next/link";
import { ArrowRight, BadgeCheck, Search, Users } from "lucide-react";
import InformationalPage from "@/components/InformationalPage";

const values = [
  {
    icon: Search,
    title: "A simpler search",
    description:
      "Share your preferred location, budget, bedroom count, and move-in date in one request.",
  },
  {
    icon: Users,
    title: "Local focus",
    description:
      "RentBridge currently focuses on connecting renters with opportunities in Oklahoma and Texas.",
  },
  {
    icon: BadgeCheck,
    title: "Helpful connections",
    description:
      "We aim to connect renters with property managers and landlords whose listings may fit their needs.",
  },
];

export default function AboutPage() {
  return (
    <InformationalPage
      title="About us"
      intro="RentBridge helps make the apartment search feel more manageable by bringing your preferences and rental opportunities together."
    >
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl font-bold text-gray-900">A bridge to your next home</h2>
        <p className="mt-3 leading-relaxed text-gray-600">
          Finding a place to live can take time. RentBridge gives renters a straightforward way to
          share what they are looking for and explore available apartments. Our service is designed
          to help you discover options; you should always confirm availability, fees, lease terms,
          and property details directly with the property manager or landlord.
        </p>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {values.map(({ icon: Icon, title, description }) => (
          <article key={title} className="rounded-xl border border-gray-200 bg-white p-5">
            <Icon size={28} className="text-[#1e5a3a]" aria-hidden />
            <h2 className="mt-4 font-bold text-gray-900">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">{description}</p>
          </article>
        ))}
      </section>

      <Link
        href="/#find"
        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#1e5a3a] px-5 py-3 text-sm font-semibold text-white hover:bg-[#164a2e]"
      >
        Start your search <ArrowRight size={16} />
      </Link>
    </InformationalPage>
  );
}
