import Link from "next/link";
import InformationalPage from "@/components/InformationalPage";

const sections = [
  {
    title: "Using RentBridge",
    text: "You may use RentBridge to browse apartment information and submit a request for help finding rental opportunities. Provide accurate information and use the site only for lawful purposes.",
  },
  {
    title: "Listings and availability",
    text: "Listing information is provided to help you explore options and may change or become unavailable. Confirm rent, fees, availability, eligibility requirements, property details, and lease terms directly with the property manager or landlord before making a decision.",
  },
  {
    title: "No lease or guarantee",
    text: "Submitting a request does not reserve an apartment, guarantee a response, or create a lease, agency relationship, or other agreement with a property owner. Any rental agreement is between you and the relevant property provider.",
  },
  {
    title: "Third-party services and links",
    text: "The site may rely on third-party service providers or link to external sites. Their services and content are governed by their own terms and policies.",
  },
  {
    title: "Changes and availability",
    text: "We may update, change, or discontinue parts of the site. We may also revise these terms as the service evolves. Continued use after an update means you are using the current version of the site.",
  },
];

export default function TermsPage() {
  return (
    <InformationalPage
      title="Terms of service"
      intro="These terms describe the basic conditions for using RentBridge and its apartment search features."
    >
      <p className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
        This is a general draft, not legal advice. Have it reviewed and adapted to your business,
        operations, and applicable law before relying on it.
      </p>
      <div className="space-y-4">
        {sections.map((section) => (
          <section key={section.title} className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-bold text-gray-900">{section.title}</h2>
            <p className="mt-2 leading-relaxed text-gray-600">{section.text}</p>
          </section>
        ))}
      </div>
      <p className="mt-6 text-sm text-gray-600">
        Questions? Visit the <Link className="font-semibold text-[#1e5a3a] underline" href="/contact">Contact page</Link>.
      </p>
    </InformationalPage>
  );
}
