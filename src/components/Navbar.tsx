"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  // Cek apakah halaman aktif berada di bagian "Tentang"
  const isTentangActive = pathname.startsWith("/tentang");

  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
        {/* Logo Civix.id */}
        <Link href="/" className="text-2xl font-bold text-[#002045] tracking-tight">
          Civix<span className="text-[#006A61]">.id</span>
        </Link>

        {/* Menu Navigasi Tengah */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-[#64748B]">
          {/* Beranda */}
          <Link href="/" className={`transition-colors py-2 ${pathname === "/" ? "text-[#002045] font-semibold border-b-2 border-[#002045]" : "hover:text-[#002045]"}`}>
            Beranda
          </Link>

          {/* Dropdown Tentang */}
          <div className={`relative group cursor-pointer flex items-center gap-1.5 transition-colors py-2 ${isTentangActive ? "text-[#002045] font-semibold border-b-2 border-[#002045]" : "hover:text-[#002045]"}`}>
            <Link href="/tentang" className="flex items-center gap-1.5">
              <span>Tentang</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 group-hover:rotate-180 ${isTentangActive ? "text-[#002045]" : "text-[#64748B] group-hover:text-[#002045]"}`} />
            </Link>

            {/* Dropdown Content */}
            <div className="absolute top-full left-0 w-52 bg-white border border-gray-100 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 py-2 mt-1 z-50">
              {/* Submenu 1: Tentang Assessment */}
              <Link href="/tentang" className={`block px-4 py-2.5 text-sm transition-colors ${pathname === "/tentang" ? "bg-[#006A61]/10 text-[#006A61] font-semibold" : "text-[#1E1E1E] hover:bg-[#006A61]/10 hover:text-[#006A61]"}`}>
                Tentang Assessment
              </Link>

              {/* Submenu 2: Civix Insight */}
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

        {/* Tombol CTA Kanan */}
        <div>
          <Link href="/assessment" className="px-5 py-2.5 bg-[#002045] text-white text-sm font-medium rounded-xl hover:bg-[#001833] transition-colors shadow-sm">
            Mulai Assessment
          </Link>
        </div>
      </div>
    </header>
  );
}
