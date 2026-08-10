import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative w-full bg-white pt-25 pb-30 overflow-hidden">
      {/* Container utama persis sama dengan section di bawahnya */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Kolom Kiri: Copywriting (Rata Kiri Sempurna) */}
          <div className="lg:col-span-6 flex flex-col items-start space-y-6 z-10">
            <h1 className="text-4xl sm:text-5xl leading-[60px] tracking-[-1.12px] font-bold text-[#002045]">
              Evaluasi & Tingkatkan Kompetensi
              <span className="text-[#006A61]"> Mengajar</span>
              <span className="text-[#006A61]"> PPKn Anda di Sini</span>
            </h1>

            <p className="text-[#64748B] text-[16px] leading-relaxed max-w-xl">Platform diagnostik mandiri untuk pengajar PPKn. Isi kuesioner tanpa login dan temukan gambaran level kompetensi serta peta kekuatan mengajar Anda sekarang.</p>

            <div className="flex flex-wrap gap-4 pt-2 w-full sm:w-auto">
              <Link href="/assessment" className="inline-flex items-center justify-center px-6 py-3.5 bg-[#002045] text-white font-semibold text-sm rounded-xl hover:bg-[#133763] transition-all duration-200 shadow-md gap-2">
                Mulai Assessment Sekarang
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link href="#tentang" className="inline-flex items-center justify-center px-6 py-3.5 border border-gray-200 text-[#0B2545] font-semibold text-sm rounded-xl hover:bg-gray-50 transition-colors">
                Pelajari Selengkapnya
              </Link>
            </div>
          </div>

          {/* Kolom Kanan: Double Mockup (Dibuat Melebar Mentok ke Kanan) */}
          <div className="lg:col-span-6 relative w-full flex justify-end items-center mt-8 lg:mt-0">
            <div className="relative w-full aspect-[4/3] flex items-center justify-end">
              {/* 1. Mockup Web (Latar Belakang) */}
              <div className="absolute top-0 right-12 w-[88%] shadow-xl rounded-2xl overflow-hidden border border-gray-100/80">
                <Image src="/images/mockup-web.png" alt="Civix.id Web Assessment Preview" width={800} height={600} className="w-full h-auto object-contain" priority />
              </div>

              {/* 2. Mockup iPhone (Sangat Besar & Berada di Ujung Kanan) */}
              <div className="absolute -bottom-20 -right-30 w-[67%] sm:w-[62%] drop-shadow-[0_30px_40px_rgba(0,0,0,0.3)] z-20">
                <Image src="/images/mockup-phone.png" alt="Civix.id Mobile Assessment Preview" width={600} height={1200} className="w-full h-auto object-contain" priority />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
