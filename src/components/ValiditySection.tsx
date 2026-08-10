import React from "react";
import Image from "next/image";
import { FileCheck, BarChart3, Target } from "lucide-react";

export default function ValiditySection() {
  return (
    <section className="w-full bg-white py-30 px-6 lg:px-12 border-t border-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest text-gray-400">INSTRUMEN TERSTANDARDISASI</span>
          <h2 className="text-[32px] sm:text-[32px] font-bold text-[#002045] tracking-tight leading-tight">
            Mengapa Hasil Asesmen <br className="hidden sm:inline" />
            CiviX Valid & <span className="text-[#006A61]">Tepercaya?</span>
          </h2>
          <p className="text-gray-500 text-base leading-relaxed pt-1">Dirancang menggunakan metodologi ilmiah dan kerangka kerja akademik untuk memberikan diagnosis kompetensi pengajaran yang akurat dan objektif.</p>
        </div>

        {/* 3 Columns Grid (Layout Asimetris Gambar & Kartu Teks) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* KOLOM 1: Gambar di atas, Kartu Teks di bawah */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="relative w-full h-70 flex items-center justify-center p-4">
              <Image src="/images/validity-illustration-1.png" alt="Instrumen Valid & Ilmiah" width={300} height={220} className="w-full h-full object-contain" />
            </div>
            <div className="bg-white border border-gray-200 rounded-3xl p-8 space-y-1 shadow-sm flex-1 flex flex-col justify-center">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-[#006A61]">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="text-[18px] font-bold text-[#002045]">Instrumen Valid & Ilmiah</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Soal dikembangkan berbasis kerangka akademik RIPP-PPKn resmi untuk menjamin akurasi pemetaan kompetensi pengajar.</p>
            </div>
          </div>

          {/* KOLOM 2: Kartu Panjang Teks di bawah, Gambar di atas */}
          <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm flex flex-col justify-between space-y-6">
            <div className="relative w-full h-70 flex items-center justify-center">
              <Image src="/images/validity-illustration-2.png" alt="Metrik Penilaian Teruji" width={320} height={240} className="w-full h-full object-contain" />
            </div>
            <div className="space-y-1">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-[#006A61]">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-[18px] font-bold text-[#002045]">Metrik Penilaian Teruji</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Menggunakan 4 tingkat evaluasi model Kirkpatrick untuk memastikan hasil diagnosis kompetensi bersifat valid dan terukur.</p>
            </div>
          </div>

          {/* KOLOM 3: Kartu Teks di atas, Gambar di bawah */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="bg-white border border-gray-200 rounded-3xl p-8 space-y-1 shadow-sm flex-1 flex flex-col justify-center">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-[#006A61]">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-[18px] font-bold text-[#002045]">Holistik & Akurat</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Menguji 10 dimensi kompetensi riil secara granular, mencakup penguasaan materi mendalam hingga keterampilan pedagogi.</p>
            </div>
            <div className="relative w-full h-70 flex items-center justify-center p-4">
              <Image src="/images/validity-illustration-3.png" alt="Holistik & Akurat" width={300} height={220} className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
