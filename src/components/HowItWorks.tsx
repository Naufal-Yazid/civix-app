import React from "react";
import { ClipboardList, FileEdit, Trophy } from "lucide-react";

const steps = [
  {
    number: "1",
    title: "Mulai",
    description: "Pahami instruksi dan tujuan assessment secara menyeluruh.",
    icon: ClipboardList,
  },
  {
    number: "2",
    title: "Isi",
    description: "Jawab serangkaian pertanyaan reflektif sejujur mungkin.",
    icon: FileEdit,
  },
  {
    number: "3",
    title: "Hasil",
    description: "Dapatkan level kompetensi dan statistik perbandingan Anda.",
    icon: Trophy,
  },
];

export default function HowItWorks() {
  return (
    <section className="w-full bg-white py-30 px-6 lg:px-30 border-t border-gray-50">
      <div className="max-w-7xl mx-auto text-center space-y-12">
        {/* Header Judul & Deskripsi */}
        <div className="space-y-3">
          <h2 className="text-[32px] sm:text-[32px] font-bold text-[#002045] tracking-tight">Cara Kerja</h2>
          <p className="text-gray-500 text-base max-w-xl mx-auto leading-relaxed">Ikuti langkah-langkah sederhana ini untuk memulai perjalanan pengembangan kompetensi profesional Anda secara mandiri.</p>
        </div>

        {/* Container Kartu & Garis Penghubung */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 items-start pt-6">
          {/* Garis Lengkung Putus-Putus (Hanya muncul di tampilan Tablet/Desktop) */}
          <div className="hidden md:block absolute top-16 left-[15%] right-[15%] -z-0 pointer-events-none">
            <svg className="w-full h-12" fill="none" viewBox="0 0 500 50" preserveAspectRatio="none">
              <path d="M 0,25 Q 125,50 250,25 T 500,25" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="6 6" />
            </svg>
          </div>

          {/* List 3 Langkah */}
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="relative z-10 flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center text-[#006A61] hover:border-[#006A61] transition-colors duration-200">
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-[#002045]">
                  {step.number}. {step.title}
                </h3>
                <p className="text-gray-500 text-sm max-w-xs leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
