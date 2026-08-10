import React from "react";
import Navbar from "@/components/Navbar";
import CtaBanner from "@/components/CtaBanner";
import Footer from "@/components/Footer";
import FaqSection from "@/components/FaqSection";
import { Building2, Search, GraduationCap, Megaphone, Scale, Laptop, UserCheck, Users, HeartHandshake, BookOpen, Download, Share2, Award } from "lucide-react";

export default function TentangPage() {
  return (
    <main className="min-h-screen bg-white text-[#1E1E1E]">
      <Navbar />

      {/* 1. HERO SECTION TENTANG */}
      <section className="pt-25 pb-30 px-6 lg:px-12 text-center max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold text-[#002045] tracking-tight leading-tight mb-6">
          Tentang Assessment Kompetensi <br />
          Pengajar PPKN
        </h1>
        <p className="text-[#64748B] text-[16px] leading-relaxed max-w-2xl mx-auto">
          Civix menghadirkan sistem evaluasi mendalam yang dirancang khusus untuk memetakan kapasitas profesional pendidik Pendidikan Pancasila dan Kewarganegaraan sesuai standar kurikulum modern.
        </p>
      </section>

      {/* 2. 10 DIMENSI KOMPETENSI */}
      <section className="py-16 px-8 lg:px-12 bg-white border-t border-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-[32px] font-bold text-[#002045]">10 Dimensi Kompetensi</h2>
            <p className="text-[#64748B] text-sm mt-2 max-w-xl mx-auto">Instrumen komprehensif yang mengukur setiap lapisan kapasitas pendidik untuk memastikan standar pengajaran yang berkualitas.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dimensi Items */}
            <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs flex items-start space-x-4">
              <div className="p-3 bg-[#006A61]/10 text-[#006A61] rounded-xl">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-[#002045]">Civic Competence</h3>
                <p className="text-[14px] text-[#64748B] mt-1">Penguasaan nilai demokrasi, HAM, kebinekaan, konstitusi, dan sistem pemerintahan.</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs flex items-start space-x-4">
              <div className="p-3 bg-[#006A61]/10 text-[#006A61] rounded-xl">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-[#002045]">Professionalisme Reflektif</h3>
                <p className="text-[14px] text-[#64748B] mt-1">Refleksi pedagogis berbasis bukti untuk peningkatan pembelajaran PPKn.</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs flex items-start space-x-4">
              <div className="p-3 bg-[#006A61]/10 text-[#006A61] rounded-xl">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-[#002045]">Identitas Pedagogik</h3>
                <p className="text-[14px] text-[#64748B] mt-1">Pemahaman identitas sebagai pendidik kewargaan dan penerapan nilai kewarganegaraan dalam pembelajaran.</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs flex items-start space-x-4">
              <div className="p-3 bg-[#006A61]/10 text-[#006A61] rounded-xl">
                <Megaphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-[#002045]">Professional Agency</h3>
                <p className="text-[14px] text-[#64748B] mt-1">Kapasitas proaktif, berinisiatif, dan memimpin perubahan di pendidikan kewarganegaraan.</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs flex items-start space-x-4">
              <div className="p-3 bg-[#006A61]/10 text-[#006A61] rounded-xl">
                <Scale className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-[#002045]">Civic Disposition</h3>
                <p className="text-[14px] text-[#64748B] mt-1">Sikap dan karakter kewargaan, meliputi integritas, toleransi, dan nilai demokratis.</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs flex items-start space-x-4">
              <div className="p-3 bg-[#006A61]/10 text-[#006A61] rounded-xl">
                <Laptop className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-[#002045]">Digital Citizenship Pedagogy</h3>
                <p className="text-[14px] text-[#64748B] mt-1">Kemampuan mengajarkan kewargaan digital dan literasi media berbasis nilai Pancasila.</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs flex items-start space-x-4">
              <div className="p-3 bg-[#006A61]/10 text-[#006A61] rounded-xl">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-[#002045]">Civic Skills</h3>
                <p className="text-[14px] text-[#64748B] mt-1">Keterampilan kewarganegaraan: berpikir kritis, partisipasi demokratis, komunikasi, dan musyawarah.</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs flex items-start space-x-4">
              <div className="p-3 bg-[#006A61]/10 text-[#006A61] rounded-xl">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-[#002045]">Community of Practice</h3>
                <p className="text-[14px] text-[#64748B] mt-1">Keterlibatan aktif dalam komunitas profesional guru PPKn dan jejaring kolaboratif.</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs flex items-start space-x-4">
              <div className="p-3 bg-[#006A61]/10 text-[#006A61] rounded-xl">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-[#002045]">Komitmen Demokratis</h3>
                <p className="text-[14px] text-[#64748B] mt-1">Komitmen pada demokrasi Pancasila, supremasi hukum, dan keadilan sosial.</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs flex items-start space-x-4">
              <div className="p-3 bg-[#006A61]/10 text-[#006A61] rounded-xl">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-[#002045]">Penguasaan Materi</h3>
                <p className="text-[14px] text-[#64748B] mt-1">Penguasaan substansi PPKn: Pancasila, UUD 1945, NKRI, Bhinneka Tunggal Ika, dan isu kewarganegaraan.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TINGKATAN LEVEL KOMPETENSI */}
      <section className="py-16 px-6 lg:px-12 bg-white border-t border-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-[32px] font-bold text-[#002045]">Tingkatan Level Kompetensi</h2>
            <p className="text-[#64748B] text-sm mt-2 max-w-xl mx-auto">Identifikasi posisi Anda dalam tangga profesionalisme pendidik PPKN melalui hasil asesmen yang mendalam.</p>
          </div>

          <div className="space-y-4">
            {/* Level 5 */}
            <div className="bg-white border border-gray-200/80 rounded-2xl p-5 flex items-center justify-between shadow-xs">
              <div className="flex items-center space-x-5">
                <div className="w-14 h-14 bg-[#006A61] text-white font-bold rounded-xl flex items-center justify-center text-lg">Lv5</div>
                <div>
                  <h3 className="font-bold text-lg text-[#002045]">Expert Civic Leader</h3>
                  <p className="text-[14px] text-[#64748B] max-w-xl mt-1">Menjadi rujukan utama pedagogi kewarganegaraan di tingkat regional/nasional.</p>
                </div>
              </div>
              <div className="text-right pl-4">
                <span className="text-[12px] text-[#64748B] uppercase tracking-wider block">Skor</span>
                <span className="text-lg font-bold text-[#002045]">85%–100%</span>
              </div>
            </div>

            {/* Level 4 */}
            <div className="bg-white border border-gray-200/80 rounded-2xl p-5 flex items-center justify-between shadow-xs">
              <div className="flex items-center space-x-5">
                <div className="w-14 h-14 bg-[#006A61]/85 text-white font-bold rounded-xl flex items-center justify-center text-lg">Lv4</div>
                <div>
                  <h3 className="font-bold text-lg text-[#002045]">Advanced Civic Educator</h3>
                  <p className="text-[14px] text-[#64748B] max-w-xl mt-1">Menguasai materi konstitusi dan metodologi pembelajaran adaptif.</p>
                </div>
              </div>
              <div className="text-right pl-4">
                <span className="text-[12px] text-[#64748B] uppercase tracking-wider block">Skor</span>
                <span className="text-lg font-bold text-[#002045]">70%–84%</span>
              </div>
            </div>

            {/* Level 3 */}
            <div className="bg-white border border-gray-200/80 rounded-2xl p-5 flex items-center justify-between shadow-xs">
              <div className="flex items-center space-x-5">
                <div className="w-14 h-14 bg-[#006A61]/65 text-white font-bold rounded-xl flex items-center justify-center text-lg">Lv3</div>
                <div>
                  <h3 className="font-bold text-lg text-[#002045]">Proficient Civic Educator</h3>
                  <p className="text-[14px] text-[#64748B] max-w-xl mt-1">Kompeten menyampaikan kurikulum dan mengelola diskusi kelas demokratis.</p>
                </div>
              </div>
              <div className="text-right pl-4">
                <span className="text-[12px] text-[#64748B] uppercase tracking-wider block">Skor</span>
                <span className="text-lg font-bold text-[#002045]">55%–69%</span>
              </div>
            </div>

            {/* Level 2 */}
            <div className="bg-white border border-gray-200/80 rounded-2xl p-5 flex items-center justify-between shadow-xs">
              <div className="flex items-center space-x-5">
                <div className="w-14 h-14 bg-[#006A61]/35 text-[#006A61] font-bold rounded-xl flex items-center justify-center text-lg">Lv2</div>
                <div>
                  <h3 className="font-bold text-lg text-[#002045]">Developing Civic Educator</h3>
                  <p className="text-[14px] text-[#64748B] max-w-xl mt-1">Memahami dasar PPKn, namun perlu penguatan metodologi dan literasi digital.</p>
                </div>
              </div>
              <div className="text-right pl-4">
                <span className="text-[12px] text-[#64748B] uppercase tracking-wider block">Skor</span>
                <span className="text-lg font-bold text-[#002045]">40%–54%</span>
              </div>
            </div>

            {/* Level 1 */}
            <div className="bg-white border border-gray-200/80 rounded-2xl p-5 flex items-center justify-between shadow-xs">
              <div className="flex items-center space-x-5">
                <div className="w-14 h-14 bg-[#006A61]/15 text-[#006A61] font-bold rounded-xl flex items-center justify-center text-lg">Lv1</div>
                <div>
                  <h3 className="font-bold text-lg text-[#002045]">Novice Civic Educator</h3>
                  <p className="text-[14px] text-[#64748B] max-w-xl mt-1">Memerlukan bimbingan intensif pada materi dan kapasitas pengajaran dasar.</p>
                </div>
              </div>
              <div className="text-right pl-4">
                <span className="text-[12px] text-[#64748B] uppercase tracking-wider block">Skor</span>
                <span className="text-lg font-bold text-[#002045]">20%–39%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CONTOH LAPORAN DIAGNOSTIK ASESMEN */}
      <section className="py-16 px-6 lg:px-12 bg-white border-t border-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-[32px] font-bold text-[#002045]">Contoh Laporan Diagnostik Asesmen</h2>
            <p className="text-[#64748B] text-sm mt-2 max-w-xl mx-auto">Pelajari bagaimana hasil evaluasi mandiri Anda dipetakan ke dalam indikator kompetensi nasional yang terukur dan mudah dipahami.</p>
          </div>

          {/* MOCKUP CARD DIAGNOSTIK */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
            {/* Header Level Card */}
            <div className="bg-[#006A61] text-white rounded-2xl p-6 flex items-center space-x-5">
              <div className="w-14 h-14 rounded-full bg-[#F59E0B] flex items-center justify-center text-white shrink-0">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Level 4 - Advanced Civic Educator</h3>
                <p className="text-xs text-teal-50 mt-1 leading-relaxed">
                  Selamat! Anda telah menunjukkan penguasaan yang mendalam terhadap konsep-konsep kewarganegaraan yang kompleks. Sebagai Advanced Civic Educator, Anda memiliki kemampuan luar biasa dalam menganalisis kebijakan publik,
                  memahami dinamika hukum konstitusional, dan memfasilitasi dialog kewarganegaraan yang konstruktif di tingkat lanjut.
                </p>
              </div>
            </div>

            {/* Content Mid Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Donut Chart Simulation */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col items-center justify-center shadow-xs">
                <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">Level 4</span>
                <span className="text-xs text-[#64748B] mb-4">Advanced Civic Educator</span>

                {/* Simulated Donut Circle */}
                <div className="relative w-36 h-36 rounded-full border-[12px] border-[#006A61] border-r-teal-100 flex items-center justify-center my-2">
                  <div className="text-center">
                    <span className="text-2xl font-extrabold text-[#002045] block">85%</span>
                    <span className="text-[10px] text-[#64748B] uppercase">AKURASI</span>
                  </div>
                </div>

                <div className="flex space-x-6 text-xs mt-4">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#006A61]"></span>
                    <span className="text-[#1E1E1E]">
                      Benar: <strong>85 Soal</strong>
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-pink-300"></span>
                    <span className="text-[#1E1E1E]">
                      Salah: <strong>15 Soal</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Keunggulan Utama */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4 shadow-xs">
                <h4 className="font-bold text-base text-[#002045]">Keunggulan Utama</h4>

                <div className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded-xl flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Building2 className="w-5 h-5 text-[#006A61]" />
                      <div>
                        <p className="text-xs font-bold text-[#002045]">Civic Competence</p>
                        <p className="text-[10px] text-[#64748B]">Pemahaman mendalam tentang tatanan perundang-undangan.</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#006A61]">96%</span>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-xl flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <GraduationCap className="w-5 h-5 text-[#006A61]" />
                      <div>
                        <p className="text-xs font-bold text-[#002045]">Identitas Pedagogik</p>
                        <p className="text-[10px] text-[#64748B]">Analisis kritis terhadap dinamika kemajemukan bangsa.</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#006A61]">92%</span>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-xl flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Scale className="w-5 h-5 text-[#006A61]" />
                      <div>
                        <p className="text-xs font-bold text-[#002045]">Civic Disposition</p>
                        <p className="text-[10px] text-[#64748B]">Analisis kritis terhadap dinamika kemajemukan bangsa.</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#006A61]">92%</span>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-xl flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <UserCheck className="w-5 h-5 text-[#006A61]" />
                      <div>
                        <p className="text-xs font-bold text-[#002045]">Civic Skills</p>
                        <p className="text-[10px] text-[#64748B]">Evaluasi efektivitas regulasi terhadap kesejahteraan.</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#006A61]">88%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Detail Kompetensi Keseluruhan (10 Progress Bars) */}
            <div className="border-t border-gray-100 pt-6 space-y-4">
              <div>
                <h4 className="font-bold text-base text-[#002045]">Detail Kompetensi Keseluruhan</h4>
                <p className="text-xs text-[#64748B]">Pemetaan lengkap 10 pilar utama kompetensi kewarganegaraan.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pt-2">
                {/* Pillar 1 */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-[#1E1E1E]">01. Civic Competence</span>
                    <span className="font-bold text-[#006A61]">98%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#006A61] w-[98%]"></div>
                  </div>
                </div>

                {/* Pillar 6 */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-[#1E1E1E]">06. Professionalisme Reflektif</span>
                    <span className="font-bold text-[#006A61]">98%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#006A61] w-[98%]"></div>
                  </div>
                </div>

                {/* Pillar 2 */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-[#1E1E1E]">02. Identitas Pedagogik</span>
                    <span className="font-bold text-[#006A61]">85%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#006A61] w-[85%]"></div>
                  </div>
                </div>

                {/* Pillar 7 */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-[#1E1E1E]">07. Professional Agency</span>
                    <span className="font-bold text-[#006A61]">85%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#006A61] w-[85%]"></div>
                  </div>
                </div>

                {/* Pillar 3 */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-[#1E1E1E]">03. Civic Disposition</span>
                    <span className="font-bold text-[#006A61]">92%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#006A61] w-[92%]"></div>
                  </div>
                </div>

                {/* Pillar 8 */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-[#1E1E1E]">08. Digital Citizenship Pedagogy</span>
                    <span className="font-bold text-[#006A61]">92%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#006A61] w-[92%]"></div>
                  </div>
                </div>

                {/* Pillar 4 */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-[#1E1E1E]">04. Civic Skills</span>
                    <span className="font-bold text-[#006A61]">88%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#006A61] w-[88%]"></div>
                  </div>
                </div>

                {/* Pillar 9 */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-[#1E1E1E]">09. Community of Practice</span>
                    <span className="font-bold text-[#006A61]">88%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#006A61] w-[88%]"></div>
                  </div>
                </div>

                {/* Pillar 5 */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-[#1E1E1E]">05. Komitmen Demokratis</span>
                    <span className="font-bold text-amber-500">76%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 w-[76%]"></div>
                  </div>
                </div>

                {/* Pillar 10 */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-[#1E1E1E]">10. Penguasaan Materi</span>
                    <span className="font-bold text-amber-500">79%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 w-[79%]"></div>
                  </div>
                </div>
              </div>

              {/* Card Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4">
                <button className="inline-flex items-center px-4 py-2.5 bg-[#006A61] text-white text-xs font-semibold rounded-xl hover:bg-[#00524B] transition-colors gap-2">
                  <Download className="w-4 h-4" />
                  Unduh Laporan Lengkap (PDF)
                </button>
                <button className="inline-flex items-center px-4 py-2.5 border border-gray-200 text-[#002045] text-xs font-semibold rounded-xl hover:bg-gray-50 transition-colors gap-2">
                  <Share2 className="w-4 h-4" />
                  Bagikan Hasil
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQ SECTION */}
      <FaqSection />

      {/* 6. CTA BANNER */}
      <CtaBanner />

      {/* 7. FOOTER */}
      <Footer />
    </main>
  );
}
