import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#002045] text-white pt-16 pb-12 px-6 lg:px-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12">
          {/* Kolom 1: Brand Info & Deskripsi Singkat */}
          <div className="md:col-span-6 space-y-4">
            <h3 className="text-2xl font-bold tracking-tight">Civix.id</h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">Sistem diagnostik kompetensi guru PPKn berbasis kerangka RIPP-PPKn untuk mendukung transformasi dan pengembangan profesionalisme pendidik civic Indonesia.</p>
          </div>

          {/* Kolom 2: Navigasi Link Cepat */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-sm font-semibold text-gray-200">Link Cepat</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link href="#tentang-kami" className="hover:text-white transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="#panduan-guru" className="hover:text-white transition-colors">
                  Panduan Guru
                </Link>
              </li>
              <li>
                <Link href="#metodologi" className="hover:text-white transition-colors">
                  Metodologi
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Navigasi Bantuan */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-sm font-semibold text-gray-200">Bantuan</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link href="#privasi" className="hover:text-white transition-colors">
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link href="#syarat" className="hover:text-white transition-colors">
                  Syarat & Ketentuan
                </Link>
              </li>
              <li>
                <Link href="#kontak" className="hover:text-white transition-colors">
                  Hubungi Kami
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Garis Pembatas & Hak Cipta */}
        <div className="border-t border-gray-800/80 pt-8 text-center text-xs text-gray-500">© 2026 Civix. All rights reserved.</div>
      </div>
    </footer>
  );
}
