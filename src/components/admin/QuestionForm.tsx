"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { QuestionType, QuestionStatus } from "@prisma/client";
import { createQuestion, updateQuestion, QuestionInput } from "@/app/admin/soal/actions";
import { Plus, Trash2 } from "lucide-react";

interface QuestionFormProps {
  initialData?: {
    id: string;
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
  isEdit?: boolean;
  isViewOnly?: boolean;
}

const dimensionsList = [
  "Civic Competence",
  "Professionalisme Reflektif",
  "Identitas Pedagogik",
  "Professional Agency",
  "Civic Disposition",
  "Digital Citizenship Pedagogy",
  "Civic Skills",
  "Community of Practice",
  "Komitmen Demokratis",
  "Penguasaan Materi",
];

export default function QuestionForm({ initialData, isEdit = false, isViewOnly = false }: QuestionFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form States
  const [questionText, setQuestionText] = useState(initialData?.questionText || "");
  const [dimension, setDimension] = useState(initialData?.dimension || "");

  // Type State (Jika mode tambah baru, nilainya diawali string kosong "")
  const [type, setType] = useState<QuestionType | "">(initialData?.type || "");
  const [status, setStatus] = useState<QuestionStatus>(initialData?.status || "ACTIVE");

  // Options State (Default Skor 0)
  const [options, setOptions] = useState<{ label: string; text: string; score: number }[]>(
    initialData?.options && initialData.options.length > 0 ? initialData.options.map((o) => ({ label: o.label || "", text: o.text, score: o.score })) : [{ label: "A", text: "", score: 0 }],
  );

  // Scale States
  const [scaleMin, setScaleMin] = useState(initialData?.scaleMin || 1);
  const [scaleMax, setScaleMax] = useState(initialData?.scaleMax || 5);
  const [scaleMinLabel, setScaleMinLabel] = useState(initialData?.scaleMinLabel || "Sangat Tidak Setuju");
  const [scaleMaxLabel, setScaleMaxLabel] = useState(initialData?.scaleMaxLabel || "Sangat Setuju");

  // Handler Option Change
  const handleOptionChange = (index: number, field: "text" | "score", value: string | number) => {
    if (isViewOnly) return;
    const updated = [...options];
    updated[index] = { ...updated[index], [field]: value };
    setOptions(updated);
  };

  // Tambah Opsi Jawaban Baru dengan Re-indexing
  const addOption = () => {
    if (isViewOnly) return;
    const newOptions = [...options, { label: "", text: "", score: 0 }];
    const reindexed = newOptions.map((opt, i) => ({
      ...opt,
      label: type === "MULTIPLE_CHOICE" ? String.fromCharCode(65 + i) : (i + 1).toString(),
    }));
    setOptions(reindexed);
  };

  // Hapus Opsi Jawaban & Auto Re-index
  const removeOption = (index: number) => {
    if (isViewOnly) return;
    const filtered = options.filter((_, i) => i !== index);
    const reindexed = filtered.map((opt, i) => ({
      ...opt,
      label: type === "MULTIPLE_CHOICE" ? String.fromCharCode(65 + i) : (i + 1).toString(),
    }));
    setOptions(reindexed);
  };

  const handleSubmit = async (targetStatus: QuestionStatus) => {
    if (isViewOnly) return;

    if (!questionText || !dimension) {
      alert("Harap isi pertanyaan dan dimensi kompetensi.");
      return;
    }

    if (!type) {
      alert("Harap pilih jenis jawaban terlebih dahulu.");
      return;
    }

    setLoading(true);

    const formattedOptions = options.map((opt, i) => ({
      ...opt,
      label: type === "MULTIPLE_CHOICE" ? String.fromCharCode(65 + i) : (i + 1).toString(),
    }));

    const payload: QuestionInput = {
      questionText,
      dimension,
      type: type as QuestionType,
      status: targetStatus,
      options: ["MULTIPLE_CHOICE", "CHECKBOX", "DROPDOWN"].includes(type) ? formattedOptions : [],
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
      {/* Form Utama (Kiri) */}
      <div className="lg:col-span-8 space-y-6">
        {/* Card Pertanyaan */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs space-y-5">
          <h2 className="font-bold text-lg text-[#002045]">Pertanyaan</h2>

          <div>
            <label className="block text-xs font-semibold text-[#002045] mb-2">Pertanyaan</label>
            <textarea
              rows={4}
              disabled={isViewOnly}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Ketikkan teks pertanyaan assessment di sini..."
              className="w-full p-3.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#006A61] resize-none placeholder:text-gray-300 disabled:bg-gray-50 disabled:text-gray-600 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#002045] mb-2">Dimensi Kompetensi</label>
            <select
              disabled={isViewOnly}
              value={dimension}
              onChange={(e) => setDimension(e.target.value)}
              className="w-full p-3 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#006A61] text-[#1E1E1E] disabled:bg-gray-50 disabled:text-gray-600 disabled:cursor-not-allowed"
            >
              <option value="" disabled>
                Pilih Dimensi Kompetensi
              </option>
              {dimensionsList.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Card Jenis Jawaban Dynamic */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs space-y-5">
          <h2 className="font-bold text-lg text-[#002045]">Jenis Jawaban</h2>

          <div>
            <label className="block text-xs font-semibold text-[#002045] mb-2">Jenis Jawaban</label>
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
                }
              }}
              className={`w-full p-3 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#006A61] disabled:bg-gray-50 disabled:text-gray-600 disabled:cursor-not-allowed ${
                !type ? "text-gray-400" : "text-[#1E1E1E]"
              }`}
            >
              <option value="" disabled>
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
          </div>

          {/* DYNAMIC FORM RENDER BERDASARKAN JENIS JAWABAN */}

          {/* 1. MULTIPLE CHOICE / CHECKBOX / DROPDOWN */}
          {["MULTIPLE_CHOICE", "CHECKBOX", "DROPDOWN"].includes(type) && (
            <div className="space-y-4 pt-2 border-t border-gray-100 animate-in fade-in duration-150">
              <div className="flex justify-between items-center text-xs font-semibold text-[#002045]">
                <span>Teks Jawaban</span>
                <span>Skor/Value</span>
              </div>

              {options.map((opt, index) => {
                const currentLabel = type === "MULTIPLE_CHOICE" ? String.fromCharCode(65 + index) : type === "DROPDOWN" ? (index + 1).toString() : "";

                return (
                  <div key={index} className="flex items-center gap-3">
                    {/* DROPDOWN */}
                    {type === "DROPDOWN" && <span className="w-8 h-8 rounded-lg bg-[#E6F0F0] text-[#006A61] font-bold text-xs flex items-center justify-center shrink-0">{currentLabel}</span>}

                    {/* CHECKBOX */}
                    {type === "CHECKBOX" && (
                      <div className="w-8 h-8 rounded-xl border border-gray-200 bg-white flex items-center justify-center shrink-0">
                        <div className="w-4 h-4 rounded-sm border border-gray-300" />
                      </div>
                    )}

                    {/* MULTIPLE CHOICE */}
                    {type === "MULTIPLE_CHOICE" && <span className="w-8 h-8 rounded-lg bg-[#E6F0F0] text-[#006A61] font-bold text-xs flex items-center justify-center shrink-0">{currentLabel}</span>}

                    {/* Input Teks Opsi Jawaban */}
                    <input
                      type="text"
                      disabled={isViewOnly}
                      value={opt.text}
                      onChange={(e) => handleOptionChange(index, "text", e.target.value)}
                      placeholder={`Masukan Opsi ${index + 1}`}
                      className="flex-1 p-2.5 text-sm bg-white border border-gray-200/80 rounded-xl focus:outline-none focus:border-[#006A61] placeholder:text-gray-300 disabled:bg-gray-50 disabled:text-gray-600 disabled:cursor-not-allowed"
                    />

                    {/* Input Skor/Value */}
                    <input
                      type="number"
                      disabled={isViewOnly}
                      value={opt.score}
                      onChange={(e) => handleOptionChange(index, "score", parseInt(e.target.value) || 0)}
                      className="w-20 p-2.5 text-sm bg-white border border-gray-200/80 rounded-xl focus:outline-none focus:border-[#006A61] text-center font-semibold text-[#002045] disabled:bg-gray-50 disabled:text-gray-600 disabled:cursor-not-allowed"
                    />

                    {/* Tombol Hapus Opsi (Sembunyi saat View Only) */}
                    {!isViewOnly && options.length > 1 && (
                      <button type="button" onClick={() => removeOption(index)} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}

              {/* Tombol Tambah Opsi (Sembunyi saat View Only) */}
              {!isViewOnly && (
                <button type="button" onClick={addOption} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#006A61] hover:underline pt-2">
                  <Plus className="w-4 h-4" /> Tambah Opsi Jawaban
                </button>
              )}
            </div>
          )}

          {/* 2. SCALE (Skala Likert) */}
          {type === "SCALE" && (
            <div className="space-y-4 pt-2 border-t border-gray-100 animate-in fade-in duration-150">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#002045] mb-1">Skala Min (Awal)</label>
                  <input
                    type="number"
                    disabled={isViewOnly}
                    value={scaleMin}
                    onChange={(e) => setScaleMin(parseInt(e.target.value) || 1)}
                    className="w-full p-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#006A61] disabled:bg-gray-50 disabled:text-gray-600 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#002045] mb-1">Skala Max (Akhir)</label>
                  <input
                    type="number"
                    disabled={isViewOnly}
                    value={scaleMax}
                    onChange={(e) => setScaleMax(parseInt(e.target.value) || 5)}
                    className="w-full p-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#006A61] disabled:bg-gray-50 disabled:text-gray-600 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#002045] mb-1">Label Batas Bawah</label>
                  <input
                    type="text"
                    disabled={isViewOnly}
                    value={scaleMinLabel}
                    onChange={(e) => setScaleMinLabel(e.target.value)}
                    placeholder="Misal: Sangat Tidak Setuju"
                    className="w-full p-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#006A61] disabled:bg-gray-50 disabled:text-gray-600 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#002045] mb-1">Label Batas Atas</label>
                  <input
                    type="text"
                    disabled={isViewOnly}
                    value={scaleMaxLabel}
                    onChange={(e) => setScaleMaxLabel(e.target.value)}
                    placeholder="Misal: Sangat Setuju"
                    className="w-full p-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#006A61] disabled:bg-gray-50 disabled:text-gray-600 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 3. SHORT TEXT & LONG TEXT */}
          {["SHORT_TEXT", "LONG_TEXT"].includes(type) && (
            <div className="p-4 bg-gray-50 border border-dashed border-gray-200 rounded-xl text-center text-xs text-[#64748B] animate-in fade-in duration-150">
              {type === "SHORT_TEXT" ? "Peserta akan mengisi jawaban isian singkat (1 baris)." : "Peserta akan mengisi jawaban deskripsi/uraian panjang (paragraf)."}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 pt-2">
          {isViewOnly ? (
            <button type="button" onClick={() => router.push(`/admin/soal/edit/${initialData?.id}`)} className="px-6 py-3 bg-[#002045] text-white text-xs font-semibold rounded-xl hover:bg-[#001833] transition-colors">
              Edit Pertanyaan Ini
            </button>
          ) : (
            <>
              <button type="button" disabled={loading} onClick={() => handleSubmit(status)} className="px-6 py-3 bg-[#002045] text-white text-xs font-semibold rounded-xl hover:bg-[#001833] transition-colors disabled:opacity-50">
                {isEdit ? "Simpan Perubahan" : "Publikasi"}
              </button>

              <button type="button" disabled={loading} onClick={() => handleSubmit("DRAFT")} className="px-6 py-3 border border-gray-200 text-[#002045] text-xs font-semibold rounded-xl hover:bg-gray-50 transition-colors">
                Simpan Draf
              </button>
            </>
          )}

          <button type="button" onClick={() => router.push("/admin/soal")} className="px-6 py-3 border border-gray-200 text-[#64748B] text-xs font-semibold rounded-xl hover:bg-gray-50 transition-colors">
            {isViewOnly ? "Kembali" : "Batal"}
          </button>
        </div>
      </div>

      {/* Sidebar Status (Kanan) */}
      <div className="lg:col-span-4">
        <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-[#002045]">Status</h3>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-semibold text-[#1E1E1E]">{status === "ACTIVE" ? "Active" : "Inactive"}</span>

            {/* Toggle Switch Button */}
            <button
              type="button"
              disabled={isViewOnly}
              onClick={() => !isViewOnly && setStatus(status === "ACTIVE" ? "INACTIVE" : "ACTIVE")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${status === "ACTIVE" ? "bg-[#006A61]" : "bg-gray-300"} ${isViewOnly ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${status === "ACTIVE" ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
