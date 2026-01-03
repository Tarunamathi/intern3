"use client";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex justify-between items-center px-8 py-4 bg-white shadow-md">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <img src="/images/logo.png" alt="Agri Logo" className="h-10" />
        <span className="font-bold text-xl text-black">AgriValue</span>
      </div>

      {/* Navigation */}
      <nav className="space-x-6">
        <Link href="/designs/about-us-2" className="text-black hover:text-green-600">
          About
        </Link>
        <Link href="/livelihood" className="text-black hover:text-green-600">
          Livelihood
        </Link>
        <Link href="/food-nutrition" className="text-black hover:text-green-600">
          Food & Nutrition
        </Link>
        <Link href="/environment" className="text-black hover:text-green-600">
          Environment protection
        </Link>
        <Link href="/training" className="text-black hover:text-green-600">
          Training
        </Link>
        <Link href="/login" className="text-black hover:text-green-600">
          Login
        </Link>
        <Link href="/contact" className="text-black hover:text-green-600">
          Contact us
        </Link>
      </nav>

      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Search"
          className="border rounded px-2 py-1 text-black placeholder-gray-500"
        />
      </div>
    </header>
  );
}