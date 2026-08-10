import React from "react";
import { LayoutGrid, ClipboardCheck, TrendingUp } from "lucide-react";

const features = [
  {
    icon: LayoutGrid,
    title: "10 Dimensi RIPP",
    description: "Pemetaan menyeluruh mulai dari penguasaan materi hingga pedagogi digital pengajar.",
  },
  {
    icon: ClipboardCheck,
    title: "50 Item Instrumen",
    description: "Pernyataan kuesioner terukur untuk memvalidasi kapasitas riil di ruang kelas.",
  },
  {
    icon: TrendingUp,
    title: "5 Level Professional",
    description: "Klasifikasi tingkat kemahiran mengajar untuk arah pengembangan diri yang jelas.",
  },
];

export default function EcosystemSection() {
  return (
    <section className="w-full bg-white py-30 px-6 lg:px-12 border-t border-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-14">
          <div className="lg:col-span-5">
            <h2 className="text-3xl sm:text-[32px] font-bold text-[#002045] leading-tight tracking-tight">
              Ekosistem Pengembangan <br />
              <span className="text-[#006A61]">Professional Guru PPKn</span>
            </h2>
          </div>
          <div className="lg:col-span-7">
            <p className="text-[#1E1E1E] text-[16px] text-justify leading-relaxed">
              Civix hadir sebagai instrumen refleksi kritis bagi pendidik Pendidikan Pancasila dan Kewarganegaraan (PPKN). Kami percaya bahwa guru yang hebat adalah mereka yang terus memetakan kemampuannya. Melalui platform ini, Anda dapat
              memetakan kompetensi di 10 dimensi esensial yang dirancang khusus oleh pakar pendidikan untuk menjawab tantangan demokrasi digital dan kewarganegaraan global.
            </p>
          </div>
        </div>

        {/* 3 Grid Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col items-start space-y-1">
                <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-[#006A61]">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-[18px] font-bold text-[#0B2545]">{item.title}</h3>
                <p className="text-gray-500 text-[14px] leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
