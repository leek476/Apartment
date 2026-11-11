export default function Logo({ light = false }: { light?: boolean }) {
  const stroke = light ? "#ffffff" : "#1e5a3a";
  return (
    <div className="flex items-center gap-2">
      <svg width="52" height="46" viewBox="0 0 52 46" fill="none" aria-hidden>
        <path d="M4 24 L26 5 L48 24" stroke={stroke} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11 21 V41 H41 V21" stroke={stroke} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="18" y="22" width="6" height="6" fill={stroke} />
        <rect x="28" y="22" width="6" height="6" fill={stroke} />
        <rect x="18" y="31" width="6" height="6" fill={stroke} />
        <rect x="28" y="31" width="6" height="6" fill={stroke} />
        <path d="M2 44 Q26 36 50 44" stroke="#67d36e" strokeWidth="3" strokeLinecap="round" fill="none" />
      </svg>
      <div className="leading-tight">
        <p className={`text-2xl font-bold ${light ? "text-white" : "text-[#1e5a3a]"}`}>Rentlattice</p>
        <p className={`text-[10px] ${light ? "text-white/80" : "text-gray-600"}`}>Your Next Home Awaits</p>
      </div>
    </div>
  );
}