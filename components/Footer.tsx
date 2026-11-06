import Link from "next/link";
import Logo from "./Logo";

const links = [
  { label: "Home", href: "/" },
  { label: "Find an Apartment", href: "/dashboard" },
  { label: "How It Works", href: "/#how" },
  { label: "About Us", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];
const socials = ["f", "ig", "in"];

export default function Footer() {
  return (
    <footer id="contact" className="bg-[#14301f] px-6 py-8 text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 lg:flex-row">
        <Logo light />
        <ul className="flex flex-wrap justify-center gap-6 text-xs">
          {links.map(({ label, href }) => (
            <li key={label}>
              <Link href={href} className="hover:text-[#67d36e]">{label}</Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3 text-xs">
          <span>Follow Us</span>
          {socials.map((s) => (
            <a key={s} href="#" aria-label={s} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-xs font-bold hover:bg-white/25">
              {s}
            </a>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-6 flex max-w-7xl flex-col items-center justify-between gap-2 border-t border-white/20 pt-4 text-[11px] text-white/80 sm:flex-row">
        <p>© {new Date().getFullYear()} RentBridge. All rights reserved.</p>
        <p className="flex gap-2">
          <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
          <span aria-hidden>|</span>
          <Link href="/terms" className="hover:text-white">Terms of Service</Link>
        </p>
      </div>
    </footer>
  );
}