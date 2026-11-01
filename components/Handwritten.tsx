import { Caveat } from "next/font/google";

const caveat = Caveat({ subsets: ["latin"], weight: ["500", "700"] });

export default function Handwritten({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <p className={`${caveat.className} ${className}`}>{children}</p>;
}