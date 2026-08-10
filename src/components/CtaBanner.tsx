import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CtaBanner() {
  return (
    <section className="relative w-full min-h-[380px] flex items-center justify-center bg-[#0D9488] text-white overflow-hidden py-30 px-6">
      {/* Background Overlay Image Perpustakaan */}
      <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-25 -z-0" style={{ backgroundImage: "url('/images/CTA Banner.png')" }} />

      <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center space-y-6">
        <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-bold leading-tight tracking-tight">Siap Mengetahui Level Kompetensi Anda?</h2>

        <p className="text-teal-50 text-base sm:text-lg max-w-2xl leading-relaxed">Hanya butuh 15 menit untuk mendapatkan wawasan yang akan mengubah cara Anda mengajar. Tanpa biaya, tanpa login.</p>

        <Link href="/assessment" className="inline-flex items-center justify-center px-6 py-3.5 bg-white text-[#002045] font-semibold text-sm rounded-xl transition-all duration-200 shadow-md gap-2">
          Mulai Sekarang
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
