import React from "react";

const levels = [
  {
    title: "Novice Civic Educator",
    description: "Memulai langkah awal dalam memahami konsep dasar kewarganegaraan digital.",
  },
  {
    title: "Advanced Beginner",
    description: "Mulai mengintegrasikan nilai-nilai demokrasi dalam praktik pembelajaran harian.",
  },
  {
    title: "Proficient Educator",
    description: "Mampu merancang inovasi pedagogi yang relevan dengan tantangan global.",
  },
  {
    title: "Expert Mentor",
    description: "Menjadi rujukan bagi rekan sejawat dalam pengembangan kompetensi kewarganegaraan.",
  },
  {
    title: "Expert Civic Leader",
    description: "Pemimpin transformatif yang mendorong perubahan sistemik dalam pendidikan PPKn.",
  },
];

export default function LevelsSection() {
  return (
    <section className="w-full bg-white py-30 px-6 lg:px-12 border-t border-gray-50">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Kolom Kiri: Judul & Sub-judul */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs uppercase tracking-widest text-gray-400">Tingkatan Kemahiran</span>
          <h2 className="text-[32px] sm:text-[32px] font-bold text-[#002045] leading-tight tracking-tight">5 Level Kompetensi</h2>
          <p className="text-gray-500 text-base leading-relaxed pt-2 max-w-md">Identifikasi posisi Anda dalam tangga profesionalisme pendidik PPKn melalui hasil asesmen yang mendalam.</p>
        </div>

        {/* Kolom Kanan: Daftar 5 Level */}
        <div className="lg:col-span-7 space-y-10">
          {levels.map((lvl, idx) => (
            <div key={idx} className="flex items-start space-x-4 pl-2">
              {/* Garis Aksen Teal / Hijau */}
              <div className="w-1 h-12 bg-[#006A61] rounded-full shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="text-[18px] font-bold text-[#002045]">{lvl.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{lvl.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
