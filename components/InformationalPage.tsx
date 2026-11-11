import type { ReactNode } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function InformationalPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-[65vh] bg-[#f5f7f5] px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <header className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1e5a3a]">
              Rentlattice
            </p>
            <h1 className="mt-2 text-4xl font-bold text-gray-900">{title}</h1>
            <p className="mt-3 max-w-3xl text-lg leading-relaxed text-gray-600">{intro}</p>
          </header>
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
