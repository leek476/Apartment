"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";
import Logo from "./Logo";

const links = [
  { label: "Home", href: "/" },
  { label: "Find an Apartment", href: "/rent" },
  { label: "How It Works", href: "/#how" },
  { label: "About Us", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : !href.includes("#") && pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link href="/" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <ul className="hidden items-center gap-8 text-sm font-medium text-gray-800 lg:flex">
          {links.map((l) => (
            <li key={l.label}>
              <Link
                href={l.href}
                className={`pb-1 hover:text-[#1e5a3a] ${
                  isActive(l.href) ? "border-b-2 border-[#1e5a3a] text-[#1e5a3a]" : ""
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <Link
            href="/#find"
            className="hidden items-center gap-2 rounded-lg bg-[#1e5a3a] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#164a2e] sm:flex"
          >
            Get Started <ArrowRight size={16} />
          </Link>

          <button
            onClick={() => setOpen((o) => !o)}
            className="rounded-md p-2 text-gray-800 hover:bg-gray-100 lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-gray-200 bg-white lg:hidden">
          <ul className="mx-auto flex max-w-7xl flex-col px-6 py-2 text-sm font-medium text-gray-800">
            {links.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`block py-3 ${isActive(l.href) ? "text-[#1e5a3a]" : ""}`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="py-3">
              <Link
                href="/#find"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-2 rounded-lg bg-[#1e5a3a] px-5 py-2.5 font-semibold text-white"
              >
                Get Started <ArrowRight size={16} />
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}