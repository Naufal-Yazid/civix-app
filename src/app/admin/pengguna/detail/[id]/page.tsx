import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAssessmentResultById } from "@/app/admin/pengguna/actions";
import { ChevronRight, ArrowUpDown, Search, User, GraduationCap, School, Briefcase, Award } from "lucide-react";

interface DetailUserPageProps {
  params: Promise<{ id: string }>;
}

// 10 Dimensi Default dengan fallback data
const defaultDimensions = [
  { id: "01", name: "Civic Competence", score: 98 },
  { id: "02", name: "Identitas Pedagogik", score: 85 },
  { id: "03", name: "Civic Disposition", score: 92 },
  { id: "04", name: "Civic Skills", score: 88 },
  { id: "05", name: "Komitmen Demokratis", score: 76 },
  { id: "06", name: "Professionalisme Reflektif", score: 98 },
  { id: "07", name: "Professional Agency", score: 85 },
  { id: "08", name: "Digital Citizenship Pedagogy", score: 92 },
  { id: "09", name: "Community of Practice", score: 88 },
  { id: "10", name: "Penguasaan Materi", score: 76 },
];

export default async function DetailUserPage({ params }: DetailUserPageProps) {
  const { id } = await params;
  const result = await getAssessmentResultById(id);

  if (!result) {
    notFound();
  }

  // Parse dimensionScores dari DB atau gunakan default
  const dimensions = (result.dimensionScores as unknown as typeof defaultDimensions) || defaultDimensions;

  // Parse demographics dari DB
  const demoData = (result.demographicAnswers as Record<string, string>) || {};

  return (
    <div className="space-y-8 pb-12">
      {/* BREADCRUMBS & HEADER */}
      <div className="space-y-1">
        <nav className="flex items-center space-x-2 text-xs text-[#64748B]">
          <Link href="/admin/pengguna" className="hover:text-[#002045] hover:underline transition-colors font-medium">
            Data Pengguna
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="font-semibold text-[#002045]">View Data Pengguna</span>
        </nav>

        <div className="pt-1">
          <h1 className="text-2xl font-bold text-[#002045]">View Data Pengguna</h1>
        </div>
      </div>

      {/* CARD 1: PROFIL PENGGUNA */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <div className="w-9 h-9 rounded-xl bg-[#E6F0F0] text-[#006A61] flex items-center justify-center font-bold">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-[#002045]">Profil Pengguna</h2>
            <p className="text-xs text-[#64748B]">Informasi umum identitas peserta assessment.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-12 text-xs">
          <div>
            <span className="text-gray-400 block mb-1">UserID</span>
            <span className="font-bold text-[#002045] text-sm">{result.userIdCode}</span>
          </div>

          <div>
            <span className="text-gray-400 block mb-1">Tanggal Assessment</span>
            <span className="font-semibold text-[#1E1E1E]">
              {new Date(result.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          <div>
            <span className="text-gray-400 block mb-1">Nama Lengkap</span>
            <span className="font-semibold text-[#1E1E1E]">{result.userName}</span>
          </div>

          <div>
            <span className="text-gray-400 block mb-1">Durasi Pengerjaan</span>
            <span className="font-semibold text-[#1E1E1E]">{result.duration || "12 Menit 45 Detik"}</span>
          </div>

          <div>
            <span className="text-gray-400 block mb-1">Asal Instansi</span>
            <span className="font-semibold text-[#1E1E1E]">{result.institution || "SMA Negeri 3 Surabaya"}</span>
          </div>

          <div>
            <span className="text-gray-400 block mb-1">Jenjang Mengajar</span>
            <span className="font-semibold text-[#1E1E1E]">{result.gradeLevel || "SMA"}</span>
          </div>

          <div>
            <span className="text-gray-400 block mb-1">Wilayah (Kota/Kabupaten)</span>
            <span className="font-semibold text-[#1E1E1E]">{result.city || "Kota Surabaya"}</span>
          </div>
        </div>
      </div>

      {/* CARD 2: PROFIL DEMOGRAFIS & PROFESIONAL RESPONDEN (35 BUTIR LENGKAP) */}
      {result.demographicAnswers && Object.keys(demoData).length > 0 && (
        <div className="bg-white border border-gray-200/80 rounded-2xl p-6 md:p-8 shadow-xs space-y-8">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="w-9 h-9 rounded-xl bg-[#E6F0F0] text-[#006A61] flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-[#002045]">Profil Demografis & Profesional Responden</h2>
              <p className="text-xs text-[#64748B]">Rincian 35 butir profil latar belakang pendidikan, satuan pendidikan, dan riwayat mengajar.</p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Bagian 1: Identitas & Latar Belakang Pendidikan */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-[#006A61] uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#006A61]" />
                Bagian 1: Identitas & Latar Belakang Pendidikan
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100 text-xs">
                <div>
                  <span className="text-gray-400 block mb-0.5">Jenis Kelamin</span>
                  <span className="font-semibold text-[#1E1E1E]">{demoData.jenisKelamin || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Kelompok Usia</span>
                  <span className="font-semibold text-[#1E1E1E]">{demoData.kelompokUsia || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Pendidikan Terakhir</span>
                  <span className="font-semibold text-[#1E1E1E]">{demoData.pendidikanTerakhir || "-"}</span>
                </div>
                <div className="md:col-span-2">
                  <span className="text-gray-400 block mb-0.5">Latar Belakang Pendidikan Utama</span>
                  <span className="font-semibold text-[#1E1E1E]">{demoData.latarBelakangPendidikan || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Status Sertifikasi Pendidik</span>
                  <span className="font-semibold text-[#1E1E1E]">{demoData.statusSertifikasi || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Status Kepegawaian</span>
                  <span className="font-semibold text-[#1E1E1E]">{demoData.statusKepegawaian || "-"}</span>
                </div>
                <div className="md:col-span-2">
                  <span className="text-gray-400 block mb-0.5">Tugas Tambahan di Sekolah</span>
                  <span className="font-semibold text-[#1E1E1E]">{demoData.tugasTambahan || "-"}</span>
                </div>
              </div>
            </div>

            {/* Bagian 2: Profil Satuan Pendidikan */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-[#006A61] uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#006A61]" />
                Bagian 2: Profil Satuan Pendidikan
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100 text-xs">
                <div>
                  <span className="text-gray-400 block mb-0.5">Jenjang Satuan Pendidikan Utama</span>
                  <span className="font-semibold text-[#1E1E1E]">{demoData.jenjangPendidikanUtama || result.gradeLevel || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Status Satuan Pendidikan</span>
                  <span className="font-semibold text-[#1E1E1E]">{demoData.statusSatuanPendidikan || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Akreditasi Sekolah</span>
                  <span className="font-semibold text-[#1E1E1E]">{demoData.akreditasiSekolah || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Nama Sekolah</span>
                  <span className="font-semibold text-[#1E1E1E]">{demoData.namaSekolah || result.institution || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">NPSN Sekolah</span>
                  <span className="font-semibold text-[#1E1E1E]">{demoData.npsnSekolah || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Kecamatan Lokasi di Surabaya</span>
                  <span className="font-semibold text-[#1E1E1E]">{demoData.kecamatanSurabaya || "-"}</span>
                </div>
                <div className="md:col-span-3">
                  <span className="text-gray-400 block mb-0.5">Kurikulum yang Dominan Digunakan</span>
                  <span className="font-semibold text-[#1E1E1E]">{demoData.kurikulumDominan || "-"}</span>
                </div>
              </div>
            </div>

            {/* Bagian 3: Pengalaman & Beban Mengajar */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-[#006A61] uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#006A61]" />
                Bagian 3: Pengalaman & Beban Mengajar
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100 text-xs">
                <div>
                  <span className="text-gray-400 block mb-0.5">Total Lama Mengajar</span>
                  <span className="font-semibold text-[#1E1E1E]">{demoData.totalLamaMengajar || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Lama Mengajar PPKn</span>
                  <span className="font-semibold text-[#1E1E1E]">{demoData.lamaMengajarPPKn || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Lama di Sekolah Saat Ini</span>
                  <span className="font-semibold text-[#1E1E1E]">{demoData.lamaMengajarSekolahSaatIni || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Kelas yang Diajar</span>
                  <span className="font-semibold text-[#1E1E1E]">{demoData.kelasYangDiajar || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Jumlah Rombel PPKn</span>
                  <span className="font-semibold text-[#1E1E1E]">{demoData.jumlahRombelPPKn || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Beban Jam PPKn / Minggu</span>
                  <span className="font-semibold text-[#1E1E1E]">{demoData.bebanJamPPKn || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Rata-rata Murid / Kelas</span>
                  <span className="font-semibold text-[#1E1E1E]">{demoData.rataMuridPerKelas || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Mengajar Mapel Lain?</span>
                  <span className="font-semibold text-[#1E1E1E]">{demoData.mengajarMapelLain || "Tidak"}</span>
                </div>
                {demoData.mengajarMapelLain === "Ya" && (
                  <div>
                    <span className="text-gray-400 block mb-0.5">Mata Pelajaran Lain</span>
                    <span className="font-semibold text-[#1E1E1E]">{demoData.namaMapelLain || "-"}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bagian 4: Pengembangan Profesi, Pembelajaran & Tindak Lanjut */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-[#006A61] uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#006A61]" />
                Bagian 4: Pengembangan Profesi, Pembelajaran & Tindak Lanjut
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100 text-xs">
                <div>
                  <span className="text-gray-400 block mb-0.5">Keaktifan dalam MGMP</span>
                  <span className="font-semibold text-[#1E1E1E]">{demoData.keaktifanMGMP || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Frekuensi MGMP 1 Thn Terakhir</span>
                  <span className="font-semibold text-[#1E1E1E]">{demoData.frekuensiMGMP || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Pengalaman PTK / Inkuiri Kelas</span>
                  <span className="font-semibold text-[#1E1E1E]">{demoData.pengalamanPTK || "-"}</span>
                </div>
                <div className="md:col-span-2">
                  <span className="text-gray-400 block mb-0.5">Topik Pengembangan Profesi 2 Thn Terakhir</span>
                  <span className="font-semibold text-[#1E1E1E]">{demoData.topikPengembanganProfesi || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Pengalaman Berbagi Praktik Baik</span>
                  <span className="font-semibold text-[#1E1E1E]">{demoData.pengalamanBerbagiPraktikBaik || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Penggunaan Platform Digital</span>
                  <span className="font-semibold text-[#1E1E1E]">{demoData.frekuensiPlatformDigital || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Dukungan Internet Sekolah</span>
                  <span className="font-semibold text-[#1E1E1E]">{demoData.kondisiInternetSekolah || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Bahas Isu Publik Aktual/Sensitif</span>
                  <span className="font-semibold text-[#1E1E1E]">{demoData.frekuensiIsuPublik || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Persepsi Keberagaman Murid</span>
                  <span className="font-semibold text-[#1E1E1E]">{demoData.keberagamanMurid || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Kesediaan Wawancara Lanjutan</span>
                  <span className="font-semibold text-[#1E1E1E]">{demoData.kesediaanWawancara || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Kontak Tindak Lanjut</span>
                  <span className="font-semibold text-[#1E1E1E]">{demoData.kontakTindakLanjut || "-"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CARD 3: RINGKASAN SKOR */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <div className="w-9 h-9 rounded-xl bg-[#E6F0F0] text-[#006A61] flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-[#002045]">Ringkasan Skor</h2>
            <p className="text-xs text-[#64748B]">Hasil capaian kompetensi dan evaluasi level.</p>
          </div>
        </div>

        {/* Level & Composite Score */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-gray-100 pb-6 text-xs">
          <div>
            <span className="text-gray-400 block mb-1">Badge Level</span>
            <span className="font-bold text-[#002045] text-sm">{result.badgeLevel}</span>
          </div>

          <div>
            <span className="text-gray-400 block mb-1">Skor Komposit</span>
            <span className="font-bold text-[#002045] text-sm">{result.compositeScore}/100</span>
          </div>
        </div>

        {/* 10 Dimensi Kompetensi Grid */}
        <div className="space-y-4 pt-2">
          <span className="text-xs font-semibold text-gray-400 block">10 Dimensi Kompetensi</span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 text-xs">
            {dimensions.map((dim) => (
              <div key={dim.id} className="space-y-2">
                <div className="flex justify-between items-center font-semibold">
                  <span className="text-[#002045]">
                    <span className="text-[#006A61] font-bold mr-1.5">{dim.id}.</span>
                    {dim.name}
                  </span>
                  <span className={dim.score < 80 ? "text-amber-500 font-bold" : "text-[#006A61] font-bold"}>{dim.score}%</span>
                </div>

                {/* Progress Bar Track */}
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-300 ${dim.score < 80 ? "bg-amber-400" : "bg-[#006A61]"}`} style={{ width: `${dim.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CARD 4: LOG JAWABAN */}
      <div className="bg-white border border-gray-200/80 rounded-2xl shadow-xs overflow-hidden space-y-4 p-6 md:p-8">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <div className="w-9 h-9 rounded-xl bg-[#E6F0F0] text-[#006A61] flex items-center justify-center font-bold">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-[#002045]">Log Jawaban</h2>
            <p className="text-xs text-[#64748B]">Daftar butir pertanyaan dan respons yang dipilih peserta.</p>
          </div>
        </div>

        <div className="border border-gray-200/80 rounded-2xl overflow-hidden">
          {/* Controls Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
            <button className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-500">
              <ArrowUpDown className="w-4 h-4" />
            </button>

            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
              <input type="text" placeholder="Search..." className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#006A61] placeholder:text-gray-300" />
            </div>
          </div>

          {/* Table Log Jawaban */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-gray-100 text-[#64748B]">
                  <th className="p-4 w-10 text-center">
                    <input type="checkbox" className="rounded border-gray-300 accent-[#002045]" />
                  </th>
                  <th className="p-4 font-semibold w-12">#</th>
                  <th className="p-4 font-semibold w-24">ID</th>
                  <th className="p-4 font-semibold">Pertanyaan</th>
                  <th className="p-4 font-semibold w-52">Jawaban</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {result.answers && result.answers.length > 0 ? (
                  result.answers.map((ans, idx) => (
                    <tr key={ans.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="p-4 text-center">
                        <input type="checkbox" className="rounded border-gray-300 accent-[#002045]" />
                      </td>
                      <td className="p-4 text-gray-400">{idx + 1}</td>
                      <td className="p-4 font-bold text-[#002045]">{ans.questionCode}</td>
                      <td className="p-4 text-[#1E1E1E] max-w-md truncate">{ans.questionText}</td>
                      <td className="p-4 font-semibold text-[#002045]">{ans.selectedAnswer}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-gray-400">
                      Tidak ada log jawaban tercatat.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
