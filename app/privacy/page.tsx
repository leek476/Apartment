import Link from "next/link";
import InformationalPage from "@/components/InformationalPage";

const sections = [
  {
    title: "Information you provide",
    text: "When you submit an apartment search request, we receive the contact details and preferences you enter, such as your name, email address, phone number, preferred city, ZIP code, budget, bedroom needs, and desired move-in date.",
  },
  {
    title: "How information is used",
    text: "We use request information to review your preferences and respond to your apartment search. If you ask us to help find a rental, relevant details may be shared with property managers or landlords so they can follow up about opportunities.",
  },
  {
    title: "Service providers",
    text: "We use third-party services to operate the site and process communications, including Supabase to store apartment search requests and listing data, and Resend to email request notifications to our team. Those providers process information as needed to provide their services under their own terms and privacy practices.",
  },
  {
    title: "Choices and questions",
    text: "You can choose not to submit a request. For questions about information you have sent us or to request its removal, contact RentBridge using the Contact page. We may need to retain information where required for legitimate operational or legal reasons.",
  },
  {
    title: "Updates",
    text: "We may revise this notice as the service changes. The version published on this page is the current version, so please review it periodically.",
  },
];

export default function PrivacyPage() {
  return (
    <InformationalPage
      title="Privacy policy"
      intro="This draft explains what information RentBridge receives through apartment search requests and how it is used."
    >
      <p className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
        Before publishing, review this draft against your actual data practices and applicable
        privacy requirements. It is not legal advice.
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
        To contact us, use the <Link className="font-semibold text-[#1e5a3a] underline" href="/contact">Contact page</Link>.
      </p>
    </InformationalPage>
  );
}
