"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getActiveQuestions, submitAssessment, UserBiodata, AnswerSubmission, QuestionData } from "./actions";
import { ArrowRight, ArrowLeft, LayoutGrid, CheckCircle2, HelpCircle, ChevronDown, BookOpen } from "lucide-react";

export default function AssessmentPage() {
  const router = useRouter();

  // Step Management: 1 = Welcome, 2 = Biodata, 3 = Test
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Data Soal
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Form Data Diri (Step 2)
  const [biodata, setBiodata] = useState<UserBiodata>({
    userName: "",
    institution: "",
    gradeLevel: "",
    city: "",
  });
  const [isAgreed, setIsAgreed] = useState<boolean>(false);

  // State Jawaban User: menyimpan indeks angka (number) atau teks isian (string)
  const [userAnswers, setUserAnswers] = useState<Record<number, number | string>>({});
  const [startTime, setStartTime] = useState<number>(0);

  // Fetch Questions
  useEffect(() => {
    async function fetchQuestions() {
      try {
        const data = await getActiveQuestions();
        setQuestions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, []);

  const handleStartTest = () => {
    if (!biodata.userName || !biodata.institution || !biodata.gradeLevel || !biodata.city) {
      alert("Harap lengkapi semua kolom data diri.");
      return;
    }
    if (!isAgreed) {
      alert("Harap centang persetujuan partisipasi sukarela.");
      return;
    }
    setStartTime(Date.now());
    setStep(3);
  };

  // Handler Pilih Opsi Jawaban
  const handleSelectAnswer = (value: number | string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentIndex]: value,
    }));
  };

  // Cek apakah soal saat ini sudah dijawab
  const isCurrentAnswered = userAnswers[currentIndex] !== undefined && userAnswers[currentIndex] !== null && userAnswers[currentIndex] !== "";

  // Cek apakah SELURUH soal sudah dijawab 100%
  const allQuestionsAnswered = questions.length > 0 && questions.every((_, idx) => userAnswers[idx] !== undefined && userAnswers[idx] !== null && userAnswers[idx] !== "");

  // Handler Lanjut ke Soal Berikutnya (Dengan Proteksi)
  const handleNextQuestion = () => {
    if (!isCurrentAnswered) {
      alert("Harap jawab pertanyaan saat ini terlebih dahulu sebelum melanjutkan.");
      return;
    }
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // Handler Lompat via Peta Pertanyaan (Dengan Proteksi)
  const handleJumpToQuestion = (targetIndex: number) => {
    if (targetIndex < currentIndex) {
      setCurrentIndex(targetIndex);
      return;
    }

    if (!isCurrentAnswered) {
      alert("Harap jawab pertanyaan saat ini terlebih dahulu sebelum pindah ke soal lain.");
      return;
    }

    const isTargetAnswered = userAnswers[targetIndex] !== undefined && userAnswers[targetIndex] !== null && userAnswers[targetIndex] !== "";

    if (targetIndex === currentIndex + 1 || isTargetAnswered) {
      setCurrentIndex(targetIndex);
    } else {
      alert("Anda harus menjawab soal secara berurutan.");
    }
  };

  // Submit Assessment
  const handleSubmit = async () => {
    if (!allQuestionsAnswered) {
      alert("Semua pertanyaan harus diisi lengkap terlebih dahulu!");
      return;
    }

    setIsSubmitting(true);

    const elapsedMs = Date.now() - startTime;
    const minutes = Math.floor(elapsedMs / 60000);
    const seconds = Math.floor((elapsedMs % 60000) / 1000);
    const durationText = `${minutes} Menit ${seconds} Detik`;

    const formattedAnswers: AnswerSubmission[] = questions.map((q, idx) => {
      const ansVal = userAnswers[idx];
      let selectedText = "Tidak Dijawab";
      let score = 0;

      if (q.type === "SCALE" && typeof ansVal === "number") {
        selectedText = `Skala ${ansVal}`;
        const matchedOpt = q.options?.find((o) => o.label === ansVal.toString() || o.text === `Skala ${ansVal}`);
        score = matchedOpt ? matchedOpt.score : ansVal;
      } else if (typeof ansVal === "number" && q.options && q.options[ansVal]) {
        const opt = q.options[ansVal];
        const lbl = opt.label || String.fromCharCode(65 + ansVal);
        selectedText = `${lbl}. ${opt.text}`;
        score = opt.score || 0;
      } else if (typeof ansVal === "string") {
        selectedText = ansVal;
        score = 0;
      }

      return {
        questionId: q.id,
        questionCode: q.code,
        questionText: q.questionText,
        selectedAnswer: selectedText,
        score,
      };
    });

    try {
      const result = await submitAssessment(biodata, formattedAnswers, durationText);
      alert("Assessment berhasil diselesaikan!");
      router.push(`/admin/pengguna/detail/${result.id}`);
    } catch (err) {
      console.error(err);
      alert("Gagal mengirim hasil assessment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(userAnswers).filter((k) => userAnswers[Number(k)] !== undefined && userAnswers[Number(k)] !== "").length;
  const progressPercent = questions.length > 0 ? Math.round(((currentIndex + 1) / questions.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E1E1E] flex flex-col justify-between">
      {/* HEADER BAR */}
      <header className="h-16 bg-white border-b border-gray-200/80 px-8 flex items-center shrink-0">
        <Link href="/" className="text-xl font-bold text-[#002045] tracking-tight">
          Civix<span className="text-[#006A61]">.id</span>
        </Link>
      </header>

      {/* BODY CONTENT AREA (DIPERLUAS MENJADI max-w-7xl) */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10 flex flex-col justify-center">
        {/* STEP 1: WELCOME SCREEN */}
        {step === 1 && (
          <div className="max-w-2xl mx-auto w-full text-center space-y-8 animate-in fade-in duration-200">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold text-[#002045]">Selamat Datang di</h1>
              <h1 className="text-3xl md:text-4xl font-bold text-[#002045]">
                Assessment Civix<span className="text-[#006A61]">.id</span>
              </h1>
            </div>

            <div className="bg-white border border-gray-200/80 rounded-2xl p-6 md:p-8 shadow-xs text-xs md:text-sm text-[#64748B] leading-relaxed text-justify">
              Assessment ini ditujukan bagi guru aktif Pendidikan Pancasila/PPKn jenjang SMP/MTs, SMA/MA, dan SMK/MAK, negeri maupun swasta, di Kota Surabaya. Pengisian bertujuan memperoleh data profil profesional guru dan respons terhadap
              Instrumen Kompetensi Profesional Guru Pendidikan Pancasila/PPKn berbasis Identitas Profesional Reflektif, termasuk modul Asesmen Pedagogi PPKn. Tidak ada jawaban benar atau salah. Jawablah sesuai pengalaman profesional
              Bapak/Ibu. Data hanya digunakan untuk kepentingan akademik/disertasi dan dilaporkan secara agregat.
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs flex flex-col items-center justify-center space-y-2">
                <BookOpen className="w-6 h-6 text-[#006A61]" />
                <span className="text-xs font-bold text-[#002045]">10 Dimensi Kompetensi</span>
              </div>

              <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs flex flex-col items-center justify-center space-y-2">
                <HelpCircle className="w-6 h-6 text-[#006A61]" />
                <span className="text-xs font-bold text-[#002045]">{loading ? "..." : `${questions.length || 0} Soal`}</span>
              </div>
            </div>

            <button onClick={() => setStep(2)} className="w-full py-4 bg-[#002045] hover:bg-[#001833] text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs">
              Selanjutnya <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: DATA DIRI */}
        {step === 2 && (
          <div className="max-w-2xl mx-auto w-full space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-[11px] font-bold text-[#006A61] uppercase tracking-wider block mb-1">DATA DIRI</span>
              <h2 className="text-2xl font-bold text-[#002045]">Sebelum mulai, isi data diri kamu</h2>
            </div>

            <div className="bg-white border border-gray-200/80 rounded-2xl p-6 md:p-8 shadow-xs space-y-5">
              <div>
                <label className="block text-xs font-semibold text-[#002045] mb-2">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={biodata.userName}
                  onChange={(e) => setBiodata({ ...biodata, userName: e.target.value })}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full p-3.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#006A61] placeholder:text-gray-300 text-[#1E1E1E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#002045] mb-2">
                  Asal Instansi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={biodata.institution}
                  onChange={(e) => setBiodata({ ...biodata, institution: e.target.value })}
                  placeholder="Contoh: SMA Negeri 1"
                  className="w-full p-3.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#006A61] placeholder:text-gray-300 text-[#1E1E1E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#002045] mb-2">
                  Jenjang Mengajar <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={biodata.gradeLevel}
                    onChange={(e) => setBiodata({ ...biodata, gradeLevel: e.target.value })}
                    className="w-full appearance-none p-3.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#006A61] text-[#1E1E1E]"
                  >
                    <option value="" disabled>
                      Pilih Jenjang
                    </option>
                    <option value="SMP">SMP / MTs</option>
                    <option value="SMA">SMA / MA</option>
                    <option value="SMK">SMK / MAK</option>
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#002045] mb-2">
                  Wilayah (Kota/Kabupaten) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={biodata.city}
                  onChange={(e) => setBiodata({ ...biodata, city: e.target.value })}
                  placeholder="Contoh: Surabaya"
                  className="w-full p-3.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#006A61] placeholder:text-gray-300 text-[#1E1E1E]"
                />
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer text-xs text-[#64748B] leading-relaxed">
              <input type="checkbox" checked={isAgreed} onChange={(e) => setIsAgreed(e.target.checked)} className="mt-0.5 rounded border-gray-300 accent-[#002045] shrink-0" />
              <span>Saya bersedia berpartisipasi secara sukarela dan memahami data ini digunakan untuk kepentingan akademik.</span>
            </label>

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(1)} className="w-1/3 py-3.5 border border-gray-200 text-[#002045] text-xs font-semibold rounded-xl hover:bg-gray-50 transition-colors">
                Kembali
              </button>

              <button type="button" onClick={handleStartTest} className="w-2/3 py-3.5 bg-[#002045] hover:bg-[#001833] text-white text-xs font-semibold rounded-xl transition-colors shadow-xs">
                Mulai
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PENGERJAAN SOAL (DI-EXPAND MENJADI 9 : 3 RATIO) */}
        {step === 3 && currentQuestion && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch animate-in fade-in duration-200">
            {/* AREA PERTANYAAN (lg:col-span-9 - LEBIH LEBAR DAN LEGA) */}
            <div className="lg:col-span-9 flex flex-col justify-between space-y-6">
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[#006A61] uppercase tracking-wider block">DIMENSI ASSESSMENT</span>
                <div className="flex justify-between items-end">
                  <h2 className="text-xl md:text-2xl font-bold text-[#002045]">{currentQuestion.dimension || "Civic Competence"}</h2>
                  <span className="text-xs font-medium text-[#64748B]">
                    Soal {currentIndex + 1} dari {questions.length}
                  </span>
                </div>

                <div className="space-y-1 pt-1">
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#006A61] transition-all duration-300 rounded-full" style={{ width: `${progressPercent}%` }} />
                  </div>
                  <span className="text-[10px] text-gray-400 text-right block font-semibold">{progressPercent}% Complete</span>
                </div>
              </div>

              {/* CARD TEKS PERTANYAAN & RENDERER JAWABAN DYNAMIC */}
              <div className="bg-white border border-gray-200/80 rounded-2xl p-8 md:p-10 shadow-xs flex-1 flex flex-col justify-center space-y-8">
                <p className="text-base md:text-lg font-medium text-[#1E1E1E] leading-relaxed">{currentQuestion.questionText}</p>

                {/* 1. TIPE SOAL SCALE (LAYOUT LEGA DENGAN FLEX-1) */}
                {currentQuestion.type === "SCALE" ? (
                  <div className="pt-2">
                    <div className="flex items-center justify-between gap-4 md:gap-8 max-w-2xl mx-auto">
                      {/* Label Batas Bawah (Kiri) */}
                      <span className="text-xs md:text-sm font-medium text-[#64748B] text-right flex-1 leading-tight">{currentQuestion.scaleMinLabel || "Sangat Tidak Sesuai"}</span>

                      {/* Tombol Angka Skala (1-5) */}
                      <div className="flex items-center gap-3 md:gap-4 shrink-0">
                        {Array.from(
                          {
                            length: (currentQuestion.scaleMax || 5) - (currentQuestion.scaleMin || 1) + 1,
                          },
                          (_, i) => (currentQuestion.scaleMin || 1) + i,
                        ).map((scoreVal) => {
                          const isSelected = userAnswers[currentIndex] === scoreVal;

                          return (
                            <button
                              key={scoreVal}
                              type="button"
                              onClick={() => handleSelectAnswer(scoreVal)}
                              className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl font-bold text-sm md:text-base transition-all flex items-center justify-center border ${
                                isSelected ? "bg-[#002045] text-white border-[#002045] shadow-md scale-105" : "bg-white text-[#002045] border-gray-200 hover:bg-gray-50/80"
                              }`}
                            >
                              {scoreVal}
                            </button>
                          );
                        })}
                      </div>

                      {/* Label Batas Atas (Kanan) */}
                      <span className="text-xs md:text-sm font-medium text-[#64748B] text-left flex-1 leading-tight">{currentQuestion.scaleMaxLabel || "Sangat Sesuai"}</span>
                    </div>
                  </div>
                ) : currentQuestion.options && currentQuestion.options.length > 0 ? (
                  /* 2. TIPE MULTIPLE CHOICE / CHECKBOX / DROPDOWN */
                  <div className="space-y-3.5">
                    {currentQuestion.options.map((opt, optIdx) => {
                      const isSelected = userAnswers[currentIndex] === optIdx;
                      const optionLabel = opt.label || String.fromCharCode(65 + optIdx);

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelectAnswer(optIdx)}
                          className={`w-full p-4 md:p-5 rounded-2xl text-left border transition-all flex items-start gap-4 ${
                            isSelected ? "bg-[#E6F0F0] border-[#006A61] text-[#002045]" : "bg-white border-gray-200/80 hover:bg-gray-50/80 text-[#1E1E1E]"
                          }`}
                        >
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs md:text-sm shrink-0 transition-colors ${isSelected ? "bg-[#006A61] text-white" : "bg-gray-100 text-[#002045]"}`}>
                            {optionLabel}
                          </span>
                          <span className="text-xs md:text-sm pt-1 leading-relaxed font-normal">{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  /* 3. ISIAN TEKS / TEXTAREA (SHORT_TEXT & LONG_TEXT) */
                  <div className="pt-2">
                    <textarea
                      rows={5}
                      value={(userAnswers[currentIndex] as string) || ""}
                      onChange={(e) => handleSelectAnswer(e.target.value)}
                      placeholder="Tuliskan jawaban Anda di sini..."
                      className="w-full p-4 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#006A61] resize-none placeholder:text-gray-300 text-[#1E1E1E]"
                    />
                  </div>
                )}
              </div>

              {/* ACTION NAVIGASI BAWAH */}
              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((prev) => prev - 1)}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-xl text-xs font-semibold text-[#002045] hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="w-4 h-4" /> Sebelumnya
                </button>

                {currentIndex < questions.length - 1 ? (
                  <button
                    type="button"
                    disabled={!isCurrentAnswered}
                    onClick={handleNextQuestion}
                    className="inline-flex items-center gap-2 px-7 py-3 bg-[#002045] hover:bg-[#001833] text-white text-xs font-semibold rounded-xl transition-colors shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Selanjutnya <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isSubmitting || !allQuestionsAnswered}
                    onClick={handleSubmit}
                    className="inline-flex items-center gap-2 px-7 py-3 bg-[#006A61] hover:bg-[#00544d] text-white text-xs font-semibold rounded-xl transition-colors shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <CheckCircle2 className="w-4 h-4" /> {isSubmitting ? "Selesai..." : "Selesaikan Assessment"}
                  </button>
                )}
              </div>
            </div>

            {/* SIDEBAR PETA PERTANYAAN (lg:col-span-3 - RINGKAS KANAN) */}
            <div className="lg:col-span-3 flex flex-col">
              <div className="h-[62px] hidden lg:block" />

              <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                    <h3 className="font-bold text-sm text-[#002045]">Peta Pertanyaan</h3>
                    <LayoutGrid className="w-4 h-4 text-gray-400" />
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-4 gap-2 max-h-80 overflow-y-auto p-1">
                    {questions.map((_, idx) => {
                      const isAnswered = userAnswers[idx] !== undefined && userAnswers[idx] !== null && userAnswers[idx] !== "";
                      const isCurrent = idx === currentIndex;

                      let bgClass = "bg-gray-100 text-gray-400 border-transparent hover:bg-gray-200";
                      if (isCurrent) {
                        bgClass = "border-2 border-[#002045] bg-white font-bold text-[#002045]";
                      } else if (isAnswered) {
                        bgClass = "bg-[#006A61] text-white font-bold hover:bg-[#00544d]";
                      }

                      return (
                        <button key={idx} type="button" onClick={() => handleJumpToQuestion(idx)} className={`h-9 rounded-lg text-xs flex items-center justify-center transition-all ${bgClass}`}>
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-2.5 text-[11px] text-[#64748B]">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3.5 h-3.5 rounded bg-[#006A61] shrink-0" />
                    <span>Sudah Dijawab ({answeredCount})</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-3.5 h-3.5 rounded border-2 border-[#002045] bg-white shrink-0" />
                    <span>Sedang Dikerjakan</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-3.5 h-3.5 rounded bg-gray-100 shrink-0" />
                    <span>Belum Dijawab ({questions.length - answeredCount})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="py-4 text-center text-[11px] text-gray-400 border-t border-gray-100 bg-white shrink-0">© 2026 Civix.id. All rights reserved</footer>
    </div>
  );
}
