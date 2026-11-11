import InformationalPage from "@/components/InformationalPage";
import RequestForm from "@/components/RequestForm";

export default function ContactPage() {
  return (
    <InformationalPage
      title="Contact Rentlattice"
      intro="Tell us what kind of apartment you are looking for. Share your preferences and our team can follow up about rental opportunities."
    >
      <div className="mx-auto max-w-3xl">
        <RequestForm />
        <p className="mt-4 text-center text-sm text-gray-500">
          This form is for apartment search requests. Please don&apos;t include passwords,
          payment details, or other sensitive information.
        </p>
      </div>
    </InformationalPage>
  );
}
