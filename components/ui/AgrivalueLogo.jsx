"use client";
import React from "react";

export default function AgrivalueLogo() {
  const handleClick = (e) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Go back"
      className="fixed top-4 right-6 z-50 w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden shadow-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:scale-105 transition-transform duration-200"
    >
      <img
        src="/images/agrivaluechain.png"
        alt="AgriValue"
        onError={(e) => {
          // fallback to generic logo if specific agrivaluechain image not present
          try {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/images/logo.png";
          } catch (err) {
            // ignore
          }
        }}
        className="w-full h-full object-cover"
      />
    </button>
  );
}
