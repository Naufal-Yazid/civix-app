import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ArrowLeft } from "lucide-react";
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
        <h1 className="text-2xl font-semibold text-[#002045] pt-1">Detail Pertanyaan</h1>
      </div>

      {/* Grid Baris Pertama: Card Pertanyaan & Card Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Card 1: Pertanyaan (Lebar 2 Kolom) */}
        <div className="lg:col-span-2 bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
          <h2 className="text-lg font-semibold text-[#002045]">Pertanyaan</h2>

          {/* 1. ID Soal */}
          <div>
            <span className="text-[14px] font-medium text-[#64748B] block mb-1">ID</span>
            <span className="text-[16px] font-bold text-[#002045]">{question.code}</span>
          </div>

          {/* 2. Dimensi Kompetensi */}
          <div>
            <span className="text-[14px] font-medium text-[#64748B] block mb-1">Dimensi Kompetensi</span>
            <span className="text-[16px] font-regular text-[#1E1E1E]">{question.dimension}</span>
          </div>

          {/* 3. Teks Pertanyaan */}
          <div>
            <span className="text-[14px] font-medium text-[#64748B] block mb-1">Pertanyaan</span>
            <p className="text-[16px] font-normal text-[#1E1E1E] leading-relaxed">{question.questionText}</p>
          </div>
        </div>

        {/* Card 2: Status (Lebar 1 Kolom) */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-lg font-semibold text-[#002045]">Status</h2>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[16px] font-normal text-[#1E1E1E]">Active</span>
            <div className={`w-12 h-6 flex items-center rounded-full p-1 cursor-not-allowed ${isActive ? "bg-gray-300" : "bg-gray-200"}`}>
              <div className={`bg-white w-4 h-4 rounded-full shadow-xs transform transition-transform ${isActive ? "translate-x-6" : "translate-x-0"}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Grid Baris Kedua: Card Jenis Jawaban */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-lg font-semibold text-[#002045]">Jenis Jawaban</h2>

          <div>
            <span className="text-[14px] font-medium text-[#64748B] block mb-1">Jenis Format Jawaban</span>
            <span className="text-[16px] font-bold text-[#002045]">{getTypeText(question.type)}</span>
          </div>

          {/* 1. SCALE */}
          {question.type === "SCALE" && (
            <div className="space-y-6 pt-2 border-t border-gray-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <span className="text-[14px] font-medium text-[#64748B] block mb-1">Skala Min ({scaleMin})</span>
                  <span className="text-[16px] font-normal text-[#1E1E1E]">{question.scaleMinLabel || "Sangat Tidak Setuju"}</span>
                </div>
                <div>
                  <span className="text-[14px] font-medium text-[#64748B] block mb-1">Skala Max ({scaleMax})</span>
                  <span className="text-[16px] font-normal text-[#1E1E1E]">{question.scaleMaxLabel || "Sangat Setuju"}</span>
                </div>
              </div>

              {/* Grid Value / Skor untuk masing-masing angka skala */}
              <div className="space-y-2 pt-2">
                <span className="text-[14px] font-medium text-[#64748B] block">Bobot Skor (Value)</span>
                <div className="grid grid-cols-5 gap-3">
                  {scaleSteps.map((step) => {
                    const matchedOption = question.options.find((opt) => opt.label === String(step) || opt.text === `Skala ${step}`);
                    const scoreValue = matchedOption !== undefined ? matchedOption.score : step;

                    return (
                      <div key={step} className="flex flex-col items-center space-y-1.5">
                        <div className="w-full p-3 text-[16px] font-bold text-center bg-[#FAFAFA] border border-gray-200 rounded-xl text-[#002045]">{scoreValue}</div>
                        <span className="text-[12px] font-medium text-gray-400">Skala {step}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 2. CHECKBOX / MULTIPLE_CHOICE / DROPDOWN */}
          {["CHECKBOX", "MULTIPLE_CHOICE", "DROPDOWN"].includes(question.type) && (
            <div className="space-y-4 pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between text-[14px] font-semibold text-[#64748B] pb-1">
                <span>Pilihan Opsi Jawaban</span>
                <span>Bobot Skor</span>
              </div>

              <div className="space-y-3">
                {question.options && question.options.length > 0 ? (
                  question.options.map((opt, idx) => (
                    <div key={opt.id || idx} className="flex items-center gap-3">
                      <div className="w-10 h-11 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center text-[14px] font-bold text-[#002045] shrink-0">{opt.label || String.fromCharCode(65 + idx)}</div>
                      <div className="flex-1 p-3 text-[16px] font-normal bg-[#FAFAFA] border border-gray-200 rounded-xl text-[#1E1E1E]">{opt.text}</div>
                      <div className="w-16 p-3 text-[16px] font-bold text-center bg-[#FAFAFA] border border-gray-200 rounded-xl text-[#002045] shrink-0">{opt.score}</div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 bg-[#FAFAFA] border border-gray-200 rounded-xl text-center text-sm text-gray-400 italic">Tidak ada opsi jawaban tersedia.</div>
                )}
              </div>
            </div>
          )}

          {/* 3. SHORT_TEXT / LONG_TEXT */}
          {["SHORT_TEXT", "LONG_TEXT"].includes(question.type) && (
            <div className="p-4 bg-[#FAFAFA] border border-gray-200 rounded-xl text-[16px] text-gray-500 italic">
              {question.type === "SHORT_TEXT" ? "Format isian jawaban singkat (1 baris teks)." : "Format isian jawaban panjang (uraian/textarea)."}
            </div>
          )}
        </div>
      </div>

      {/* Tombol Navigasi Kembali */}
      <div className="pt-2">
        <Link href="/admin/soal" className="inline-flex items-center justify-center px-6 py-2.5 border border-gray-200 text-[#002045] text-[14px] font-medium rounded-xl hover:bg-gray-50 bg-white transition-all shadow-xs">
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
        </Link>
      </div>
    </div>
  );
}
