"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/books", label: "The Books" },
  { href: "/articles", label: "Articles" },
  { href: "/get-help", label: "Get Help" },
  { href: "/contact", label: "Contact Us" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "nav-scrolled" : "bg-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link
              href="/"
              className="font-playfair text-xl lg:text-2xl text-[#2D2A27] hover:text-[#C4775A] transition-colors duration-200 flex-shrink-0"
            >
              Universally <em>Us</em>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium tracking-wide transition-colors duration-200 relative group ${
                    pathname === link.href
                      ? "text-[#C4775A]"
                      : "text-[#4A4540] hover:text-[#C4775A]"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-px bg-[#C4775A] transition-all duration-200 ${
                      pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              ))}
            </div>

            {/* Desktop auth */}
            <div className="hidden lg:flex items-center gap-4">
              {status === "loading" ? (
                <div className="w-16 h-4 bg-[#EEE0CC] rounded animate-pulse" />
              ) : isLoggedIn ? (
                <>
                  <Link
                    href="/profile"
                    className="text-sm text-[#7A7470] hover:text-[#C4775A] transition-colors truncate max-w-[140px]"
                  >
                    {session.user?.name ?? session.user?.email}
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="text-sm font-medium text-[#4A4540] hover:text-[#C4775A] transition-colors"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm font-medium text-[#4A4540] hover:text-[#C4775A] transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link href="/register" className="btn-primary text-xs px-5 py-2">
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 text-[#2D2A27] hover:text-[#C4775A] transition-colors"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <div className="w-6 flex flex-col gap-1.5">
                <span className={`block h-px bg-current transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
                <span className={`block h-px bg-current transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
                <span className={`block h-px bg-current transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
              </div>
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            menuOpen ? "max-h-screen" : "max-h-0"
          }`}
        >
          <div className="bg-[#FAF5EE] border-t border-[#EEE0CC] px-4 py-6 space-y-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block text-sm font-medium py-1.5 transition-colors duration-200 ${
                  pathname === link.href ? "text-[#C4775A]" : "text-[#4A4540] hover:text-[#C4775A]"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-[#EEE0CC]">
              {isLoggedIn ? (
                <div className="flex flex-col gap-3">
                  <Link
                    href="/profile"
                    className="text-sm text-[#7A7470] hover:text-[#C4775A] transition-colors"
                  >
                    {session?.user?.name ?? session?.user?.email}
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="text-sm font-medium text-[#C4775A] hover:text-[#A85E45] transition-colors text-left"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <div className="flex gap-4">
                  <Link href="/login" className="text-sm font-medium text-[#C4775A] hover:text-[#A85E45] transition-colors">
                    Sign In
                  </Link>
                  <Link href="/register" className="text-sm font-medium text-[#C4775A] hover:text-[#A85E45] transition-colors">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="h-16 lg:h-20" />
    </>
  );
}
