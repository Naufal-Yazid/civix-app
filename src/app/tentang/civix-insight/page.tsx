import React from "react";
import Navbar from "@/components/Navbar";
import CtaBanner from "@/components/CtaBanner";
import Footer from "@/components/Footer";
import RadarChartInteractive from "@/components/RadarChartInteractive"; // <--- Import Komponen Baru
import { FileText, Link as LinkIcon, BarChart3, TrendingUp, ShieldCheck, Search, Megaphone, Lock, Globe, Star, Users, Trees, MessageSquare, Scale } from "lucide-react";

export default function CivixInsightPage() {
  return (
    <main className="min-h-screen bg-white text-[#1E1E1E]">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="pt-25 pb-30 px-6 lg:px-12 text-center max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight mb-6">
          <span className="text-[#002045]">Rasionalitas Akademis & </span> <br />
          <span className="text-[#006A61]">Landasan Ilmiah Civix.id</span>
        </h1>
        <p className="text-[#64748B] text-[16px] leading-relaxed max-w-2xl mx-auto">
          Menjelajahi kerangka pikir RIPP-PPKn, rasionalitas 10 dimensi kompetensi, isu etika digital, hingga integrasi nilai Pancasila dalam rekonseptualisasi identitas guru PPKn modern.
        </p>
      </section>

      {/* 10 DIMENSI KOMPETENSI (INTERACTIVE RADAR CHART) */}
      <section className="py-16 px-6 lg:px-12 bg-white border-t border-gray-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Deskripsi Kiri */}
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-3xl font-bold text-[#002045]">10 Dimensi Kompetensi</h2>
            <div className="space-y-4 text-[#64748B] text-[16px] leading-relaxed">
              <p>Setiap dimensi dalam Civix.id saling terhubung untuk memberikan gambaran utuh profil profesional Anda. Mulai dari penguasaan materi substantif hingga kesadaran reflektif dalam pembelajaran.</p>
              <p>Melalui pendekatan terstruktur ini, Anda tidak hanya diukur berdasarkan apa yang Anda ketahui, tetapi juga bagaimana Anda mentransformasikannya di dalam kelas dan ruang digital.</p>
            </div>
          </div>

          {/* Visualisasi Radar Chart Interaktif Kanan */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <RadarChartInteractive />
          </div>
        </div>
      </section>

      {/* 3. ETIKA DIGITAL SECTION */}
      <section className="py-25 px-6 lg:px-12 bg-white border-t border-gray-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-18 items-start">
          {/* Kiri: Title & Subtitle */}
          <div className="lg:col-span-5 space-y-3">
            <h2 className="text-[32px] font-bold text-[#002045]">Etika Digital</h2>
            <p className="text-s text-[#64748B] leading-relaxed">Kerangka kecakapan digital yang membekali pendidik untuk membimbing siswa berinteraksi, berpikir kritis, serta menjaga nilai-nilai kebangsaan di ekosistem digital.</p>
          </div>

          {/* Kanan: Vertikal List Cards */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs flex items-center space-x-4">
              <div className="p-3 bg-[#006A61]/10 text-[#006A61] rounded-xl shrink-0">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-[18px] text-[#002045]">Etika Digital Pancasila</h3>
                <p className="text-[14px] text-[#64748B] mt-0.5">Menerapkan nilai Pancasila sebagai pedoman etika di ruang digital.</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs flex items-center space-x-4">
              <div className="p-3 bg-[#006A61]/10 text-[#006A61] rounded-xl shrink-0">
                <Search className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-[18px] text-[#002045]">Literasi Media & Anti-Hoaks</h3>
                <p className="text-[14px] text-[#64748B] mt-0.5">Kompetensi literasi media, berpikir kritis, dan deteksi disinformasi.</p>
              </div>
            </div>
            <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs flex items-center space-x-4">
              <div className="p-3 bg-[#006A61]/10 text-[#006A61] rounded-xl shrink-0">
                <Megaphone className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-[18px] text-[#002045]">Digital Civic Engagement</h3>
                <p className="text-[14px] text-[#64748B] mt-0.5">Mendorong partisipasi demokratis digital berbasis nilai kewargaan.</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs flex items-center space-x-4">
              <div className="p-3 bg-[#006A61]/10 text-[#006A61] rounded-xl shrink-0">
                <Lock className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-[18px] text-[#002045]">Keamanan & Privasi Digital</h3>
                <p className="text-[14px] text-[#64748B] mt-0.5">Pemahaman keamanan data, privasi, dan perlindungan identitas digital.</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs flex items-center space-x-4">
              <div className="p-3 bg-[#006A61]/10 text-[#006A61] rounded-xl shrink-0">
                <Globe className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-[18px] text-[#002045]">Kewargaan Global-Digital</h3>
                <p className="text-[14px] text-[#64748B] mt-0.5">Pemahaman kewarganegaraan global serta hak dan tanggung jawab digital.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. RESEARCH GAP SECTION */}
      <section className="py-25 px-6 lg:px-12 bg-white border-t border-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-[32px] font-bold text-[#002045]">Research Gap</h2>
            <p className="text-[#64748B] text-sm mt-2 max-w-2xl mx-auto">
              Latar belakang dan kesenjangan literatur yang menjadi urgensi hadirnya Civix.id sebagai platform diagnostik serta pemetaan kompetensi pendidik kewarganegaraan modern.
            </p>
          </div>

          {/* Grid Top 3 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs space-y-3">
              <FileText className="w-6 h-6 text-[#006A61]" />
              <h3 className="font-bold text-[18px] text-[#002045]">Gap Instrumen Pemetaan</h3>
              <p className="text-[14px] text-[#64748B] leading-relaxed">Belum tersedia instrumen tervalidasi yang mengukur identitas profesional guru PPKn secara multidimensional. RIPP-PPKn mengisi kekosongan kritis ini.</p>
            </div>

            <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs space-y-3">
              <LinkIcon className="w-6 h-6 text-[#006A61]" />
              <h3 className="font-bold text-[18px] text-[#002045]">Gap Integrasi Digital Civic</h3>
              <p className="text-[14px] text-[#64748B] leading-relaxed">Minimnya kerangka konseptual yang mengintegrasikan kompetensi digital pedagogy dengan civic education secara koheren dalam konteks Indonesia.</p>
            </div>

            <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs space-y-3">
              <BarChart3 className="w-6 h-6 text-[#006A61]" />
              <h3 className="font-bold text-[18px] text-[#002045]">Gap Data Kompetensi Nasional</h3>
              <p className="text-[14px] text-[#64748B] leading-relaxed">Ketiadaan data agregat yang memetakan distribusi kompetensi guru PPKn secara nasional berbasis bukti empiris.</p>
            </div>
          </div>

          {/* Grid Bottom 2 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs space-y-3">
              <TrendingUp className="w-6 h-6 text-[#006A61]" />
              <h3 className="font-bold text-[18px] text-[#002045]">Gap Evaluasi Pelatihan Sistemik</h3>
              <p className="text-[14px] text-[#64748B] leading-relaxed">Pelatihan guru PPKn yang ada jarang menerapkan model evaluasi bertingkat seperti Kirkpatrick secara konsisten dan terukur.</p>
            </div>

            <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs space-y-3">
              <ShieldCheck className="w-6 h-6 text-[#006A61]" />
              <h3 className="font-bold text-[18px] text-[#002045]">Gap Pancasila-Digital Integration</h3>
              <p className="text-[14px] text-[#64748B] leading-relaxed">Kurangnya riset yang mengeksplorasi bagaimana nilai-nilai Pancasila dapat menjadi landasan etis pengembangan kompetensi digital citizenship guru PPKn.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PANCASILA SECTION */}
      <section className="py-25 px-6 lg:px-12 bg-white border-t border-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-[32px] font-bold text-[#002045]">Pancasila</h2>
            <p className="text-[#64748B] text-xs mt-2 max-w-xl mx-auto">Penerapan lima pilar ideologi bangsa sebagai kompas etis dan panduan nilai dalam berinteraksi, mengajar, serta membangun budaya digital yang berkeadaban.</p>
          </div>

          <div className="space-y-4">
            {/* Sila 1 */}
            <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs flex items-center space-x-4">
              <div className="p-3 bg-[#006A61]/10 text-[#006A61] rounded-xl shrink-0">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-[18px] text-[#002045]">Sila 1: Etika Digital Berketuhanan</h3>
                <p className="text-[14px] text-[#64748B] mt-1 leading-relaxed">
                  Mengintegrasikan nilai spiritualitas dan moralitas dalam penggunaan teknologi digital, menolak konten yang melanggar norma agama dan merusak martabat manusia.
                </p>
              </div>
            </div>

            {/* Sila 2 */}
            <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs flex items-center space-x-4">
              <div className="p-3 bg-[#006A61]/10 text-[#006A61] rounded-xl shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-[18px] text-[#002045]">Sila 2: Humanisasi Ruang Digital</h3>
                <p className="text-[14px] text-[#64748B] mt-1 leading-relaxed">Memastikan ruang digital tetap menjunjung kemanusiaan, menolak perundungan siber, dan mendorong interaksi digital yang bermartabat.</p>
              </div>
            </div>

            {/* Sila 3 */}
            <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs flex items-center space-x-4">
              <div className="p-3 bg-[#006A61]/10 text-[#006A61] rounded-xl shrink-0">
                <Trees className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-[18px] text-[#002045]">Sila 3: Persatuan di Ruang Maya</h3>
                <p className="text-[14px] text-[#64748B] mt-1 leading-relaxed">Menggunakan platform digital untuk memperkuat persatuan nasional, melawan hoaks pemecah bangsa, dan membangun narasi kebinekaan konstruktif.</p>
              </div>
            </div>

            {/* Sila 4 */}
            <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs flex items-center space-x-4">
              <div className="p-3 bg-[#006A61]/10 text-[#006A61] rounded-xl shrink-0">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-[18px] text-[#002045]">Sila 4: Demokrasi Digital</h3>
                <p className="text-[14px] text-[#64748B] mt-1 leading-relaxed">Menerapkan prinsip musyawarah dan mufakat dalam ruang diskusi digital, mengembangkan budaya berargumentasi yang sehat dan menghormati perbedaan.</p>
              </div>
            </div>

            {/* Sila 5 */}
            <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs flex items-center space-x-4">
              <div className="p-3 bg-[#006A61]/10 text-[#006A61] rounded-xl shrink-0">
                <Scale className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-[18px] text-[#002045]">Sila 5: Keadilan Akses Digital</h3>
                <p className="text-[14px] text-[#64748B] mt-1 leading-relaxed">Memperjuangkan pemerataan akses teknologi digital, mengatasi kesenjangan digital, dan memastikan tidak ada siswa yang tertinggal dalam era digital.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CTA BANNER */}
      <CtaBanner />

      {/* 7. FOOTER */}
      <Footer />
    </main>
  );
}
