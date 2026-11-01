import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="hidden items-center gap-6 text-sm font-medium text-gray-700 md:flex">
          <Link href="/rent" className="hover:text-teal-700">Rent</Link>
          <Link href="/saved" className="hover:text-teal-700">Saved</Link>
          <Link href="/post" className="hover:text-teal-700">List a property</Link>
        </div>

        <Link href="/" className="text-2xl font-bold text-teal-700">
          Homebound
        </Link>

        <div className="flex items-center gap-4 text-sm font-medium">
          <Link href="/login" className="text-gray-700 hover:text-teal-700">Sign in</Link>
          <Link
            href="/signup"
            className="rounded-md bg-teal-700 px-4 py-2 text-white hover:bg-teal-800"
          >
            Sign up
          </Link>
        </div>
      </nav>
    </header>
  );
}