"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QuestionStatus } from "@prisma/client";
import { createLevel, updateLevel, checkScoreOverlap, getNextLevelCode, LevelInput } from "@/app/admin/parameter/level-actions";
import { CheckCircle2, AlertTriangle, ArrowLeft } from "lucide-react";

interface LevelFormProps {
  initialData?: {
    id: string;
    code: string;
    name: string;
    minScore: number;
    maxScore: number;
    status: QuestionStatus;
  };
  isEdit?: boolean;
  isViewOnly?: boolean;
}

export default function LevelForm({ initialData, isEdit = false, isViewOnly = false }: LevelFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // State ID Level
  const [levelCode, setLevelCode] = useState<string>(initialData?.code || "");
  const [name, setName] = useState(initialData?.name || "");
  const [minScore, setMinScore] = useState<number>(initialData?.minScore ?? 0);
  const [maxScore, setMaxScore] = useState<number>(initialData?.maxScore ?? 0);
  const [status, setStatus] = useState<QuestionStatus>(initialData?.status || "ACTIVE");

  const [activeThumb, setActiveThumb] = useState<"min" | "max">("max");

  const [validation, setValidation] = useState<{
    hasOverlap: boolean;
    message: string;
  } | null>(null);

  // Ambil ID otomatis saat pertama kali buka form Tambah Level
  useEffect(() => {
    async function fetchNextCode() {
      if (!initialData?.code) {
        const nextCode = await getNextLevelCode();
        setLevelCode(nextCode);
      }
    }
    fetchNextCode();
  }, [initialData?.code]);

  // Cek Validasi Overlap
  useEffect(() => {
    if (isViewOnly) return;
    async function runCheck() {
      const res = await checkScoreOverlap(minScore, maxScore, initialData?.id);
      setValidation(res);
    }
    runCheck();
  }, [minScore, maxScore, initialData?.id, isViewOnly]);

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    if (rawValue === "") {
      setMinScore(0);
      return;
    }
    const val = Math.min(Math.max(parseInt(rawValue, 10), 0), 100);
    setMinScore(val);
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    if (rawValue === "") {
      setMaxScore(0);
      return;
    }
    const val = Math.min(Math.max(parseInt(rawValue, 10), 0), 100);
    setMaxScore(val);
  };

  const handleMinSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setMinScore(val);
    setActiveThumb("min");
  };

  const handleMaxSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setMaxScore(val);
    setActiveThumb("max");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isViewOnly) return;

    if (!name.trim()) {
      alert("Harap masukkan Nama Level.");
      return;
    }

    if (minScore >= maxScore) {
      alert("Min Value harus lebih kecil dari Max Value.");
      return;
    }

    setLoading(true);

    const payload: LevelInput = {
      code: levelCode,
      name: name.trim(),
      minScore,
      maxScore,
      status,
    };

    try {
      if (isEdit && initialData?.id) {
        await updateLevel(initialData.id, payload);
      } else {
        await createLevel(payload);
      }
      router.push("/admin/parameter?tab=level");
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan level kompetensi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Form Utama (Kiri) */}
      <div className="lg:col-span-8 space-y-6">
        {/* Card 1: Level Info */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="font-semibold text-lg text-[#002045]">Level</h2>

          {isViewOnly ? (
            /* Mode View Detail */
            <div className="space-y-5">
              <div>
                <span className="text-[14px] font-medium text-[#64748B] block mb-1">ID</span>
                <span className="text-[16px] font-semibold text-[#002045]">{levelCode || "LVL001"}</span>
              </div>

              <div>
                <span className="text-[14px] font-medium text-[#64748B] block mb-1">Nama Level</span>
                <span className="text-[16px] font-normal text-[#1E1E1E]">{name || "-"}</span>
              </div>
            </div>
          ) : (
            /* Mode Form Tambah / Edit */
            <div className="space-y-5">
              <div>
                <label className="block text-[14px] font-normal text-[#6B7280] mb-2">
                  ID <span className="text-red-500">*</span>
                </label>
                <input type="text" readOnly value={levelCode || "Memuat ID..."} className="w-full p-3 text-[16px] bg-gray-50 border border-gray-200 rounded-xl text-gray-400 font-medium cursor-not-allowed focus:outline-none" />
              </div>

              <div>
                <label className="block text-[14px] font-normal text-[#6B7280] mb-2">
                  Nama Level <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama Level"
                  className="w-full p-3 text-[16px] bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#006A61] placeholder:text-gray-400 placeholder:text-[16px] text-[#1E1E1E]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Card 2: Rentang Skor */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="font-semibold text-lg text-[#002045]">Rentang Skor</h2>

          {isViewOnly ? (
            /* Mode View Detail */
            <div className="grid grid-cols-2 gap-8 pb-2">
              <div>
                <span className="text-[14px] font-medium text-[#64748B] block mb-1">Min Value</span>
                <span className="text-[16px] font-bold text-[#002045]">{minScore}%</span>
              </div>

              <div>
                <span className="text-[14px] font-medium text-[#64748B] block mb-1">Max Value</span>
                <span className="text-[16px] font-bold text-[#002045]">{maxScore}%</span>
              </div>
            </div>
          ) : (
            /* Mode Form Tambah / Edit Input */
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[14px] font-normal text-[#6B7280] mb-2">
                  Min Value <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={minScore}
                    onFocus={() => setActiveThumb("min")}
                    onChange={handleMinInputChange}
                    className={`w-full p-3 pr-8 text-[16px] bg-white border rounded-xl focus:outline-none font-medium text-[#1E1E1E] ${activeThumb === "min" ? "border-[#006A61] ring-1 ring-[#006A61]/20" : "border-gray-200"}`}
                  />
                  <span className="absolute right-3 text-[14px] text-gray-400 font-semibold pointer-events-none">%</span>
                </div>
              </div>

              <div>
                <label className="block text-[14px] font-normal text-[#6B7280] mb-2">
                  Max Value <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={maxScore}
                    onFocus={() => setActiveThumb("max")}
                    onChange={handleMaxInputChange}
                    className={`w-full p-3 pr-8 text-[16px] bg-white border rounded-xl focus:outline-none font-medium text-[#1E1E1E] ${activeThumb === "max" ? "border-[#006A61] ring-1 ring-[#006A61]/20" : "border-gray-200"}`}
                  />
                  <span className="absolute right-3 text-[14px] text-gray-400 font-semibold pointer-events-none">%</span>
                </div>
              </div>
            </div>
          )}

          {/* DUAL RANGE SLIDER TRACK */}
          <div className="pt-2 pb-2 space-y-4 px-1">
            <div className="relative w-full h-2 bg-gray-100 rounded-full flex items-center">
              <div
                className="absolute h-2 bg-[#002045] rounded-full pointer-events-none"
                style={{
                  left: `${Math.min(minScore, maxScore)}%`,
                  width: `${Math.abs(maxScore - minScore)}%`,
                }}
              />

              <input
                type="range"
                min="0"
                max="100"
                disabled={isViewOnly}
                value={minScore}
                onMouseDown={() => setActiveThumb("min")}
                onTouchStart={() => setActiveThumb("min")}
                onChange={handleMinSliderChange}
                className={`absolute w-full appearance-none bg-transparent pointer-events-none ${activeThumb === "min" ? "z-30" : "z-20"} ${
                  isViewOnly ? "[&::-webkit-slider-thumb]:cursor-default [&::-moz-range-thumb]:cursor-default" : "[&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:cursor-pointer"
                } [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#002045] [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#002045] [&::-moz-range-thumb]:shadow-md`}
              />

              <input
                type="range"
                min="0"
                max="100"
                disabled={isViewOnly}
                value={maxScore}
                onMouseDown={() => setActiveThumb("max")}
                onTouchStart={() => setActiveThumb("max")}
                onChange={handleMaxSliderChange}
                className={`absolute w-full appearance-none bg-transparent pointer-events-none ${activeThumb === "max" ? "z-30" : "z-20"} ${
                  isViewOnly ? "[&::-webkit-slider-thumb]:cursor-default [&::-moz-range-thumb]:cursor-default" : "[&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:cursor-pointer"
                } [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#002045] [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#002045] [&::-moz-range-thumb]:shadow-md`}
              />
            </div>

            <div className="flex justify-between text-[12px] font-medium text-gray-400 pt-1">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Kotak Pesan Validasi */}
          {!isViewOnly && validation && (
            <div
              className={`p-4 rounded-xl border flex items-start gap-3 text-xs leading-relaxed animate-in fade-in duration-200 ${
                validation.hasOverlap || minScore >= maxScore ? "bg-red-50 border-red-200/80 text-red-800" : "bg-emerald-50 border-emerald-200/80 text-emerald-800"
              }`}
            >
              {validation.hasOverlap || minScore >= maxScore ? <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" /> : <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />}
              <div>
                <span className="font-bold block mb-0.5">{validation.hasOverlap || minScore >= maxScore ? "Peringatan Validasi" : "Validasi Berhasil"}</span>
                {minScore >= maxScore ? "Min Value harus lebih kecil dari Max Value." : validation.message}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 pt-2">
          {!isViewOnly ? (
            <>
              <button type="submit" disabled={loading} className="px-6 py-3 bg-[#002045] text-white text-[14px] font-semibold rounded-xl hover:bg-[#001833] transition-colors disabled:opacity-50 cursor-pointer shadow-xs">
                {isEdit ? "Simpan Perubahan" : "Simpan"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/admin/parameter?tab=level")}
                className="px-6 py-3 border border-gray-200 text-[#002045] text-[14px] font-semibold rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Batal
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => router.push("/admin/parameter?tab=level")}
              className="inline-flex items-center justify-center px-6 py-2.5 border border-gray-200 text-[#002045] text-[14px] font-medium rounded-xl hover:bg-gray-50 bg-white transition-all shadow-xs cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
            </button>
          )}
        </div>
      </div>

      {/* Sidebar Status (Kanan) */}
      <div className="lg:col-span-4">
        <div className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
          <h3 className="font-semibold text-lg text-[#002045]">Status</h3>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[16px] font-normal text-[#1E1E1E]">{status === "ACTIVE" ? "Active" : "Inactive"}</span>

            {isViewOnly ? (
              <div className={`w-12 h-6 flex items-center rounded-full p-1 cursor-not-allowed ${status === "ACTIVE" ? "bg-gray-300" : "bg-gray-200"}`}>
                <div className={`bg-white w-4 h-4 rounded-full shadow-xs transform transition-transform ${status === "ACTIVE" ? "translate-x-6" : "translate-x-0"}`} />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setStatus(status === "ACTIVE" ? "INACTIVE" : "ACTIVE")}
                className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors cursor-pointer ${status === "ACTIVE" ? "bg-[#006A61]" : "bg-gray-300"}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${status === "ACTIVE" ? "translate-x-7" : "translate-x-1"}`} />
              </button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
