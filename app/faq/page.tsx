import InformationalPage from "@/components/InformationalPage";
import Faq from "@/components/Faq";

export default function FaqPage() {
  return (
    <InformationalPage
      title="Frequently asked questions"
      intro="Learn more about using Rentlattice to explore apartment options."
    >
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <Faq />
      </div>
    </InformationalPage>
  );
}
