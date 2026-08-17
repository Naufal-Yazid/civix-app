"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileTentangOpen, setMobileTentangOpen] = useState(false);

  // Cek apakah halaman aktif berada di bagian "Tentang"
  const isTentangActive = pathname.startsWith("/tentang");

  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
        {/* Logo Civix.id */}
        <Link href="/" className="text-2xl font-bold text-[#002045] tracking-tight">
          Civix<span className="text-[#006A61]">.id</span>
        </Link>

        {/* --- DESKTOP NAVIGATION --- */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-[#64748B]">
          {/* Beranda */}
          <Link href="/" className={`transition-colors py-2 ${pathname === "/" ? "text-[#002045] font-semibold border-b-2 border-[#002045]" : "hover:text-[#002045]"}`}>
            Beranda
          </Link>

          {/* Dropdown Tentang (Desktop) */}
          <div className={`relative group cursor-pointer flex items-center gap-1.5 transition-colors py-2 ${isTentangActive ? "text-[#002045] font-semibold border-b-2 border-[#002045]" : "hover:text-[#002045]"}`}>
            <Link href="/tentang" className="flex items-center gap-1.5">
              <span>Tentang</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 group-hover:rotate-180 ${isTentangActive ? "text-[#002045]" : "text-[#64748B] group-hover:text-[#002045]"}`} />
            </Link>

            {/* Dropdown Content Desktop */}
            <div className="absolute top-full left-0 w-52 bg-white border border-gray-100 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 py-2 mt-1 z-50">
              <Link href="/tentang" className={`block px-4 py-2.5 text-sm transition-colors ${pathname === "/tentang" ? "bg-[#006A61]/10 text-[#006A61] font-semibold" : "text-[#1E1E1E] hover:bg-[#006A61]/10 hover:text-[#006A61]"}`}>
                Tentang Assessment
              </Link>

              <Link
                href="/tentang/civix-insight"
                className={`block px-4 py-2.5 text-sm transition-colors ${pathname === "/tentang/civix-insight" ? "bg-[#006A61]/10 text-[#006A61] font-semibold" : "text-[#1E1E1E] hover:bg-[#006A61]/10 hover:text-[#006A61]"}`}
              >
                Civix Insight
              </Link>
            </div>
          </div>

          {/* Komunitas */}
          <Link href="/komunitas" className={`transition-colors py-2 ${pathname.startsWith("/komunitas") ? "text-[#002045] font-semibold border-b-2 border-[#002045]" : "hover:text-[#002045]"}`}>
            Komunitas
          </Link>

          {/* Hubungi Kami */}
          <Link href="/kontak" className={`transition-colors py-2 ${pathname.startsWith("/kontak") ? "text-[#002045] font-semibold border-b-2 border-[#002045]" : "hover:text-[#002045]"}`}>
            Hubungi Kami
          </Link>
        </nav>

        {/* Tombol CTA Desktop */}
        <div className="hidden md:block">
          <Link href="/assessment" className="px-7 py-3 bg-[#002045] text-white text-sm font-medium rounded-[8px] hover:bg-[#001833] transition-colors shadow-sm">
            Mulai Assessment
          </Link>
        </div>

        {/* --- HAMBURGER BUTTON (Mobile) --- */}
        <div className="flex md:hidden items-center space-x-3">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-xl text-[#002045] hover:bg-gray-100 transition-colors focus:outline-none" aria-label="Toggle Navigation Menu">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* --- MOBILE MENU DRAWER (ABSOLUTE / NIMPA HERO) --- */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 px-6 py-6 space-y-4 shadow-2xl z-50 md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3 text-sm font-medium text-[#64748B]">
            {/* Beranda */}
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className={`py-2 px-3 rounded-xl transition-colors ${pathname === "/" ? "bg-[#002045]/5 text-[#002045] font-semibold" : "hover:bg-gray-50 text-[#1E1E1E]"}`}>
              Beranda
            </Link>

            {/* Accordion Tentang (Mobile) */}
            <div>
              <button
                onClick={() => setMobileTentangOpen(!mobileTentangOpen)}
                className={`w-full flex items-center justify-between py-2 px-3 rounded-xl transition-colors ${isTentangActive ? "bg-[#002045]/5 text-[#002045] font-semibold" : "hover:bg-gray-50 text-[#1E1E1E]"}`}
              >
                <span>Tentang</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileTentangOpen ? "rotate-180 text-[#002045]" : "text-[#64748B]"}`} />
              </button>

              {/* Submenu Mobile */}
              {mobileTentangOpen && (
                <div className="pl-4 mt-1 space-y-1 border-l-2 border-[#006A61]/20 ml-3">
                  <Link
                    href="/tentang"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-2 px-3 rounded-lg text-xs font-medium ${pathname === "/tentang" ? "bg-[#006A61]/10 text-[#006A61] font-semibold" : "text-[#64748B] hover:bg-gray-50"}`}
                  >
                    Tentang Assessment
                  </Link>
                  <Link
                    href="/tentang/civix-insight"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-2 px-3 rounded-lg text-xs font-medium ${pathname === "/tentang/civix-insight" ? "bg-[#006A61]/10 text-[#006A61] font-semibold" : "text-[#64748B] hover:bg-gray-50"}`}
                  >
                    Civix Insight
                  </Link>
                </div>
              )}
            </div>

            {/* Komunitas */}
            <Link
              href="/komunitas"
              onClick={() => setMobileMenuOpen(false)}
              className={`py-2 px-3 rounded-xl transition-colors ${pathname.startsWith("/komunitas") ? "bg-[#002045]/5 text-[#002045] font-semibold" : "hover:bg-gray-50 text-[#1E1E1E]"}`}
            >
              Komunitas
            </Link>

            {/* Hubungi Kami */}
            <Link
              href="/kontak"
              onClick={() => setMobileMenuOpen(false)}
              className={`py-2 px-3 rounded-xl transition-colors ${pathname.startsWith("/kontak") ? "bg-[#002045]/5 text-[#002045] font-semibold" : "hover:bg-gray-50 text-[#1E1E1E]"}`}
            >
              Hubungi Kami
            </Link>
          </nav>

          {/* Tombol CTA Mobile */}
          <div className="pt-2">
            <Link href="/assessment" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center py-3 bg-[#002045] text-white text-sm font-medium rounded-xl hover:bg-[#001833] transition-colors shadow-sm">
              Mulai Assessment
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
