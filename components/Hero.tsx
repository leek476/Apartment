import { BadgeCheck, ShieldCheck, Users } from "lucide-react";
import RequestForm from "./RequestForm";

const perks = [
  { icon: BadgeCheck, title: "No hidden fees", text: "Our service is free to you." },
  { icon: ShieldCheck, title: "Trusted partners", text: "We connect you with verified landlords & property managers." },
  { icon: Users, title: "Local expertise", text: "We know Oklahoma and Texas." },
];

export default function Hero() {
  return (
    <section
      id="find"
      className="relative bg-[#14301f] bg-cover bg-center"
      style={{ backgroundImage: "url('/images/hero.webp')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#0d2416]/90 via-[#0d2416]/60 to-transparent" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 pb-12 pt-12 sm:gap-10 sm:px-6 sm:pb-16 sm:pt-16 lg:grid-cols-[1.1fr_1fr] lg:pb-20 lg:pt-20">
        <div className="text-white">
          <p className="text-[11px] font-semibold tracking-[0.16em] sm:text-xs sm:tracking-[0.2em]">APARTMENT SEARCH ASSISTANCE</p>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">
            A better way to find your <span className="text-[#67d36e]">next apartment.</span>
          </h1>
          <p className="mt-6 max-w-md text-base text-white/90">
            Looking for an apartment in Oklahoma or Texas? Tell us what you&apos;re looking for,
            and we&apos;ll help connect you with rental opportunities that match your needs.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {perks.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#1e5a3a]">
                  <Icon size={22} />
                </div>
                <div>
                  <p className="text-sm font-bold">{title}</p>
                  <p className="text-xs text-white/80">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <RequestForm />
      </div>
    </section>
  );
}