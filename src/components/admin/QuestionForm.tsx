"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QuestionType, QuestionStatus } from "@prisma/client";
import { createQuestion, updateQuestion, getNextQuestionCode, QuestionInput } from "@/app/admin/soal/actions";
import { Plus, Trash2, ChevronDown } from "lucide-react";

interface QuestionFormProps {
  initialData?: {
    id: string;
    code?: string;
    questionText: string;
    dimension: string;
    type: QuestionType;
    status: QuestionStatus;
    scaleMin?: number | null;
    scaleMax?: number | null;
    scaleMinLabel?: string | null;
    scaleMaxLabel?: string | null;
    options?: { label?: string | null; text: string; score: number }[];
  };
  dimensionsList?: string[];
  isEdit?: boolean;
  isViewOnly?: boolean;
}

export default function QuestionForm({ initialData, dimensionsList = [], isEdit = false, isViewOnly = false }: QuestionFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // ID Soal State
  const [questionCode, setQuestionCode] = useState<string>(initialData?.code || "");

  // Form States
  const [questionText, setQuestionText] = useState(initialData?.questionText || "");
  const [dimension, setDimension] = useState(initialData?.dimension || "");
  const [type, setType] = useState<QuestionType | "">(initialData?.type || "");
  const [status, setStatus] = useState<QuestionStatus>(initialData?.status || "ACTIVE");

  // Options State (Multiple Choice / Checkbox / Dropdown)
  const [options, setOptions] = useState<{ label: string; text: string; score: number }[]>(
    initialData?.options && initialData.options.length > 0
      ? initialData.options.map((o) => ({
          label: o.label || "",
          text: o.text,
          score: o.score,
        }))
      : [{ label: "A", text: "", score: 0 }],
  );

  // Scale States (Skala 1 - 5)
  const [scaleMin, setScaleMin] = useState(initialData?.scaleMin || 1);
  const [scaleMax, setScaleMax] = useState(Math.min(initialData?.scaleMax || 5, 5));
  const [scaleMinLabel, setScaleMinLabel] = useState(initialData?.scaleMinLabel || "Sangat Tidak Setuju");
  const [scaleMaxLabel, setScaleMaxLabel] = useState(initialData?.scaleMaxLabel || "Sangat Setuju");

  // State Nilai/Skor khusus Tipe Scale (1 - 5)
  const [scaleScores, setScaleScores] = useState<Record<number, number | string>>(() => {
    const scores: Record<number, number | string> = {};
    if (initialData?.type === "SCALE" && initialData?.options && initialData.options.length > 0) {
      initialData.options.forEach((opt, idx) => {
        const num = idx + (initialData.scaleMin || 1);
        scores[num] = opt.score;
      });
    } else {
      for (let i = 1; i <= 5; i++) {
        scores[i] = 0;
      }
    }
    return scores;
  });

  // Ambil ID Soal Otomatis saat mode Tambah
  useEffect(() => {
    async function fetchCode() {
      if (!initialData?.code) {
        const nextCode = await getNextQuestionCode();
        setQuestionCode(nextCode);
      }
    }
    fetchCode();
  }, [initialData?.code]);

  // Helper update rentang skor skala
  const updateScaleScoresRange = (min: number, max: number) => {
    setScaleScores((prev) => {
      const updated = { ...prev };
      for (let i = min; i <= max; i++) {
        if (updated[i] === undefined) {
          updated[i] = 0;
        }
      }
      return updated;
    });
  };

  const handleOptionChange = (index: number, field: "text" | "score", value: string | number) => {
    if (isViewOnly) return;
    const updated = [...options];
    updated[index] = { ...updated[index], [field]: value };
    setOptions(updated);
  };

  const addOption = () => {
    if (isViewOnly) return;
    const newOptions = [...options, { label: "", text: "", score: 0 }];
    const reindexed = newOptions.map((opt, i) => ({
      ...opt,
      label: type === "MULTIPLE_CHOICE" ? String.fromCharCode(65 + i) : type === "DROPDOWN" ? (i + 1).toString() : "",
    }));
    setOptions(reindexed);
  };

  const removeOption = (index: number) => {
    if (isViewOnly) return;
    const filtered = options.filter((_, i) => i !== index);
    const reindexed = filtered.map((opt, i) => ({
      ...opt,
      label: type === "MULTIPLE_CHOICE" ? String.fromCharCode(65 + i) : type === "DROPDOWN" ? (i + 1).toString() : "",
    }));
    setOptions(reindexed);
  };

  const handleSubmit = async (targetStatus: QuestionStatus) => {
    if (isViewOnly) return;

    if (!questionText.trim() || !dimension) {
      alert("Harap isi pertanyaan dan dimensi kompetensi.");
      return;
    }

    if (!type) {
      alert("Harap pilih jenis jawaban terlebih dahulu.");
      return;
    }

    setLoading(true);

    let finalOptions = ["MULTIPLE_CHOICE", "CHECKBOX", "DROPDOWN"].includes(type)
      ? options.map((opt, i) => ({
          ...opt,
          label: type === "MULTIPLE_CHOICE" ? String.fromCharCode(65 + i) : type === "DROPDOWN" ? (i + 1).toString() : "",
        }))
      : [];

    if (type === "SCALE") {
      finalOptions = [];
      for (let i = scaleMin; i <= scaleMax; i++) {
        const rawScore = scaleScores[i];
        const parsedScore = typeof rawScore === "number" ? rawScore : parseInt(rawScore as string, 10) || 0;

        finalOptions.push({
          label: i.toString(),
          text: i === scaleMin ? scaleMinLabel : i === scaleMax ? scaleMaxLabel : `Nilai ${i}`,
          score: parsedScore,
        });
      }
    }

    const payload: QuestionInput = {
      code: questionCode,
      questionText: questionText.trim(),
      dimension,
      type: type as QuestionType,
      status: targetStatus,
      options: finalOptions,
      scaleMin: type === "SCALE" ? scaleMin : undefined,
      scaleMax: type === "SCALE" ? scaleMax : undefined,
      scaleMinLabel: type === "SCALE" ? scaleMinLabel : undefined,
      scaleMaxLabel: type === "SCALE" ? scaleMaxLabel : undefined,
    };

    try {
      if (isEdit && initialData?.id) {
        await updateQuestion(initialData.id, payload);
      } else {
        await createQuestion(payload);
      }
      router.push("/admin/soal");
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan pertanyaan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Kolom Kiri: Form Utama */}
      <div className="lg:col-span-8 space-y-6">
        {/* Card 1: Pertanyaan */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
          <h2 className="font-semibold text-lg text-[#002045]">Pertanyaan</h2>

          {/* ID SOAL */}
          <div>
            <label className="block text-[14px] font-normal text-[#6B7280] mb-2">
              ID <span className="text-red-500">*</span>
            </label>
            <input type="text" readOnly value={questionCode || "Memuat ID..."} className="w-full p-3 text-[16px] bg-gray-50 border border-gray-200 rounded-xl text-gray-400 font-medium cursor-not-allowed focus:outline-none" />
          </div>

          {/* Teks Pertanyaan */}
          <div>
            <label className="block text-[14px] font-normal text-[#6B7280] mb-2">
              Pertanyaan <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              disabled={isViewOnly}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Ketikkan teks pertanyaan assessment di sini..."
              className="w-full p-3.5 text-[16px] bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#006A61] resize-none placeholder:text-gray-400 placeholder:text-[16px] disabled:bg-gray-50 disabled:cursor-not-allowed text-[#1E1E1E]"
            />
          </div>

          {/* Dimensi Kompetensi */}
          <div>
            <label className="block text-[14px] font-normal text-[#6B7280] mb-2">
              Dimensi Kompetensi <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                disabled={isViewOnly}
                value={dimension}
                onChange={(e) => setDimension(e.target.value)}
                className={`w-full appearance-none p-3 text-[16px] bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#006A61] disabled:bg-gray-50 disabled:cursor-not-allowed cursor-pointer ${
                  !dimension ? "text-gray-400" : "text-[#1E1E1E]"
                }`}
              >
                <option value="" disabled className="text-gray-400">
                  Pilih Dimensi Kompetensi
                </option>
                {dimensionsList.map((d) => (
                  <option key={d} value={d} className="text-[#1E1E1E]">
                    {d}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Card 2: Jenis Jawaban */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
          <h2 className="font-semibold text-lg text-[#002045]">Jenis Jawaban</h2>

          <div>
            <label className="block text-[14px] font-normal text-[#6B7280] mb-2">
              Jenis Jawaban <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                disabled={isViewOnly}
                value={type}
                onChange={(e) => {
                  const selectedType = e.target.value as QuestionType;
                  setType(selectedType);
                  if (selectedType === "MULTIPLE_CHOICE") {
                    setOptions([{ label: "A", text: "", score: 0 }]);
                  } else if (selectedType === "DROPDOWN") {
                    setOptions([{ label: "1", text: "", score: 0 }]);
                  } else if (selectedType === "CHECKBOX") {
                    setOptions([{ label: "", text: "", score: 0 }]);
                  } else if (selectedType === "SCALE") {
                    updateScaleScoresRange(scaleMin, scaleMax);
                  }
                }}
                className={`w-full appearance-none p-3 text-[16px] bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#006A61] disabled:bg-gray-50 disabled:cursor-not-allowed cursor-pointer ${
                  !type ? "text-gray-400" : "text-[#1E1E1E]"
                }`}
              >
                <option value="" disabled className="text-gray-400">
                  Pilih Jenis Jawaban
                </option>
                <option value="MULTIPLE_CHOICE" className="text-[#1E1E1E]">
                  Multiple Choice
                </option>
                <option value="CHECKBOX" className="text-[#1E1E1E]">
                  Checkbox
                </option>
                <option value="DROPDOWN" className="text-[#1E1E1E]">
                  Dropdown
                </option>
                <option value="SCALE" className="text-[#1E1E1E]">
                  Scale (Linear Scale)
                </option>
                <option value="SHORT_TEXT" className="text-[#1E1E1E]">
                  Short Text
                </option>
                <option value="LONG_TEXT" className="text-[#1E1E1E]">
                  Long Text
                </option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* 1. MULTIPLE CHOICE / CHECKBOX / DROPDOWN */}
          {["MULTIPLE_CHOICE", "CHECKBOX", "DROPDOWN"].includes(type) && (
            <div className="space-y-4 pt-2 border-t border-gray-100 animate-in fade-in duration-150">
              <div className="flex justify-between items-center text-[14px] font-semibold text-[#64748B]">
                <span>Teks Jawaban</span>
                <span>Skor/Value</span>
              </div>

              {options.map((opt, index) => {
                const currentLabel = type === "MULTIPLE_CHOICE" ? String.fromCharCode(65 + index) : type === "DROPDOWN" ? (index + 1).toString() : "";

                return (
                  <div key={index} className="flex items-center gap-3">
                    {type === "CHECKBOX" && (
                      <div className="w-10 h-11 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center shrink-0">
                        <div className="w-4 h-4 rounded border border-gray-300 bg-white" />
                      </div>
                    )}

                    {["MULTIPLE_CHOICE", "DROPDOWN"].includes(type) && <span className="w-10 h-11 rounded-xl bg-[#E6F0F0] text-[#006A61] font-bold text-[14px] flex items-center justify-center shrink-0">{currentLabel}</span>}

                    <input
                      type="text"
                      disabled={isViewOnly}
                      value={opt.text}
                      onChange={(e) => handleOptionChange(index, "text", e.target.value)}
                      placeholder={`Masukan Opsi ${index + 1}`}
                      className="flex-1 p-3 text-[16px] bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#006A61] placeholder:text-gray-400 placeholder:text-[16px] disabled:bg-gray-50 text-[#1E1E1E]"
                    />

                    <input
                      type="number"
                      disabled={isViewOnly}
                      value={opt.score}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => handleOptionChange(index, "score", parseInt(e.target.value) || 0)}
                      className="w-20 p-3 text-[16px] bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#006A61] text-center font-bold text-[#002045] disabled:bg-gray-50"
                    />

                    {!isViewOnly && options.length > 1 && (
                      <button type="button" onClick={() => removeOption(index)} className="p-2 text-gray-300 hover:text-rose-500 transition-colors cursor-pointer" title="Hapus Opsi">
                        <Trash2 className="w-[22px] h-[22px]" />
                      </button>
                    )}
                  </div>
                );
              })}

              {!isViewOnly && (
                <button type="button" onClick={addOption} className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#006A61] hover:underline pt-2 cursor-pointer">
                  <Plus className="w-4 h-4" /> Tambah Opsi Jawaban
                </button>
              )}
            </div>
          )}

          {/* 2. SCALE (LINEAR SCALE) */}
          {type === "SCALE" && (
            <div className="space-y-6 pt-2 animate-in fade-in duration-150">
              {/* Row Skala Min */}
              <div className="space-y-1.5">
                <label className="block text-[14px] font-normal text-[#6B7280]">Skala Min</label>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    disabled={isViewOnly}
                    value={scaleMin}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      const newMin = Math.max(1, Math.min(val, scaleMax));
                      setScaleMin(newMin);
                      updateScaleScoresRange(newMin, scaleMax);
                    }}
                    className="w-16 p-3 text-center text-[16px] font-bold border border-gray-200 rounded-xl focus:outline-none focus:border-[#006A61] text-[#002045] disabled:bg-gray-50"
                  />
                  <input
                    type="text"
                    disabled={isViewOnly}
                    value={scaleMinLabel}
                    onChange={(e) => setScaleMinLabel(e.target.value)}
                    placeholder="Sangat Tidak Setuju"
                    className="flex-1 p-3 text-[16px] bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#006A61] placeholder:text-gray-400 text-[#1E1E1E]"
                  />
                </div>
              </div>

              {/* Row Skala Max */}
              <div className="space-y-1.5">
                <label className="block text-[14px] font-normal text-[#6B7280]">Skala Max</label>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    disabled={isViewOnly}
                    max={5}
                    value={scaleMax}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 5;
                      const newMax = Math.min(Math.max(val, scaleMin), 5);
                      setScaleMax(newMax);
                      updateScaleScoresRange(scaleMin, newMax);
                    }}
                    className="w-16 p-3 text-center text-[16px] font-bold border border-gray-200 rounded-xl focus:outline-none focus:border-[#006A61] text-[#002045] disabled:bg-gray-50"
                  />
                  <input
                    type="text"
                    disabled={isViewOnly}
                    value={scaleMaxLabel}
                    onChange={(e) => setScaleMaxLabel(e.target.value)}
                    placeholder="Sangat Setuju"
                    className="flex-1 p-3 text-[16px] bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#006A61] placeholder:text-gray-400 text-[#1E1E1E]"
                  />
                </div>
              </div>

              {/* Value Input Grid */}
              <div className="space-y-2 pt-2">
                <label className="block text-[14px] font-normal text-[#6B7280]">Value (Skor Per Skala)</label>
                <div className="grid grid-cols-5 gap-3">
                  {Array.from({ length: scaleMax - scaleMin + 1 }, (_, idx) => scaleMin + idx).map((scaleNum) => (
                    <div key={scaleNum} className="flex flex-col items-center gap-1.5">
                      <input
                        type="number"
                        disabled={isViewOnly}
                        value={scaleScores[scaleNum] !== undefined ? scaleScores[scaleNum] : 0}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => {
                          const val = e.target.value === "" ? "" : parseInt(e.target.value, 10);
                          setScaleScores((prev) => ({
                            ...prev,
                            [scaleNum]: isNaN(val as number) ? "" : val,
                          }));
                        }}
                        onBlur={() => {
                          if (scaleScores[scaleNum] === "" || scaleScores[scaleNum] === undefined) {
                            setScaleScores((prev) => ({ ...prev, [scaleNum]: 0 }));
                          }
                        }}
                        className="w-full p-3 text-center text-[16px] font-bold border border-gray-200 rounded-xl focus:outline-none focus:border-[#006A61] text-[#002045] disabled:bg-gray-50"
                      />
                      <span className="text-[12px] text-gray-400 font-medium">Skala {scaleNum}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. SHORT TEXT & LONG TEXT */}
          {["SHORT_TEXT", "LONG_TEXT"].includes(type) && (
            <div className="p-4 bg-gray-50 border border-dashed border-gray-200 rounded-xl text-center text-[14px] text-[#64748B] animate-in fade-in duration-150">
              {type === "SHORT_TEXT" ? "Peserta akan mengisi jawaban isian singkat (1 baris teks)." : "Peserta akan mengisi jawaban deskripsi/uraian panjang (paragraf)."}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 pt-2">
          {!isViewOnly ? (
            <>
              <button
                type="button"
                disabled={loading}
                onClick={() => handleSubmit(status)}
                className="px-6 py-3 bg-[#002045] text-white text-[14px] font-semibold rounded-xl hover:bg-[#001833] transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
              >
                {isEdit ? "Simpan Perubahan" : "Publikasi"}
              </button>

              <button type="button" disabled={loading} onClick={() => handleSubmit("DRAFT")} className="px-6 py-3 border border-gray-200 text-[#002045] text-[14px] font-semibold rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                Simpan Draf
              </button>
            </>
          ) : null}

          <button type="button" onClick={() => router.push("/admin/soal")} className="px-6 py-3 border border-gray-200 text-[#64748B] text-[14px] font-semibold rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
            {isViewOnly ? "Kembali" : "Batal"}
          </button>
        </div>
      </div>

      {/* Kolom Kanan: Sidebar Status Toggle */}
      <div className="lg:col-span-4">
        <div className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
          <h3 className="font-semibold text-lg text-[#002045]">Status</h3>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[16px] font-normal text-[#1E1E1E]">{status === "ACTIVE" ? "Active" : "Inactive"}</span>

            <button
              type="button"
              disabled={isViewOnly}
              onClick={() => !isViewOnly && setStatus(status === "ACTIVE" ? "INACTIVE" : "ACTIVE")}
              className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors cursor-pointer ${status === "ACTIVE" ? "bg-[#006A61]" : "bg-gray-300"} ${isViewOnly ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${status === "ACTIVE" ? "translate-x-7" : "translate-x-1"}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
