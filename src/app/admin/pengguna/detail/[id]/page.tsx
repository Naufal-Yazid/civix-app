import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAssessmentResultById } from "@/app/admin/pengguna/actions";
import { ChevronRight, ArrowUpDown, Search } from "lucide-react";

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
  const dimensions = (result.dimensionScores as typeof defaultDimensions) || defaultDimensions;

  return (
    <div className="space-y-6">
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
      <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs space-y-6">
        <h2 className="font-bold text-lg text-[#002045]">Profil Pengguna</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 text-xs">
          <div>
            <span className="text-gray-400 block mb-1">UserID</span>
            <span className="font-bold text-[#002045] text-sm">{result.userIdCode}</span>
          </div>

          <div>
            <span className="text-gray-400 block mb-1">Tanggal</span>
            <span className="font-semibold text-[#1E1E1E]">
              {new Date(result.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          <div>
            <span className="text-gray-400 block mb-1">Nama</span>
            <span className="font-semibold text-[#1E1E1E]">{result.userName}</span>
          </div>

          <div>
            <span className="text-gray-400 block mb-1">Durasi Pengerjaan</span>
            <span className="font-semibold text-[#1E1E1E]">{result.duration || "12 Menit 45 Detik"}</span>
          </div>

          <div>
            <span className="text-gray-400 block mb-1">Asal Instansi</span>
            <span className="font-semibold text-[#1E1E1E]">{result.institution || "SMA Negeri 3"}</span>
          </div>

          <div>
            <span className="text-gray-400 block mb-1">Jenjang Mengajar</span>
            <span className="font-semibold text-[#1E1E1E]">{result.gradeLevel || "SMA"}</span>
          </div>

          <div>
            <span className="text-gray-400 block mb-1">Wilayah Kota/Kab</span>
            <span className="font-semibold text-[#1E1E1E]">{result.city || "Bandung"}</span>
          </div>
        </div>
      </div>

      {/* CARD 2: RINGKASAN SKOR */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs space-y-6">
        <h2 className="font-bold text-lg text-[#002045]">Ringkasan Skor</h2>

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

      {/* CARD 3: LOG JAWABAN */}
      <div className="bg-white border border-gray-200/80 rounded-2xl shadow-xs overflow-hidden space-y-4 p-6">
        <h2 className="font-bold text-lg text-[#002045]">Log Jawaban</h2>

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
                  <th className="p-4 font-semibold w-48">Jawaban</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {result.answers && result.answers.length > 0
                  ? result.answers.map((ans, idx) => (
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
                  : /* Mockup Rows jika belum ada log terhubung */
                    [
                      { code: "QUE001", q: "Bagaimana Anda mengintegrasikan nilai Pancasila dalam kurikulum...", a: "A. Sangat Setuju" },
                      { code: "QUE002", q: "Sebutkan tiga elemen utama dalam Bela Negara menurut UU No. 23...", a: "B. Setuju" },
                      { code: "QUE003", q: "Sejauh mana Anda setuju bahwa keterlibatan masyarakat dalam...", a: "C. Kurang Setuju" },
                      { code: "QUE004", q: "Analisis terhadap penerapan otonomi daerah di Indonesia menunjukkan...", a: "A. Sangat Setuju" },
                      { code: "QUE005", q: "Fungsi legislasi DPR RI dalam sistem ketatanegaraan Indonesia meliputi...", a: "B. Setuju" },
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/60 transition-colors">
                        <td className="p-4 text-center">
                          <input type="checkbox" className="rounded border-gray-300 accent-[#002045]" />
                        </td>
                        <td className="p-4 text-gray-400">{idx + 1}</td>
                        <td className="p-4 font-bold text-[#002045]">{row.code}</td>
                        <td className="p-4 text-[#1E1E1E] max-w-md truncate">{row.q}</td>
                        <td className="p-4 font-semibold text-[#002045]">{row.a}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
