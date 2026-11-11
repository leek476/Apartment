import "./globals.css";

export const metadata = {
  title: "Rentlattice | Your Next Home Awaits",
  description:
    "Free apartment search assistance. Tell us what you need and we'll connect you with rentals that match.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}