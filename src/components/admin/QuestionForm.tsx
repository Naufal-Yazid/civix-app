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

export default function QuestionForm({ initialData, isEdit = false }: QuestionFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form States
  const [questionText, setQuestionText] = useState(initialData?.questionText || "");
  const [dimension, setDimension] = useState(initialData?.dimension || "");
  const [type, setType] = useState<QuestionType>(initialData?.type || "MULTIPLE_CHOICE");
  const [status, setStatus] = useState<QuestionStatus>(initialData?.status || "ACTIVE");

  // Options State (Multiple Choice, Checkbox, Dropdown)
  const [options, setOptions] = useState<{ label: string; text: string; score: number }[]>(
    initialData?.options
      ? initialData.options.map((o) => ({ label: o.label || "", text: o.text, score: o.score }))
      : [
          { label: "A", text: "", score: 4 },
          { label: "B", text: "", score: 3 },
          { label: "C", text: "", score: 2 },
          { label: "D", text: "", score: 1 },
        ],
  );

  // Scale States
  const [scaleMin, setScaleMin] = useState(initialData?.scaleMin || 1);
  const [scaleMax, setScaleMax] = useState(initialData?.scaleMax || 5);
  const [scaleMinLabel, setScaleMinLabel] = useState(initialData?.scaleMinLabel || "Sangat Tidak Setuju");
  const [scaleMaxLabel, setScaleMaxLabel] = useState(initialData?.scaleMaxLabel || "Sangat Setuju");

  // Handler Options
  const handleOptionChange = (index: number, field: "text" | "score", value: string | number) => {
    const updated = [...options];
    updated[index] = { ...updated[index], [field]: value };
    setOptions(updated);
  };

  const addOption = () => {
    const nextChar = String.fromCharCode(65 + options.length); // Auto label A, B, C, D, E...
    setOptions([...options, { label: nextChar, text: "", score: 1 }]);
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleSubmit = async (targetStatus: QuestionStatus) => {
    if (!questionText || !dimension) {
      alert("Harap isi pertanyaan dan dimensi kompetensi.");
      return;
    }

    setLoading(true);

    const payload: QuestionInput = {
      questionText,
      dimension,
      type,
      status: targetStatus,
      options: ["MULTIPLE_CHOICE", "CHECKBOX", "DROPDOWN"].includes(type) ? options : [],
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
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-5">
          <h2 className="font-bold text-lg text-[#002045]">Pertanyaan</h2>

          <div>
            <label className="block text-xs font-semibold text-[#002045] mb-2">Pertanyaan</label>
            <textarea
              rows={4}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Ketikkan teks pertanyaan assessment di sini..."
              className="w-full p-3 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#006A61] resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#002045] mb-2">Dimensi Kompetensi</label>
            <select value={dimension} onChange={(e) => setDimension(e.target.value)} className="w-full p-3 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#006A61] text-[#1E1E1E]">
              <option value="">Pilih Dimensi Kompetensi</option>
              {dimensionsList.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Card Jenis Jawaban Dynamic */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-5">
          <h2 className="font-bold text-lg text-[#002045]">Jenis Jawaban</h2>

          <div>
            <label className="block text-xs font-semibold text-[#002045] mb-2">Jenis Jawaban</label>
            <select value={type} onChange={(e) => setType(e.target.value as QuestionType)} className="w-full p-3 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#006A61] text-[#1E1E1E]">
              <option value="MULTIPLE_CHOICE">Multiple Choice</option>
              <option value="CHECKBOX">Checkbox (Multiple Select)</option>
              <option value="DROPDOWN">Dropdown</option>
              <option value="SCALE">Scale (Linear Scale)</option>
              <option value="SHORT_TEXT">Short Text</option>
              <option value="LONG_TEXT">Long Text</option>
            </select>
          </div>

          {/* DYNAMIC FORM RENDER BERDASARKAN JENIS JAWABAN */}

          {/* 1. MULTIPLE CHOICE / CHECKBOX / DROPDOWN */}
          {["MULTIPLE_CHOICE", "CHECKBOX", "DROPDOWN"].includes(type) && (
            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center text-xs font-semibold text-[#002045]">
                <span>Teks Jawaban</span>
                <span>Skor/Value</span>
              </div>

              {options.map((opt, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-teal-50 text-[#006A61] font-bold text-xs flex items-center justify-center shrink-0">{opt.label || index + 1}</span>

                  <input
                    type="text"
                    value={opt.text}
                    onChange={(e) => handleOptionChange(index, "text", e.target.value)}
                    placeholder={`Masukkan opsi jawaban ${opt.label}...`}
                    className="flex-1 p-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#006A61]"
                  />

                  <input
                    type="number"
                    value={opt.score}
                    onChange={(e) => handleOptionChange(index, "score", parseInt(e.target.value) || 0)}
                    className="w-20 p-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#006A61] text-center"
                  />

                  {options.length > 2 && (
                    <button type="button" onClick={() => removeOption(index)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}

              <button type="button" onClick={addOption} className="inline-flex items-center gap-2 text-xs font-semibold text-[#006A61] hover:underline pt-2">
                <Plus className="w-4 h-4" /> Tambah Opsi Jawaban
              </button>
            </div>
          )}

          {/* 2. SCALE (Skala Likert) */}
          {type === "SCALE" && (
            <div className="space-y-4 pt-2 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#002045] mb-1">Skala Min (Awal)</label>
                  <input type="number" value={scaleMin} onChange={(e) => setScaleMin(parseInt(e.target.value) || 1)} className="w-full p-2.5 text-sm border rounded-xl" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#002045] mb-1">Skala Max (Akhir)</label>
                  <input type="number" value={scaleMax} onChange={(e) => setScaleMax(parseInt(e.target.value) || 5)} className="w-full p-2.5 text-sm border rounded-xl" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#002045] mb-1">Label Batas Bawah</label>
                  <input type="text" value={scaleMinLabel} onChange={(e) => setScaleMinLabel(e.target.value)} placeholder="Misal: Sangat Tidak Setuju" className="w-full p-2.5 text-sm border rounded-xl" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#002045] mb-1">Label Batas Atas</label>
                  <input type="text" value={scaleMaxLabel} onChange={(e) => setScaleMaxLabel(e.target.value)} placeholder="Misal: Sangat Setuju" className="w-full p-2.5 text-sm border rounded-xl" />
                </div>
              </div>
            </div>
          )}

          {/* 3. SHORT TEXT & LONG TEXT */}
          {["SHORT_TEXT", "LONG_TEXT"].includes(type) && (
            <div className="p-4 bg-gray-50 border border-dashed border-gray-200 rounded-xl text-center text-xs text-[#64748B]">
              {type === "SHORT_TEXT" ? "Peserta akan mengisi jawaban isian singkat (1 baris)." : "Peserta akan mengisi jawaban deskripsi/uraian panjang (paragraf)."}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 pt-2">
          <button type="button" disabled={loading} onClick={() => handleSubmit(status)} className="px-6 py-3 bg-[#002045] text-white text-xs font-semibold rounded-xl hover:bg-[#001833] transition-colors disabled:opacity-50">
            {isEdit ? "Simpan Perubahan" : "Publikasi"}
          </button>

          <button type="button" disabled={loading} onClick={() => handleSubmit("DRAFT")} className="px-6 py-3 border border-gray-200 text-[#002045] text-xs font-semibold rounded-xl hover:bg-gray-50 transition-colors">
            Simpan Draf
          </button>

          <button type="button" onClick={() => router.push("/admin/soal")} className="px-6 py-3 border border-gray-200 text-[#64748B] text-xs font-semibold rounded-xl hover:bg-gray-50 transition-colors">
            Batal
          </button>
        </div>
      </div>

      {/* Sidebar Status (Kanan) */}
      <div className="lg:col-span-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-[#002045]">Status</h3>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-semibold text-[#1E1E1E]">Active</span>

            {/* Toggle Switch Button */}
            <button
              type="button"
              onClick={() => setStatus(status === "ACTIVE" ? "INACTIVE" : "ACTIVE")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${status === "ACTIVE" ? "bg-[#006A61]" : "bg-gray-300"}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${status === "ACTIVE" ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
