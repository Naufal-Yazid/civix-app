"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Users, GraduationCap, Flame, BookOpen, Globe, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

interface CommunityCard {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
}

const communityData: CommunityCard[] = [
  {
    id: 1,
    title: "Forum Guru PPKN Jawa Barat",
    description: "Wadah komunikasi guru PPKN se-Jawa Barat untuk koordinasi kurikulum daerah.",
    icon: <Users className="w-6 h-6" />,
    link: "#",
  },
  {
    id: 2,
    title: "MGMP PPKN Nasional",
    description: "Musyawarah Guru Mata Pelajaran tingkat nasional untuk berbagi modul ajar terbaru.",
    icon: <GraduationCap className="w-6 h-6" />,
    link: "#",
  },
  {
    id: 3,
    title: "Komunitas Guru Penggerak Civic",
    description: "Grup eksklusif untuk alumni Guru Penggerak yang berfokus pada inovasi kewarganegaraan.",
    icon: <Flame className="w-6 h-6" />,
    link: "#",
  },
  {
    id: 4,
    title: "Literasi Digital PPKN",
    description: "Fokus pada pengembangan konten edukasi digital dan perang terhadap hoax di sekolah.",
    icon: <BookOpen className="w-6 h-6" />,
    link: "#",
  },
  {
    id: 5,
    title: "Literasi Digital PPKN",
    description: "Fokus pada pengembangan konten edukasi digital dan perang terhadap hoax di sekolah.",
    icon: <BookOpen className="w-6 h-6" />,
    link: "#",
  },
  {
    id: 6,
    title: "Guru Global Indonesia",
    description: "Membangun koneksi antara guru PPKN Indonesia dengan rekan pendidik luar negeri.",
    icon: <Globe className="w-6 h-6" />,
    link: "#",
  },
  {
    id: 7,
    title: "Guru Global Indonesia",
    description: "Membangun koneksi antara guru PPKN Indonesia dengan rekan pendidik luar negeri.",
    icon: <Globe className="w-6 h-6" />,
    link: "#",
  },
  {
    id: 8,
    title: "Guru Global Indonesia",
    description: "Membangun koneksi antara guru PPKN Indonesia dengan rekan pendidik luar negeri.",
    icon: <Globe className="w-6 h-6" />,
    link: "#",
  },
  {
    id: 9,
    title: "Civic Creative Lab",
    description: "Eksperimen metode pembelajaran kreatif: Roleplay, Debat, dan Game-based Learning.",
    icon: <Sparkles className="w-6 h-6" />,
    link: "#",
  },
];

export default function KomunitasPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;

  return (
    <main className="min-h-screen bg-white text-[#1E1E1E]">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="pt-25 pb-24 px-6 lg:px-12 text-center max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight mb-6">
          <span className="text-[#002045]">Terhubung dan Bertumbuh </span> <br />
          <span className="text-[#006A61]">Bersama Pendidik PPKn</span>
        </h1>
        <p className="text-[#64748B] text-[16px] leading-relaxed max-w-2xl mx-auto">Temukan ruang kolaborasi, diskusikan inovasi kurikulum, dan bagikan perangkat pembelajaran kreatif bersama ribuan guru di seluruh Indonesia.</p>
      </section>

      {/* 2. COMMUNITY CARDS GRID */}
      <section className="pb-20 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          {/* Grid 3 Kolom x 3 Baris */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {communityData.map((item) => (
              <div key={item.id} className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow duration-200">
                <div className="space-y-4">
                  {/* Container Ikon */}
                  <div className="w-12 h-12 bg-[#006A61]/10 text-[#006A61] rounded-xl flex items-center justify-center shrink-0">{item.icon}</div>

                  {/* Judul & Deskripsi */}
                  <div className="space-y-2">
                    <h3 className="font-bold text-[18px] text-[#002045]">{item.title}</h3>
                    <p className="text-sm text-[#64748B] leading-relaxed">{item.description}</p>
                  </div>
                </div>

                {/* Tombol Gabung */}
                <div className="pt-6">
                  <a href={item.link} className="inline-flex items-center justify-center px-5 py-2 bg-[#002045] text-white text-xs font-semibold rounded-xl hover:bg-[#001833] transition-colors">
                    Gabung
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FOOTER (Tanpa CTA Banner) */}
      <Footer />
    </main>
  );
}
