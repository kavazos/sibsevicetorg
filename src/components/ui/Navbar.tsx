"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#services", label: "Услуги" },
  { href: "#about", label: "О компании" },
  { href: "#how", label: "Как мы работаем" },
  { href: "#trust", label: "Документы" },
];

export default function Navbar() {
  const router = useRouter();
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [menuWidth, setMenuWidth] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<string>("services");
  const [user, setUser] = useState<{ name?: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest("[data-profile-menu]")) {
        setProfileOpen(false);
      }
    };
    
    if (profileOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    
    return () => document.removeEventListener("click", handleClickOutside);
  }, [profileOpen]);

  useEffect(() => {
    if (profileButtonRef.current && profileOpen) {
      const width = profileButtonRef.current.getBoundingClientRect().width;
      setMenuWidth(width + 35);
    }
  }, [profileOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  useEffect(() => {
    const sectionIds = navLinks.map((link) => link.href.slice(1));
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];

        if (visibleEntry) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      {
        threshold: [0.35, 0.6],
        rootMargin: "-40% 0px -50% 0px",
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-sm border-b border-slate-200 py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-md">
            <Image src="/sibservistorg-logo.svg" alt="Сибсервисторг" width={28} height={28} className="object-contain" />
          </div>
          <span className="text-sm font-semibold tracking-[0.12em] text-slate-900 uppercase">Сибсервисторг</span>
        </Link>

        <nav className="hidden md:flex flex-1 justify-center items-center gap-8">
          {navLinks.map((link) => {
            const sectionId = link.href.slice(1);
            const isActive = activeSection === sectionId;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm tracking-[0.04em] transition-colors duration-200",
                  isActive
                    ? "text-slate-900 font-semibold"
                    : "text-slate-500 hover:text-slate-900"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-3 relative">
          {!loading && user ? (
            <>
              <div className="relative" data-profile-menu>
                <button
                  ref={profileButtonRef}
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="text-sm text-slate-600 hover:text-slate-900 transition-colors duration-200 font-medium whitespace-nowrap"
                >
                  Привет, {user.name || user.email}
                </button>
                {profileOpen && (
                  <div
                    className="absolute left-1/2 -translate-x-1/2 mt-2 bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden z-10"
                    style={{ width: menuWidth ? `${menuWidth}px` : "auto" }}
                  >
                    <Link
                      href="/account"
                      className="block px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors duration-200"
                      onClick={() => setProfileOpen(false)}
                    >
                      Мой профиль
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setProfileOpen(false);
                      }}
                      className="block w-full text-left px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors duration-200 border-t border-slate-200 cursor-pointer"
                    >
                      Выход
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-sm text-slate-600 hover:text-slate-900 transition-colors duration-200 font-medium"
              >
                Войти
              </Link>
              <Link
                href="/auth/register"
                className="text-sm rounded-full border border-slate-200 px-4 py-2 text-slate-700 hover:border-slate-300 hover:text-slate-900 transition-colors duration-200"
              >
                Регистрация
              </Link>
            </>
          )}
          <Link
            href="#contact"
            className="text-sm bg-accent text-white px-6 py-3 rounded-full shadow-lg shadow-accent/20 hover:bg-accent-dark transition-colors duration-200 font-semibold tracking-[0.08em]"
          >
            Обсудить проект
          </Link>
        </div>

        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen(!open)}
          aria-label="Меню"
        >
          <span className={cn("block w-6 h-px bg-slate-900 transition-transform duration-200", open && "rotate-45 translate-y-2")} />
          <span className={cn("block w-6 h-px bg-slate-900 transition-opacity duration-200", open && "opacity-0")} />
          <span className={cn("block w-6 h-px bg-slate-900 transition-transform duration-200", open && "-rotate-45 -translate-y-2")} />
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-slate-200 px-6 py-6 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-base text-slate-600 hover:text-slate-900"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {!loading && user ? (
            <div className="space-y-2 border-t border-slate-200 pt-4">
              <Link
                href="/account"
                className="block text-base text-slate-600 hover:text-slate-900"
                onClick={() => setOpen(false)}
              >
                Привет, {user.name || user.email}
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setOpen(false);
                }}
                className="block w-full text-left text-base text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Выход
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="block text-base text-slate-600 hover:text-slate-900"
                onClick={() => setOpen(false)}
              >
                Войти
              </Link>
              <Link
                href="/auth/register"
                className="block rounded-full border border-slate-200 px-6 py-3 text-center text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors duration-200"
                onClick={() => setOpen(false)}
              >
                Регистрация
              </Link>
            </>
          )}
          <Link
            href="#contact"
            className="block rounded-full bg-accent px-6 py-3 text-center text-sm font-semibold text-white hover:bg-accent-dark transition-colors duration-200"
            onClick={() => setOpen(false)}
          >
            Обсудить проект
          </Link>
        </div>
      )}
    </header>
  );
}
