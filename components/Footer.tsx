import Logo from "./Logo";

const links = ["Home", "Find an Apartment", "How It Works", "About Us", "FAQ", "Contact"];
const socials = ["f", "ig", "in"];

export default function Footer() {
  return (
    <footer id="contact" className="bg-[#14301f] px-6 py-8 text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 lg:flex-row">
        <Logo light />
        <ul className="flex flex-wrap justify-center gap-6 text-xs">
          {links.map((l) => (
            <li key={l}><a href="#top" className="hover:text-[#67d36e]">{l}</a></li>
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
        <p>Privacy Policy &nbsp;|&nbsp; Terms &amp; Conditions</p>
      </div>
    </footer>
  );
}