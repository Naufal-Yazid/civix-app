import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ChevronDown } from "lucide-react";
import { prisma } from "@/lib/prisma";

interface DetailSoalPageProps {
  params: Promise<{ id: string }>;
}

export default async function DetailSoalPage({ params }: DetailSoalPageProps) {
  const { id } = await params;

  const question = await prisma.question.findUnique({
    where: { id },
    include: {
      options: {
        orderBy: { label: "asc" },
      },
    },
  });

  if (!question) {
    notFound();
  }

  // Helper pemetaan label jenis jawaban
  const getTypeText = (type: string) => {
    switch (type) {
      case "SCALE":
        return "Scale (Linear Scale)";
      case "MULTIPLE_CHOICE":
        return "Pilihan Ganda";
      case "CHECKBOX":
        return "Checkbox";
      case "DROPDOWN":
        return "Dropdown";
      case "SHORT_TEXT":
        return "Jawaban Singkat";
      case "LONG_TEXT":
        return "Paragraf / Uraian";
      default:
        return type;
    }
  };

  const isActive = question.status === "ACTIVE";

  // Data range skala linear
  const scaleMin = question.scaleMin ?? 1;
  const scaleMax = question.scaleMax ?? 5;
  const scaleSteps = Array.from({ length: scaleMax - scaleMin + 1 }, (_, i) => scaleMin + i);

  return (
    <div className="space-y-6 w-full pb-10">
      {/* Header & Breadcrumb */}
      <div className="space-y-1">
        <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs text-[#64748B]">
          <Link href="/admin/soal" className="hover:text-[#002045] hover:underline transition-colors font-medium">
            Manajemen Soal
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="font-semibold text-[#002045]">Detail Pertanyaan</span>
        </nav>
        <h1 className="text-2xl font-bold text-[#002045] pt-1">Detail Pertanyaan</h1>
      </div>

      {/* Grid Baris Pertama: Card Pertanyaan & Card Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Card 1: Pertanyaan (Lebar 2 Kolom) */}
        <div className="lg:col-span-2 bg-white border border-gray-200/80 rounded-[12px] p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-[#002045]">Pertanyaan</h2>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#1E1E1E]">Pertanyaan</label>
            <div className="w-full min-h-[140px] p-4 text-[14px] bg-[#FAFAFA] border border-gray-200 rounded-[8px] text-[#1E1E1E] leading-relaxed select-text">{question.questionText}</div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#1E1E1E]">Dimensi Kompetensi</label>
            <div className="relative">
              <div className="w-full p-3.5 text-[14px] bg-[#FAFAFA] border border-gray-200 rounded-[8px] text-[#1E1E1E] flex items-center justify-between">
                <span>{question.dimension}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Status (Lebar 1 Kolom) */}
        <div className="bg-white border border-gray-200/80 rounded-[12px] p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-[#002045]">Status</h2>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[14px] font-medium text-[#1E1E1E]">Active</span>
            <div className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${isActive ? "bg-[#006A61]" : "bg-gray-200"}`}>
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${isActive ? "translate-x-6" : "translate-x-0"}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Grid Baris Kedua: Card Jenis Jawaban */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-gray-200/80 rounded-[12px] p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-[#002045]">Jenis Jawaban</h2>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#1E1E1E]">Jenis Jawaban</label>
            <div className="relative">
              <div className="w-full p-3.5 text-[14px] bg-[#FAFAFA] border border-gray-200 rounded-[8px] text-[#1E1E1E] flex items-center justify-between">
                <span>{getTypeText(question.type)}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* 1. SCALE (Termasuk Baris Value/Skor Tiap Step Skala) */}
          {question.type === "SCALE" && (
            <div className="space-y-6 pt-2">
              {/* Row Skala Min */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#64748B]">Skala Min</label>
                <div className="flex items-center gap-3">
                  <div className="w-16 p-3 text-[14px] font-bold text-center bg-white border border-gray-200 rounded-[8px] text-[#002045] shrink-0">{scaleMin}</div>
                  <input type="text" disabled value={question.scaleMinLabel || "Sangat Tidak Setuju"} className="flex-1 p-3 text-[14px] bg-[#FAFAFA] border border-gray-200 rounded-[8px] text-[#1E1E1E]" />
                </div>
              </div>

              {/* Row Skala Max */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#64748B]">Skala Max</label>
                <div className="flex items-center gap-3">
                  <div className="w-16 p-3 text-[14px] font-bold text-center bg-white border border-gray-200 rounded-[8px] text-[#002045] shrink-0">{scaleMax}</div>
                  <input type="text" disabled value={question.scaleMaxLabel || "Sangat Setuju"} className="flex-1 p-3 text-[14px] bg-[#FAFAFA] border border-gray-200 rounded-[8px] text-[#1E1E1E]" />
                </div>
              </div>

              {/* Row Grid Value / Skor untuk masing-masing angka skala */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-semibold text-[#64748B]">Value</label>
                <div className="grid grid-cols-5 gap-3">
                  {scaleSteps.map((step) => {
                    const matchedOption = question.options.find((opt) => opt.label === String(step) || opt.text === `Skala ${step}`);
                    const scoreValue = matchedOption !== undefined ? matchedOption.score : 0;

                    return (
                      <div key={step} className="flex flex-col items-center space-y-1.5">
                        <div className="w-full p-3 text-[14px] font-bold text-center bg-[#FAFAFA] border border-gray-200 rounded-[8px] text-[#002045]">{scoreValue}</div>
                        <span className="text-xs font-medium text-gray-400">{step}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 2. CHECKBOX / MULTIPLE_CHOICE / DROPDOWN */}
          {["CHECKBOX", "MULTIPLE_CHOICE", "DROPDOWN"].includes(question.type) && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between text-xs font-semibold text-[#64748B]">
                <span>Teks Jawaban</span>
                <span>Skor/Value</span>
              </div>

              <div className="space-y-3">
                {question.options && question.options.length > 0 ? (
                  question.options.map((opt, idx) => (
                    <div key={opt.id || idx} className="flex items-center gap-3">
                      <div className="w-10 h-11 bg-white border border-gray-200 rounded-[8px] flex items-center justify-center text-xs font-bold text-[#002045] shrink-0">
                        {question.type === "CHECKBOX" ? <div className="w-4 h-4 border border-gray-300 rounded-[4px]" /> : idx + 1}
                      </div>
                      <input type="text" disabled value={opt.text} className="flex-1 p-3 text-[14px] bg-[#FAFAFA] border border-gray-200 rounded-[8px] text-[#1E1E1E]" />
                      <div className="w-16 p-3 text-[14px] font-bold text-center bg-[#FAFAFA] border border-gray-200 rounded-[8px] text-[#002045] shrink-0">{opt.score}</div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 bg-[#FAFAFA] border border-gray-200 rounded-[8px] text-center text-sm text-gray-400 italic">Tidak ada opsi jawaban tersedia.</div>
                )}
              </div>
            </div>
          )}

          {/* 3. SHORT_TEXT / LONG_TEXT */}
          {["SHORT_TEXT", "LONG_TEXT"].includes(question.type) && (
            <div className="p-4 bg-[#FAFAFA] border border-gray-200 rounded-[8px] text-sm text-gray-500 italic">
              {question.type === "SHORT_TEXT" ? "Format isian jawaban singkat (1 baris teks)." : "Format isian jawaban panjang (uraian/textarea)."}
            </div>
          )}
        </div>
      </div>

      {/* Tombol Navigasi Kembali */}
      <div className="pt-2">
        <Link href="/admin/soal" className="inline-flex items-center justify-center px-6 py-2.5 border border-gray-200 text-[#002045] text-sm font-medium rounded-[8px] hover:bg-white bg-white/60 transition-all shadow-xs">
          Kembali
        </Link>
      </div>
    </div>
  );
}
