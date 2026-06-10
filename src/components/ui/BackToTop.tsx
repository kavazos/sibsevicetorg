"use client";

import { useEffect, useState } from "react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 360);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      aria-label="Наверх"
      onClick={handleClick}
      className={`fixed z-50 right-6 bottom-6 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform duration-200 transform ${
        visible
          ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
          : "opacity-0 translate-y-6 scale-95 pointer-events-none"
      } bg-dark text-pearl hover:scale-105`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="-mt-0.5">
        <path d="M12 19V6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 12l7-7 7 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}


