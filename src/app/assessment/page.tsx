"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getActiveQuestions, submitAssessment, UserBiodata, AnswerSubmission, QuestionData } from "./actions";
import { ArrowRight, ArrowLeft, CheckCircle2, HelpCircle, ChevronDown, BookOpen, UserCheck, AlertTriangle, X } from "lucide-react";

interface ModalState {
  isOpen: boolean;
  title: string;
  message: string;
  type?: "warning" | "error" | "success" | "info";
  onConfirm?: () => void;
}

type AnswerValue = number | string | number[] | undefined;

export default function AssessmentPage() {
  const router = useRouter();

  // Step: 1 = Welcome, 2 = Data Diri Singkat, 3 = Demografis (4 Sub-step), 4 = Soal Kuis per Dimensi
  const [step, setStep] = useState<number>(1);
  const [demoSubStep, setDemoSubStep] = useState<number>(1);
  const [currentDimensionIndex, setCurrentDimensionIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Custom Alert Modal State
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    title: "",
    message: "",
    type: "warning",
  });

  const showAlert = (message: string, title = "Perhatian", type: "warning" | "error" | "success" | "info" = "warning") => {
    setModal({
      isOpen: true,
      title,
      message,
      type,
    });
  };

  const closeModal = () => {
    setModal((prev) => ({ ...prev, isOpen: false }));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Data Soal dari Database Admin
  const [questions, setQuestions] = useState<QuestionData[]>([]);

  // Form Data Diri Awal (Step 2)
  const [biodata, setBiodata] = useState<UserBiodata>({
    userName: "",
    institution: "",
    gradeLevel: "",
    city: "",
  });
  const [isAgreed, setIsAgreed] = useState<boolean>(false);

  // Form Demografis Lengkap (Step 3)
  const [demographics, setDemographics] = useState<Record<string, string>>({
    // Bagian 1: Identitas & Latar Belakang Pendidikan
    jenisKelamin: "",
    kelompokUsia: "",
    pendidikanTerakhir: "",
    latarBelakangPendidikan: "",
    statusSertifikasi: "",
    statusKepegawaian: "",
    tugasTambahan: "",

    // Bagian 2: Profil Satuan Pendidikan
    statusSatuanPendidikan: "",
    namaSekolah: "",
    npsnSekolah: "",
    kecamatanLokasi: "",
    wilayahSekolah: "",
    akreditasiSekolah: "",
    kurikulumDominan: "",

    // Bagian 3: Pengalaman & Beban Mengajar
    totalLamaMengajar: "",
    lamaMengajarPPKn: "",
    lamaMengajarSekolahSaatIni: "",
    kelasYangDiajar: "",
    jumlahRombelPPKn: "",
    bebanJamPPKn: "",
    rataMuridPerKelas: "",
    mengajarMapelLain: "",
    namaMapelLain: "",

    // Bagian 4: Pengembangan Profesi, Pembelajaran & Tindak Lanjut
    keaktifanMGMP: "",
    frekuensiMGMP: "",
    jumlahPelatihan2Tahun: "",
    topikPengembanganProfesi: "",
    pengalamanPTK: "",
    pengalamanBerbagiPraktikBaik: "",
    kondisiInternetSekolah: "",
    frekuensiIsuPublik: "",
    keberagamanMurid: "",
    kesediaanWawancara: "",
    kontakTindakLanjut: "",
  });

  // State Jawaban Soal Assessment (Key: questionId, Value: number | string | number[])
  const [userAnswers, setUserAnswers] = useState<Record<string, AnswerValue>>({});
  const [startTime, setStartTime] = useState<number>(0);

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

  // Mengelompokkan Soal Berdasarkan Dimensi Kompetensi
  const groupedDimensions = useMemo(() => {
    const map = new Map<string, QuestionData[]>();
    questions.forEach((q) => {
      const dimName = q.dimension || "Civic Competence";
      if (!map.has(dimName)) {
        map.set(dimName, []);
      }
      map.get(dimName)!.push(q);
    });

    return Array.from(map.entries()).map(([dimensionName, items]) => ({
      dimensionName,
      questions: items,
    }));
  }, [questions]);

  const currentDimensionGroup = groupedDimensions[currentDimensionIndex];

  const handleDemoChange = (field: string, value: string) => {
    setDemographics((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxToggle = (field: string, item: string, exclusiveItem?: string) => {
    setDemographics((prev) => {
      const currentValues = prev[field] ? prev[field].split(", ").filter(Boolean) : [];

      if (exclusiveItem && item === exclusiveItem) {
        return {
          ...prev,
          [field]: currentValues.includes(exclusiveItem) ? "" : exclusiveItem,
        };
      }

      let updatedValues = currentValues.filter((v) => v !== exclusiveItem);

      if (updatedValues.includes(item)) {
        updatedValues = updatedValues.filter((v) => v !== item);
      } else {
        updatedValues.push(item);
      }

      return {
        ...prev,
        [field]: updatedValues.join(", "),
      };
    });
  };

  // Handler jawaban single select / text
  const handleSelectQuestionAnswer = (questionId: string, value: AnswerValue) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // Handler khusus tipe soal CHECKBOX pada assessment
  const handleQuestionCheckboxToggle = (questionId: string, optIndex: number) => {
    setUserAnswers((prev) => {
      const currentVal = prev[questionId];
      const current: number[] = Array.isArray(currentVal) ? currentVal : [];
      let updated: number[];
      if (current.includes(optIndex)) {
        updated = current.filter((i) => i !== optIndex);
      } else {
        updated = [...current, optIndex];
      }
      return {
        ...prev,
        [questionId]: updated.length > 0 ? updated : undefined,
      };
    });
  };

  // Validasi Kelengkapan Tiap Sub-Step Demografi
  const validateDemoSubStep = (subStep: number): boolean => {
    if (subStep === 1) {
      return !!(
        demographics.jenisKelamin &&
        demographics.kelompokUsia &&
        demographics.pendidikanTerakhir &&
        demographics.latarBelakangPendidikan &&
        demographics.statusSertifikasi &&
        demographics.statusKepegawaian &&
        demographics.tugasTambahan
      );
    }
    if (subStep === 2) {
      return !!(demographics.statusSatuanPendidikan && demographics.kecamatanLokasi && demographics.wilayahSekolah && demographics.akreditasiSekolah && demographics.kurikulumDominan);
    }
    if (subStep === 3) {
      const basicValid = !!(
        demographics.totalLamaMengajar &&
        demographics.lamaMengajarPPKn &&
        demographics.lamaMengajarSekolahSaatIni &&
        demographics.kelasYangDiajar &&
        demographics.jumlahRombelPPKn &&
        demographics.bebanJamPPKn &&
        demographics.rataMuridPerKelas &&
        demographics.mengajarMapelLain
      );
      if (demographics.mengajarMapelLain === "Ya") {
        return basicValid && !!demographics.namaMapelLain;
      }
      return basicValid;
    }
    if (subStep === 4) {
      return !!(
        demographics.keaktifanMGMP &&
        demographics.frekuensiMGMP &&
        demographics.jumlahPelatihan2Tahun &&
        demographics.topikPengembanganProfesi &&
        demographics.pengalamanPTK &&
        demographics.pengalamanBerbagiPraktikBaik &&
        demographics.kondisiInternetSekolah &&
        demographics.frekuensiIsuPublik &&
        demographics.keberagamanMurid &&
        demographics.kesediaanWawancara
      );
    }
    return true;
  };

  // Validasi kelengkapan jawaban pada dimensi aktif
  const isCurrentDimensionCompleted = useMemo(() => {
    if (!currentDimensionGroup) return false;
    return currentDimensionGroup.questions.every((q) => {
      const ans = userAnswers[q.id];
      if (Array.isArray(ans)) return ans.length > 0;
      return ans !== undefined && ans !== null && ans !== "";
    });
  }, [currentDimensionGroup, userAnswers]);

  // Validasi seluruh pertanyaan di semua dimensi
  const allQuestionsAnswered = useMemo(() => {
    if (questions.length === 0) return false;
    return questions.every((q) => {
      const ans = userAnswers[q.id];
      if (Array.isArray(ans)) return ans.length > 0;
      return ans !== undefined && ans !== null && ans !== "";
    });
  }, [questions, userAnswers]);

  const handleNextDimension = () => {
    if (!isCurrentDimensionCompleted) {
      showAlert("Harap jawab semua butir pertanyaan pada bagian dimensi ini sebelum melanjutkan.", "Peringatan", "warning");
      return;
    }

    if (currentDimensionIndex < groupedDimensions.length - 1) {
      setCurrentDimensionIndex((prev) => prev + 1);
      scrollToTop();
    }
  };

  const handlePrevDimension = () => {
    if (currentDimensionIndex > 0) {
      setCurrentDimensionIndex((prev) => prev - 1);
      scrollToTop();
    } else {
      setStep(3);
      setDemoSubStep(4);
      scrollToTop();
    }
  };

  const handleSubmitAssessment = async () => {
    if (!allQuestionsAnswered) {
      showAlert("Semua pertanyaan pada seluruh dimensi harus diisi lengkap terlebih dahulu sebelum menyelesaikan assessment!", "Peringatan", "warning");
      return;
    }

    setIsSubmitting(true);

    const elapsedMs = Date.now() - startTime;
    const minutes = Math.floor(elapsedMs / 60000);
    const seconds = Math.floor((elapsedMs % 60000) / 1000);
    const durationText = `${minutes} Menit ${seconds} Detik`;

    const formattedAnswers: AnswerSubmission[] = questions.map((q) => {
      const ansVal = userAnswers[q.id];
      let selectedText = "Tidak Dijawab";
      let score = 0;

      if (q.type === "SCALE" && typeof ansVal === "number") {
        selectedText = `Skala ${ansVal}`;
        const matchedOpt = q.options?.find((o) => o.label === ansVal.toString() || o.text === `Skala ${ansVal}`);
        score = matchedOpt ? matchedOpt.score : ansVal;
      } else if (q.type === "CHECKBOX" && Array.isArray(ansVal)) {
        const chosenTexts: string[] = [];
        let totalScore = 0;
        ansVal.forEach((idx) => {
          if (q.options && q.options[idx]) {
            chosenTexts.push(q.options[idx].text);
            totalScore += q.options[idx].score || 0;
          }
        });
        selectedText = chosenTexts.join(", ") || "Tidak Dijawab";
        score = totalScore;
      } else if (typeof ansVal === "number" && q.options && q.options[ansVal]) {
        const opt = q.options[ansVal];
        const lbl = opt.label || String.fromCharCode(65 + ansVal);
        selectedText = opt.label ? `${lbl}. ${opt.text}` : opt.text;
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
      const result = await submitAssessment(biodata, demographics, formattedAnswers, durationText);
      router.push(`/admin/pengguna/detail/${result.id}`);
    } catch (err) {
      console.error(err);
      showAlert("Gagal mengirim hasil assessment. Silakan coba beberapa saat lagi.", "Kesalahan", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const dimensionProgressPercent = groupedDimensions.length > 0 ? Math.round(((currentDimensionIndex + 1) / groupedDimensions.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E1E1E] flex flex-col justify-between relative">
      {/* ==================== CUSTOM ALERT MODAL UI ==================== */}
      {modal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#002045]/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-gray-100 rounded-[8px] p-6 md:p-8 max-w-md w-full shadow-xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-[8px] flex items-center justify-center shrink-0 ${
                    modal.type === "error" ? "bg-red-50 text-red-600" : modal.type === "success" ? "bg-emerald-50 text-emerald-600" : modal.type === "info" ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600"
                  }`}
                >
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#002045]">{modal.title}</h3>
                  <span className="text-[11px] text-gray-400 font-medium">Notifikasi Sistem Civix.id</span>
                </div>
              </div>
              <button type="button" onClick={closeModal} className="text-gray-400 hover:text-gray-600 p-1.5 rounded-[8px] hover:bg-gray-50 transition-colors cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[14px] font-normal text-[#64748B] leading-relaxed">{modal.message}</p>

            <div className="pt-2">
              <button type="button" onClick={closeModal} className="w-full py-3 bg-[#002045] hover:bg-[#001833] text-white text-[14px] font-semibold rounded-[8px] transition-all shadow-xs hover:shadow-md active:scale-[0.98] cursor-pointer">
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER BAR */}
      <header className="h-16 bg-white border-b border-gray-200/80 px-8 flex items-center shrink-0">
        <Link href="/" className="text-xl font-bold text-[#002045] tracking-tight">
          Civix<span className="text-[#006A61]">.id</span>
        </Link>
      </header>

      {/* BODY CONTENT AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10 flex flex-col justify-center">
        {/* ==================== STEP 1: WELCOME SCREEN ==================== */}
        {step === 1 && (
          <div className="max-w-2xl mx-auto w-full text-center space-y-5 animate-in fade-in duration-200">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold text-[#002045]">Selamat Datang di</h1>
              <h1 className="text-3xl md:text-4xl font-bold text-[#002045]">
                Assessment Civix<span className="text-[#006A61]">.id</span>
              </h1>
            </div>

            <div className="bg-white border border-gray-200/80 rounded-[8px] p-6 md:p-8 shadow-xs text-sm md:text-base text-[#64748B] leading-relaxed text-justify">
              Assessment ini ditujukan bagi guru aktif Pendidikan Pancasila/PPKn jenjang SMP/MTs, SMA/MA, dan SMK/MAK, negeri maupun swasta, di Kota Surabaya. Pengisian bertujuan memperoleh data profil profesional guru dan respons terhadap
              Instrumen Kompetensi Profesional Guru Pendidikan Pancasila/PPKn berbasis Identitas Profesional Reflektif, termasuk modul Asesmen Pedagogi PPKn. Tidak ada jawaban benar atau salah. Jawablah sesuai pengalaman profesional
              Bapak/Ibu. Data hanya digunakan untuk kepentingan akademik/disertasi dan dilaporkan secara agregat.
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200/80 rounded-[8px] p-5 shadow-xs flex flex-col items-center justify-center space-y-2 hover:border-[#006A61]/40 transition-colors">
                <BookOpen className="w-6 h-6 text-[#006A61]" />
                <span className="text-sm font-semibold text-[#002045]">10 Dimensi Kompetensi</span>
              </div>

              <div className="bg-white border border-gray-200/80 rounded-[8px] p-5 shadow-xs flex flex-col items-center justify-center space-y-2 hover:border-[#006A61]/40 transition-colors">
                <HelpCircle className="w-6 h-6 text-[#006A61]" />
                <span className="text-sm font-semibold text-[#002045]">{loading ? "..." : `${questions.length || 0} Soal`}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setStep(2);
                scrollToTop();
              }}
              className="w-full py-4 bg-[#002045] hover:bg-[#001833] hover:shadow-md active:scale-[0.99] cursor-pointer text-white text-[14px] font-medium rounded-[8px] transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              Selanjutnya <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ==================== STEP 2: DATA DIRI SINGKAT ==================== */}
        {step === 2 && (
          <div className="max-w-2xl mx-auto w-full space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-[12px] font-bold text-[#006A61] uppercase tracking-wider block mb-1">DATA DIRI</span>
              <h2 className="text-2xl font-bold text-[#002045]">Sebelum mulai, isi data diri kamu</h2>
            </div>

            <div className="bg-white border border-gray-200/80 rounded-[8px] p-6 md:p-8 shadow-xs space-y-6">
              <div>
                <label className="block text-[16px] font-medium text-[#002045] mb-4">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={biodata.userName}
                  onChange={(e) => setBiodata({ ...biodata, userName: e.target.value })}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full p-3.5 text-[14px] bg-white border border-gray-200 rounded-[8px] focus:outline-none focus:border-[#006A61] hover:border-gray-300 transition-colors placeholder:text-gray-300 text-[#1E1E1E]"
                />
              </div>

              <div>
                <label className="block text-[16px] font-medium text-[#002045] mb-4">
                  Asal Instansi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={biodata.institution}
                  onChange={(e) => setBiodata({ ...biodata, institution: e.target.value })}
                  placeholder="Contoh: SMA Negeri 1"
                  className="w-full p-3.5 text-[14px] bg-white border border-gray-200 rounded-[8px] focus:outline-none focus:border-[#006A61] hover:border-gray-300 transition-colors placeholder:text-gray-300 text-[#1E1E1E]"
                />
              </div>

              <div>
                <label className="block text-[16px] font-medium text-[#002045] mb-4">
                  Jenjang Mengajar <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={biodata.gradeLevel}
                    onChange={(e) => {
                      setBiodata({ ...biodata, gradeLevel: e.target.value });
                      setDemographics((prev) => ({ ...prev, jenjangPendidikanUtama: e.target.value }));
                    }}
                    className="w-full appearance-none p-3.5 text-[14px] bg-white border border-gray-200 rounded-[8px] focus:outline-none focus:border-[#006A61] hover:border-gray-300 cursor-pointer transition-colors text-[#1E1E1E]"
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
                <label className="block text-[16px] font-medium text-[#002045] mb-4">
                  Wilayah (Kota/Kabupaten) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={biodata.city}
                  onChange={(e) => setBiodata({ ...biodata, city: e.target.value })}
                  placeholder="Contoh: Kota Surabaya"
                  className="w-full p-3.5 text-[14px] bg-white border border-gray-200 rounded-[8px] focus:outline-none focus:border-[#006A61] hover:border-gray-300 transition-colors placeholder:text-gray-300 text-[#1E1E1E]"
                />
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer text-sm text-[#64748B] leading-relaxed select-none">
              <input type="checkbox" checked={isAgreed} onChange={(e) => setIsAgreed(e.target.checked)} className="mt-0.5 rounded-[4px] border-gray-300 accent-[#002045] shrink-0 cursor-pointer" />
              <span>Saya bersedia berpartisipasi secara sukarela dan memahami data ini digunakan untuk kepentingan akademik.</span>
            </label>

            {/* ACTION BUTTONS */}
            <div className="flex justify-between items-center w-full pt-2">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  scrollToTop();
                }}
                className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 text-[#002045] text-[14px] font-medium rounded-[8px] hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98] cursor-pointer transition-all shadow-xs"
              >
                <ArrowLeft className="w-4 h-4" /> Kembali
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!biodata.userName || !biodata.institution || !biodata.gradeLevel || !biodata.city) {
                    showAlert("Harap lengkapi semua kolom data diri.", "Peringatan", "warning");
                    return;
                  }
                  if (!isAgreed) {
                    showAlert("Harap centang persetujuan partisipasi sukarela.", "Peringatan", "warning");
                    return;
                  }
                  setStep(3);
                  scrollToTop();
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#002045] hover:bg-[#001833] hover:shadow-md active:scale-[0.98] cursor-pointer text-white text-[14px] font-medium rounded-[8px] transition-all shadow-xs"
              >
                Mulai <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ==================== STEP 3: PROFIL DEMOGRAFIS & PROFESIONAL RESPONDEN ==================== */}
        {step === 3 && (
          <div className="max-w-3xl mx-auto w-full space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-[12px] font-bold text-[#006A61] uppercase tracking-wider block mb-1">profil demografis dan profesional responden</span>
              <div className="flex justify-between items-end gap-3">
                <h2 className="text-lg sm:text-2xl font-bold text-[#002045]">
                  {demoSubStep === 1 && "Identitas & Latar Belakang Pendidikan"}
                  {demoSubStep === 2 && "Profil Satuan Pendidikan"}
                  {demoSubStep === 3 && "Pengalaman & Beban Mengajar"}
                  {demoSubStep === 4 && "Pengembangan Profesi, Pembelajaran & Tindak Lanjut"}
                </h2>
                <span className="text-[12px] font-medium text-gray-400 shrink-0">Bagian {demoSubStep}/4</span>
              </div>

              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mt-3">
                <div className="h-full bg-[#006A61] transition-all duration-300 rounded-full" style={{ width: `${(demoSubStep / 4) * 100}%` }} />
              </div>
            </div>

            <div className="bg-white border border-gray-200/80 rounded-[8px] p-6 md:p-8 shadow-xs space-y-8">
              {/* SUB-STEP 1 */}
              {demoSubStep === 1 && (
                <div className="space-y-8 animate-in fade-in">
                  <div>
                    <label className="block text-[16px] font-medium text-[#002045] mb-4">
                      Jenis kelamin <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {["Perempuan", "Laki Laki", "Tidak Menjawab"].map((item) => (
                        <label
                          key={item}
                          className={`w-full p-3.5 rounded-[8px] border text-[14px] font-normal flex items-center gap-3 cursor-pointer transition-all hover:bg-gray-50/80 hover:border-gray-300 ${
                            demographics.jenisKelamin === item ? "bg-[#E6F0F0] border-[#006A61] font-semibold text-[#002045]" : "bg-white border-gray-200 text-[#1E1E1E]"
                          }`}
                        >
                          <input type="radio" name="jenisKelamin" checked={demographics.jenisKelamin === item} onChange={() => handleDemoChange("jenisKelamin", item)} className="accent-[#006A61] w-4 h-4 cursor-pointer" />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[16px] font-medium text-[#002045] mb-4">
                      Kelompok usia <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {["<25 tahun", "25–29 tahun", "30–34 tahun", "35–39 tahun", ">39 tahun"].map((item) => (
                        <label
                          key={item}
                          className={`w-full p-3.5 rounded-[8px] border text-[14px] font-normal flex items-center gap-3 cursor-pointer transition-all hover:bg-gray-50/80 hover:border-gray-300 ${
                            demographics.kelompokUsia === item ? "bg-[#E6F0F0] border-[#006A61] font-semibold text-[#002045]" : "bg-white border-gray-200 text-[#1E1E1E]"
                          }`}
                        >
                          <input type="radio" name="kelompokUsia" checked={demographics.kelompokUsia === item} onChange={() => handleDemoChange("kelompokUsia", item)} className="accent-[#006A61] w-4 h-4 cursor-pointer" />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[16px] font-medium text-[#002045] mb-4">
                      Pendidikan Terakhir <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {["D4/S1", "S2", "S3", "Lainnya"].map((item) => (
                        <label
                          key={item}
                          className={`w-full p-3.5 rounded-[8px] border text-[14px] font-normal flex items-center gap-3 cursor-pointer transition-all hover:bg-gray-50/80 hover:border-gray-300 ${
                            demographics.pendidikanTerakhir === item ? "bg-[#E6F0F0] border-[#006A61] font-semibold text-[#002045]" : "bg-white border-gray-200 text-[#1E1E1E]"
                          }`}
                        >
                          <input type="radio" name="pendidikanTerakhir" checked={demographics.pendidikanTerakhir === item} onChange={() => handleDemoChange("pendidikanTerakhir", item)} className="accent-[#006A61] w-4 h-4 cursor-pointer" />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[16px] font-medium text-[#002045] mb-4">
                      Latar belakang pendidikan utama <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {["Pendidikan Pancasila dan Kewarganegaraan/PKn", "Pendidikan Moral Pancasila dan Kewarganegaraan", "Hukum", "Ilmu Sosial/IPS", "Pendidikan lain", "Non-kependidikan", "Lainnya"].map((item) => (
                        <label
                          key={item}
                          className={`w-full p-3.5 rounded-[8px] border text-[14px] font-normal flex items-center gap-3 cursor-pointer transition-all hover:bg-gray-50/80 hover:border-gray-300 ${
                            demographics.latarBelakangPendidikan === item ? "bg-[#E6F0F0] border-[#006A61] font-semibold text-[#002045]" : "bg-white border-gray-200 text-[#1E1E1E]"
                          }`}
                        >
                          <input
                            type="radio"
                            name="latarBelakangPendidikan"
                            checked={demographics.latarBelakangPendidikan === item}
                            onChange={() => handleDemoChange("latarBelakangPendidikan", item)}
                            className="accent-[#006A61] w-4 h-4 cursor-pointer"
                          />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[16px] font-medium text-[#002045] mb-4">
                      Status sertifikasi pendidik <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {["Sudah tersertifikasi", "Belum tersertifikasi", "Dalam proses/menunggu", "Tidak menjawab"].map((item) => (
                        <label
                          key={item}
                          className={`w-full p-3.5 rounded-[8px] border text-[14px] font-normal flex items-center gap-3 cursor-pointer transition-all hover:bg-gray-50/80 hover:border-gray-300 ${
                            demographics.statusSertifikasi === item ? "bg-[#E6F0F0] border-[#006A61] font-semibold text-[#002045]" : "bg-white border-gray-200 text-[#1E1E1E]"
                          }`}
                        >
                          <input type="radio" name="statusSertifikasi" checked={demographics.statusSertifikasi === item} onChange={() => handleDemoChange("statusSertifikasi", item)} className="accent-[#006A61] w-4 h-4 cursor-pointer" />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[16px] font-medium text-[#002045] mb-4">
                      Status kepegawaian <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {["ASN/PNS", "PPPK", "Guru Tetap Yayasan", "GTT/Honorer", "Guru kontrak", "Lainnya"].map((item) => (
                        <label
                          key={item}
                          className={`w-full p-3.5 rounded-[8px] border text-[14px] font-normal flex items-center gap-3 cursor-pointer transition-all hover:bg-gray-50/80 hover:border-gray-300 ${
                            demographics.statusKepegawaian === item ? "bg-[#E6F0F0] border-[#006A61] font-semibold text-[#002045]" : "bg-white border-gray-200 text-[#1E1E1E]"
                          }`}
                        >
                          <input type="radio" name="statusKepegawaian" checked={demographics.statusKepegawaian === item} onChange={() => handleDemoChange("statusKepegawaian", item)} className="accent-[#006A61] w-4 h-4 cursor-pointer" />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-baseline mb-4">
                      <label className="block text-[16px] font-medium text-[#002045]">
                        Tugas tambahan di sekolah <span className="text-red-500">*</span>
                      </label>
                    </div>
                    <div className="space-y-2">
                      {["Tidak Ada", "Wali kelas", "Wakil kepala sekolah", "Koordinator/pembina kegiatan kesiswaan", "Pembina OSIS/ekstrakurikuler", "Pengurus MGMP", "Fasilitator/mentor guru", "Lainnya"].map((item) => {
                        const isChecked = demographics.tugasTambahan?.split(", ").includes(item);

                        return (
                          <label
                            key={item}
                            className={`w-full p-3.5 rounded-[8px] border text-[14px] font-normal flex items-center gap-3 cursor-pointer transition-all hover:bg-gray-50/80 hover:border-gray-300 ${
                              isChecked ? "bg-[#E6F0F0] border-[#006A61] font-semibold text-[#002045]" : "bg-white border-gray-200 text-[#1E1E1E]"
                            }`}
                          >
                            <input type="checkbox" checked={isChecked} onChange={() => handleCheckboxToggle("tugasTambahan", item, "Tidak Ada")} className="accent-[#006A61] w-4 h-4 rounded-[4px] cursor-pointer" />
                            <span>{item}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-STEP 2 */}
              {demoSubStep === 2 && (
                <div className="space-y-8 animate-in fade-in">
                  <div>
                    <label className="block text-[16px] font-medium text-[#002045] mb-4">
                      Status satuan pendidikan <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {["Negeri", "Swasta"].map((item) => (
                        <label
                          key={item}
                          className={`w-full p-3.5 rounded-[8px] border text-[14px] font-normal flex items-center gap-3 cursor-pointer transition-all hover:bg-gray-50/80 hover:border-gray-300 ${
                            demographics.statusSatuanPendidikan === item ? "bg-[#E6F0F0] border-[#006A61] font-semibold text-[#002045]" : "bg-white border-gray-200 text-[#1E1E1E]"
                          }`}
                        >
                          <input
                            type="radio"
                            name="statusSatuanPendidikan"
                            checked={demographics.statusSatuanPendidikan === item}
                            onChange={() => handleDemoChange("statusSatuanPendidikan", item)}
                            className="accent-[#006A61] w-4 h-4 cursor-pointer"
                          />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[16px] font-medium text-[#002045] mb-4">Nama sekolah (opsional)</label>
                    <input
                      type="text"
                      value={demographics.namaSekolah ?? ""}
                      onChange={(e) => handleDemoChange("namaSekolah", e.target.value)}
                      placeholder="Jawaban Anda"
                      className="w-full p-3.5 text-[14px] bg-white border border-gray-200 rounded-[8px] focus:outline-none focus:border-[#006A61] hover:border-gray-300 transition-colors placeholder:text-gray-300 text-[#1E1E1E]"
                    />
                  </div>

                  <div>
                    <label className="block text-[16px] font-medium text-[#002045] mb-4">NPSN sekolah (opsional)</label>
                    <input
                      type="text"
                      value={demographics.npsnSekolah}
                      onChange={(e) => handleDemoChange("npsnSekolah", e.target.value)}
                      placeholder="Jawaban Anda"
                      className="w-full p-3.5 text-[14px] bg-white border border-gray-200 rounded-[8px] focus:outline-none focus:border-[#006A61] hover:border-gray-300 transition-colors placeholder:text-gray-300 text-[#1E1E1E]"
                    />
                  </div>

                  <div>
                    <label className="block text-[16px] font-medium text-[#002045] mb-4">
                      Kecamatan lokasi sekolah di Kota Surabaya <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={demographics.kecamatanLokasi}
                      onChange={(e) => handleDemoChange("kecamatanLokasi", e.target.value)}
                      placeholder="Jawaban Anda"
                      className="w-full p-3.5 text-[14px] bg-white border border-gray-200 rounded-[8px] focus:outline-none focus:border-[#006A61] hover:border-gray-300 transition-colors placeholder:text-gray-300 text-[#1E1E1E]"
                    />
                  </div>

                  <div>
                    <label className="block text-[16px] font-medium text-[#002045] mb-4">
                      Wilayah sekolah <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {["Surabaya Pusat", "Surabaya Utara", "Surabaya Timur", "Surabaya Selatan", "Surabaya Barat"].map((item) => (
                        <label
                          key={item}
                          className={`w-full p-3.5 rounded-[8px] border text-[14px] font-normal flex items-center gap-3 cursor-pointer transition-all hover:bg-gray-50/80 hover:border-gray-300 ${
                            demographics.wilayahSekolah === item ? "bg-[#E6F0F0] border-[#006A61] font-semibold text-[#002045]" : "bg-white border-gray-200 text-[#1E1E1E]"
                          }`}
                        >
                          <input type="radio" name="wilayahSekolah" checked={demographics.wilayahSekolah === item} onChange={() => handleDemoChange("wilayahSekolah", item)} className="accent-[#006A61] w-4 h-4 cursor-pointer" />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[16px] font-medium text-[#002045] mb-4">
                      Akreditasi sekolah <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {["A/Unggul", "B/Baik Sekali", "C/Baik", "Belum terakreditasi", "Tidak mengetahui"].map((item) => (
                        <label
                          key={item}
                          className={`w-full p-3.5 rounded-[8px] border text-[14px] font-normal flex items-center gap-3 cursor-pointer transition-all hover:bg-gray-50/80 hover:border-gray-300 ${
                            demographics.akreditasiSekolah === item ? "bg-[#E6F0F0] border-[#006A61] font-semibold text-[#002045]" : "bg-white border-gray-200 text-[#1E1E1E]"
                          }`}
                        >
                          <input type="radio" name="akreditasiSekolah" checked={demographics.akreditasiSekolah === item} onChange={() => handleDemoChange("akreditasiSekolah", item)} className="accent-[#006A61] w-4 h-4 cursor-pointer" />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[16px] font-medium text-[#002045] mb-4">
                      Kurikulum yang dominan digunakan <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {["Kurikulum Merdeka", "Kurikulum 2013", "Kombinasi/transisi", "Lainnya/tidak mengetahui"].map((item) => (
                        <label
                          key={item}
                          className={`w-full p-3.5 rounded-[8px] border text-[14px] font-normal flex items-center gap-3 cursor-pointer transition-all hover:bg-gray-50/80 hover:border-gray-300 ${
                            demographics.kurikulumDominan === item ? "bg-[#E6F0F0] border-[#006A61] font-semibold text-[#002045]" : "bg-white border-gray-200 text-[#1E1E1E]"
                          }`}
                        >
                          <input type="radio" name="kurikulumDominan" checked={demographics.kurikulumDominan === item} onChange={() => handleDemoChange("kurikulumDominan", item)} className="accent-[#006A61] w-4 h-4 cursor-pointer" />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-STEP 3 */}
              {demoSubStep === 3 && (
                <div className="space-y-8 animate-in fade-in">
                  <div>
                    <label className="block text-[16px] font-medium text-[#002045] mb-4">
                      Total lama mengajar sebagai guru <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {["<1 tahun", "1–3 tahun", "4–5 tahun", "6–10 tahun", "11–15 tahun", "16–20 tahun", ">20 tahun"].map((item) => (
                        <label
                          key={item}
                          className={`w-full p-3.5 rounded-[8px] border text-[14px] font-normal flex items-center gap-3 cursor-pointer transition-all hover:bg-gray-50/80 hover:border-gray-300 ${
                            demographics.totalLamaMengajar === item ? "bg-[#E6F0F0] border-[#006A61] font-semibold text-[#002045]" : "bg-white border-gray-200 text-[#1E1E1E]"
                          }`}
                        >
                          <input type="radio" name="totalLamaMengajar" checked={demographics.totalLamaMengajar === item} onChange={() => handleDemoChange("totalLamaMengajar", item)} className="accent-[#006A61] w-4 h-4 cursor-pointer" />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[16px] font-medium text-[#002045] mb-4">
                      Lama mengajar Pendidikan Pancasila/PPKn <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {["<1 tahun", "1–3 tahun", "4–5 tahun", "6–10 tahun", "11–15 tahun", "16–20 tahun", ">20 tahun"].map((item) => (
                        <label
                          key={item}
                          className={`w-full p-3.5 rounded-[8px] border text-[14px] font-normal flex items-center gap-3 cursor-pointer transition-all hover:bg-gray-50/80 hover:border-gray-300 ${
                            demographics.lamaMengajarPPKn === item ? "bg-[#E6F0F0] border-[#006A61] font-semibold text-[#002045]" : "bg-white border-gray-200 text-[#1E1E1E]"
                          }`}
                        >
                          <input type="radio" name="lamaMengajarPPKn" checked={demographics.lamaMengajarPPKn === item} onChange={() => handleDemoChange("lamaMengajarPPKn", item)} className="accent-[#006A61] w-4 h-4 cursor-pointer" />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[16px] font-medium text-[#002045] mb-4">
                      Lama mengajar di sekolah saat ini <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {["<1 tahun", "1–3 tahun", "4–5 tahun", "6–10 tahun", "11–15 tahun", "16–20 tahun", ">20 tahun"].map((item) => (
                        <label
                          key={item}
                          className={`w-full p-3.5 rounded-[8px] border text-[14px] font-normal flex items-center gap-3 cursor-pointer transition-all hover:bg-gray-50/80 hover:border-gray-300 ${
                            demographics.lamaMengajarSekolahSaatIni === item ? "bg-[#E6F0F0] border-[#006A61] font-semibold text-[#002045]" : "bg-white border-gray-200 text-[#1E1E1E]"
                          }`}
                        >
                          <input
                            type="radio"
                            name="lamaMengajarSekolahSaatIni"
                            checked={demographics.lamaMengajarSekolahSaatIni === item}
                            onChange={() => handleDemoChange("lamaMengajarSekolahSaatIni", item)}
                            className="accent-[#006A61] w-4 h-4 cursor-pointer"
                          />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[16px] font-medium text-[#002045] mb-4">
                      Kelas yang diajar pada tahun ajaran/semester berjalan <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {["Kelas VII", "Kelas VIII", "Kelas IX", "Kelas X", "Kelas XI", "Kelas XII"].map((item) => (
                        <label
                          key={item}
                          className={`w-full p-3.5 rounded-[8px] border text-[14px] font-normal flex items-center gap-3 cursor-pointer transition-all hover:bg-gray-50/80 hover:border-gray-300 ${
                            demographics.kelasYangDiajar === item ? "bg-[#E6F0F0] border-[#006A61] font-semibold text-[#002045]" : "bg-white border-gray-200 text-[#1E1E1E]"
                          }`}
                        >
                          <input type="radio" name="kelasYangDiajar" checked={demographics.kelasYangDiajar === item} onChange={() => handleDemoChange("kelasYangDiajar", item)} className="accent-[#006A61] w-4 h-4 cursor-pointer" />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[16px] font-medium text-[#002045] mb-4">
                      Jumlah rombongan belajar/kelas PPKn yang diampu semester ini <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {["1–2 kelas", "3–4 kelas", "5–6 kelas", "7–8 kelas", ">8 kelas"].map((item) => (
                        <label
                          key={item}
                          className={`w-full p-3.5 rounded-[8px] border text-[14px] font-normal flex items-center gap-3 cursor-pointer transition-all hover:bg-gray-50/80 hover:border-gray-300 ${
                            demographics.jumlahRombelPPKn === item ? "bg-[#E6F0F0] border-[#006A61] font-semibold text-[#002045]" : "bg-white border-gray-200 text-[#1E1E1E]"
                          }`}
                        >
                          <input type="radio" name="jumlahRombelPPKn" checked={demographics.jumlahRombelPPKn === item} onChange={() => handleDemoChange("jumlahRombelPPKn", item)} className="accent-[#006A61] w-4 h-4 cursor-pointer" />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[16px] font-medium text-[#002045] mb-4">
                      Beban jam mengajar PPKn per minggu <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {["1–6 JP", "7–12 JP", "13–18 JP", "19–24 JP", ">24 JP"].map((item) => (
                        <label
                          key={item}
                          className={`w-full p-3.5 rounded-[8px] border text-[14px] font-normal flex items-center gap-3 cursor-pointer transition-all hover:bg-gray-50/80 hover:border-gray-300 ${
                            demographics.bebanJamPPKn === item ? "bg-[#E6F0F0] border-[#006A61] font-semibold text-[#002045]" : "bg-white border-gray-200 text-[#1E1E1E]"
                          }`}
                        >
                          <input type="radio" name="bebanJamPPKn" checked={demographics.bebanJamPPKn === item} onChange={() => handleDemoChange("bebanJamPPKn", item)} className="accent-[#006A61] w-4 h-4 cursor-pointer" />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[16px] font-medium text-[#002045] mb-4">
                      Rata rata jumlah murid per kelas <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {["<20 murid", "20–25 murid", "26–30 murid", "31–35 murid", "36–40 murid", ">40 murid"].map((item) => (
                        <label
                          key={item}
                          className={`w-full p-3.5 rounded-[8px] border text-[14px] font-normal flex items-center gap-3 cursor-pointer transition-all hover:bg-gray-50/80 hover:border-gray-300 ${
                            demographics.rataMuridPerKelas === item ? "bg-[#E6F0F0] border-[#006A61] font-semibold text-[#002045]" : "bg-white border-gray-200 text-[#1E1E1E]"
                          }`}
                        >
                          <input type="radio" name="rataMuridPerKelas" checked={demographics.rataMuridPerKelas === item} onChange={() => handleDemoChange("rataMuridPerKelas", item)} className="accent-[#006A61] w-4 h-4 cursor-pointer" />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[16px] font-medium text-[#002045] mb-4">
                      Apakah Bapak/Ibu juga mengajar mata pelajaran lain? <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2 mb-3">
                      {["Tidak", "Ya"].map((item) => (
                        <label
                          key={item}
                          className={`w-full p-3.5 rounded-[8px] border text-[14px] font-normal flex items-center gap-3 cursor-pointer transition-all hover:bg-gray-50/80 hover:border-gray-300 ${
                            demographics.mengajarMapelLain === item ? "bg-[#E6F0F0] border-[#006A61] font-semibold text-[#002045]" : "bg-white border-gray-200 text-[#1E1E1E]"
                          }`}
                        >
                          <input type="radio" name="mengajarMapelLain" checked={demographics.mengajarMapelLain === item} onChange={() => handleDemoChange("mengajarMapelLain", item)} className="accent-[#006A61] w-4 h-4 cursor-pointer" />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>

                    {demographics.mengajarMapelLain === "Ya" && (
                      <div className="animate-in fade-in pt-2">
                        <label className="block text-[16px] font-medium text-[#002045] mb-4">
                          Jika ya, sebutkan mata pelajaran lain yang diajar <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={demographics.namaMapelLain}
                          onChange={(e) => handleDemoChange("namaMapelLain", e.target.value)}
                          placeholder="Jawaban Anda"
                          className="w-full p-3.5 text-[14px] bg-white border border-gray-200 rounded-[8px] focus:outline-none focus:border-[#006A61] hover:border-gray-300 transition-colors placeholder:text-gray-300 text-[#1E1E1E]"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SUB-STEP 4 */}
              {demoSubStep === 4 && (
                <div className="space-y-8 animate-in fade-in">
                  <div>
                    <label className="block text-[16px] font-medium text-[#002045] mb-4">
                      Keaktifan dalam MGMP/komunitas guru PPKn <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {["Aktif", "Terdaftar tetapi tidak aktif", "Tidak tergabung", "Tidak mengetahui"].map((item) => (
                        <label
                          key={item}
                          className={`w-full p-3.5 rounded-[8px] border text-[14px] font-normal flex items-center gap-3 cursor-pointer transition-all hover:bg-gray-50/80 hover:border-gray-300 ${
                            demographics.keaktifanMGMP === item ? "bg-[#E6F0F0] border-[#006A61] font-semibold text-[#002045]" : "bg-white border-gray-200 text-[#1E1E1E]"
                          }`}
                        >
                          <input type="radio" name="keaktifanMGMP" checked={demographics.keaktifanMGMP === item} onChange={() => handleDemoChange("keaktifanMGMP", item)} className="accent-[#006A61] w-4 h-4 cursor-pointer" />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[16px] font-medium text-[#002045] mb-4">
                      Frekuensi mengikuti kegiatan MGMP/komunitas guru dalam 1 tahun terakhir <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {["Tidak pernah", "1–2 kali", "3–5 kali", "Sekitar sekali per bulan", "Lebih dari sekali per bulan"].map((item) => (
                        <label
                          key={item}
                          className={`w-full p-3.5 rounded-[8px] border text-[14px] font-normal flex items-center gap-3 cursor-pointer transition-all hover:bg-gray-50/80 hover:border-gray-300 ${
                            demographics.frekuensiMGMP === item ? "bg-[#E6F0F0] border-[#006A61] font-semibold text-[#002045]" : "bg-white border-gray-200 text-[#1E1E1E]"
                          }`}
                        >
                          <input type="radio" name="frekuensiMGMP" checked={demographics.frekuensiMGMP === item} onChange={() => handleDemoChange("frekuensiMGMP", item)} className="accent-[#006A61] w-4 h-4 cursor-pointer" />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[16px] font-medium text-[#002045] mb-4">
                      Jumlah pelatihan/workshop/seminar profesional yang diikuti dalam 2 tahun terakhir <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {["0", "1–2 kegiatan", "3–5 kegiatan", "6-10 kegiatan", ">10 kegiatan"].map((item) => (
                        <label
                          key={item}
                          className={`w-full p-3.5 rounded-[8px] border text-[14px] font-normal flex items-center gap-3 cursor-pointer transition-all hover:bg-gray-50/80 hover:border-gray-300 ${
                            demographics.jumlahPelatihan2Tahun === item ? "bg-[#E6F0F0] border-[#006A61] font-semibold text-[#002045]" : "bg-white border-gray-200 text-[#1E1E1E]"
                          }`}
                        >
                          <input
                            type="radio"
                            name="jumlahPelatihan2Tahun"
                            checked={demographics.jumlahPelatihan2Tahun === item}
                            onChange={() => handleDemoChange("jumlahPelatihan2Tahun", item)}
                            className="accent-[#006A61] w-4 h-4 cursor-pointer"
                          />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-baseline mb-4">
                      <label className="block text-[16px] font-medium text-[#002045]">
                        Topik pengembangan profesional yang pernah diikuti dalam 2 tahun terakhir <span className="text-red-500">*</span>
                      </label>
                    </div>
                    <div className="space-y-2">
                      {[
                        "Kurikulum Merdeka",
                        "Pendidikan Pancasila/PPKn",
                        "Asesmen autentik",
                        "Pembelajaran berdiferensiasi",
                        "Literasi digital/kewarganegaraan digital",
                        "Pencegahan hoaks/disinformasi",
                        "Pendidikan inklusif/anti diskriminasi",
                        "Penelitian tindakan kelas",
                        "Belum pernah",
                        "Lainnya",
                      ].map((item) => {
                        const isChecked = demographics.topikPengembanganProfesi?.split(", ").includes(item);

                        return (
                          <label
                            key={item}
                            className={`w-full p-3.5 rounded-[8px] border text-[14px] font-normal flex items-center gap-3 cursor-pointer transition-all hover:bg-gray-50/80 hover:border-gray-300 ${
                              isChecked ? "bg-[#E6F0F0] border-[#006A61] font-semibold text-[#002045]" : "bg-white border-gray-200 text-[#1E1E1E]"
                            }`}
                          >
                            <input type="checkbox" checked={isChecked} onChange={() => handleCheckboxToggle("topikPengembanganProfesi", item, "Belum pernah")} className="accent-[#006A61] w-4 h-4 rounded-[4px] cursor-pointer" />
                            <span>{item}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[16px] font-medium text-[#002045] mb-4">
                      Pengalaman melakukan PTK/inkuiri kelas dalam 3 tahun terakhir <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {["Belum pernah", "Pernah 1 kali", "Pernah 2–3 kali", "Lebih dari 3 kali"].map((item) => (
                        <label
                          key={item}
                          className={`w-full p-3.5 rounded-[8px] border text-[14px] font-normal flex items-center gap-3 cursor-pointer transition-all hover:bg-gray-50/80 hover:border-gray-300 ${
                            demographics.pengalamanPTK === item ? "bg-[#E6F0F0] border-[#006A61] font-semibold text-[#002045]" : "bg-white border-gray-200 text-[#1E1E1E]"
                          }`}
                        >
                          <input type="radio" name="pengalamanPTK" checked={demographics.pengalamanPTK === item} onChange={() => handleDemoChange("pengalamanPTK", item)} className="accent-[#006A61] w-4 h-4 cursor-pointer" />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[16px] font-medium text-[#002045] mb-4">
                      Pengalaman berbagi praktik baik/publikasi/presentasi profesional <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {["Belum pernah", "Tingkat sekolah", "Tingkat kota/kabupaten", "Tingkat provinsi", "Tingkat nasional/internasional"].map((item) => (
                        <label
                          key={item}
                          className={`w-full p-3.5 rounded-[8px] border text-[14px] font-normal flex items-center gap-3 cursor-pointer transition-all hover:bg-gray-50/80 hover:border-gray-300 ${
                            demographics.pengalamanBerbagiPraktikBaik === item ? "bg-[#E6F0F0] border-[#006A61] font-semibold text-[#002045]" : "bg-white border-gray-200 text-[#1E1E1E]"
                          }`}
                        >
                          <input
                            type="radio"
                            name="pengalamanBerbagiPraktikBaik"
                            checked={demographics.pengalamanBerbagiPraktikBaik === item}
                            onChange={() => handleDemoChange("pengalamanBerbagiPraktikBaik", item)}
                            className="accent-[#006A61] w-4 h-4 cursor-pointer"
                          />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[16px] font-medium text-[#002045] mb-4">
                      Kondisi dukungan internet/perangkat digital di sekolah <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {["Sangat memadai", "Memadai", "Terbatas", "Sangat terbatas", "Tidak tersedia/tidak mengetahui"].map((item) => (
                        <label
                          key={item}
                          className={`w-full p-3.5 rounded-[8px] border text-[14px] font-normal flex items-center gap-3 cursor-pointer transition-all hover:bg-gray-50/80 hover:border-gray-300 ${
                            demographics.kondisiInternetSekolah === item ? "bg-[#E6F0F0] border-[#006A61] font-semibold text-[#002045]" : "bg-white border-gray-200 text-[#1E1E1E]"
                          }`}
                        >
                          <input
                            type="radio"
                            name="kondisiInternetSekolah"
                            checked={demographics.kondisiInternetSekolah === item}
                            onChange={() => handleDemoChange("kondisiInternetSekolah", item)}
                            className="accent-[#006A61] w-4 h-4 cursor-pointer"
                          />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[16px] font-medium text-[#002045] mb-4">
                      Frekuensi membahas isu publik aktual atau isu sensitif dalam pembelajaran <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {["Tidak pernah", "Jarang", "Kadang kadang", "Sering", "Sangat sering"].map((item) => (
                        <label
                          key={item}
                          className={`w-full p-3.5 rounded-[8px] border text-[14px] font-normal flex items-center gap-3 cursor-pointer transition-all hover:bg-gray-50/80 hover:border-gray-300 ${
                            demographics.frekuensiIsuPublik === item ? "bg-[#E6F0F0] border-[#006A61] font-semibold text-[#002045]" : "bg-white border-gray-200 text-[#1E1E1E]"
                          }`}
                        >
                          <input type="radio" name="frekuensiIsuPublik" checked={demographics.frekuensiIsuPublik === item} onChange={() => handleDemoChange("frekuensiIsuPublik", item)} className="accent-[#006A61] w-4 h-4 cursor-pointer" />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[16px] font-medium text-[#002045] mb-4">
                      Tingkat keberagaman latar belakang murid yang Bapak/Ibu ajar menurut persepsi profesional <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {["Rendah", "Sedang", "Tinggi", "Sangat tinggi", "Tidak dapat menilai"].map((item) => (
                        <label
                          key={item}
                          className={`w-full p-3.5 rounded-[8px] border text-[14px] font-normal flex items-center gap-3 cursor-pointer transition-all hover:bg-gray-50/80 hover:border-gray-300 ${
                            demographics.keberagamanMurid === item ? "bg-[#E6F0F0] border-[#006A61] font-semibold text-[#002045]" : "bg-white border-gray-200 text-[#1E1E1E]"
                          }`}
                        >
                          <input type="radio" name="keberagamanMurid" checked={demographics.keberagamanMurid === item} onChange={() => handleDemoChange("keberagamanMurid", item)} className="accent-[#006A61] w-4 h-4 cursor-pointer" />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[16px] font-medium text-[#002045] mb-4">
                      Kesediaan dihubungi untuk wawancara/konfirmasi data lanjutan <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {["Ya", "Tidak"].map((item) => (
                        <label
                          key={item}
                          className={`w-full p-3.5 rounded-[8px] border text-[14px] font-normal flex items-center gap-3 cursor-pointer transition-all hover:bg-gray-50/80 hover:border-gray-300 ${
                            demographics.kesediaanWawancara === item ? "bg-[#E6F0F0] border-[#006A61] font-semibold text-[#002045]" : "bg-white border-gray-200 text-[#1E1E1E]"
                          }`}
                        >
                          <input type="radio" name="kesediaanWawancara" checked={demographics.kesediaanWawancara === item} onChange={() => handleDemoChange("kesediaanWawancara", item)} className="accent-[#006A61] w-4 h-4 cursor-pointer" />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[16px] font-medium text-[#002045] mb-4">Kontak untuk tindak lanjut (opsional)</label>
                    <input
                      type="text"
                      value={demographics.kontakTindakLanjut}
                      onChange={(e) => handleDemoChange("kontakTindakLanjut", e.target.value)}
                      placeholder="Jawaban Anda"
                      className="w-full p-3.5 text-[14px] bg-white border border-gray-200 rounded-[8px] focus:outline-none focus:border-[#006A61] hover:border-gray-300 transition-colors placeholder:text-gray-300 text-[#1E1E1E]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex justify-between items-center w-full pt-2">
              <button
                type="button"
                onClick={() => {
                  if (demoSubStep > 1) {
                    setDemoSubStep((prev) => prev - 1);
                  } else {
                    setStep(2);
                  }
                  scrollToTop();
                }}
                className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 text-[#002045] text-[14px] font-medium rounded-[8px] hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98] cursor-pointer transition-all shadow-xs"
              >
                <ArrowLeft className="w-4 h-4" /> Sebelumnya
              </button>

              {demoSubStep < 4 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (!validateDemoSubStep(demoSubStep)) {
                      showAlert("Harap jawab semua pertanyaan bertanda bintang (*) sebelum melanjutkan.", "Peringatan", "warning");
                      return;
                    }
                    setDemoSubStep((prev) => prev + 1);
                    scrollToTop();
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#002045] hover:bg-[#001833] hover:shadow-md active:scale-[0.98] cursor-pointer text-white text-[14px] font-medium rounded-[8px] transition-all shadow-xs"
                >
                  Selanjutnya <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (!validateDemoSubStep(4)) {
                      showAlert("Harap jawab semua pertanyaan bertanda bintang (*) sebelum memulai assessment.", "Peringatan", "warning");
                      return;
                    }
                    setStartTime(Date.now());
                    setCurrentDimensionIndex(0);
                    setStep(4);
                    scrollToTop();
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#006A61] hover:bg-[#00544d] hover:shadow-md active:scale-[0.98] cursor-pointer text-white text-[14px] font-medium rounded-[8px] transition-all shadow-xs"
                >
                  <UserCheck className="w-4 h-4" /> Mulai Assessment
                </button>
              )}
            </div>
          </div>
        )}

        {/* ==================== STEP 4: PENGERJAAN SOAL PER DIMENSI ==================== */}
        {step === 4 && currentDimensionGroup && (
          <div className="max-w-4xl mx-auto w-full space-y-6 animate-in fade-in duration-200">
            {/* Header Bagian Dimensi */}
            <div>
              <span className="text-[12px] font-bold text-[#006A61] uppercase tracking-wider block mb-1">DIMENSI ASSESSMENT</span>
              <div className="flex justify-between items-end gap-3">
                <h2 className="text-xl sm:text-2xl font-bold text-[#002045]">{currentDimensionGroup.dimensionName}</h2>
                <span className="text-[12px] font-medium text-gray-400 shrink-0">
                  Bagian {currentDimensionIndex + 1}/{groupedDimensions.length}
                </span>
              </div>

              {/* Progress Bar Track */}
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mt-3">
                <div className="h-full bg-[#006A61] transition-all duration-300 rounded-full" style={{ width: `${dimensionProgressPercent}%` }} />
              </div>
            </div>

            {/* List Soal-soal Dimensi Aktif */}
            <div className="space-y-6">
              {currentDimensionGroup.questions.map((q) => (
                <div key={q.id} className="bg-white border border-gray-200/80 rounded-[8px] p-6 md:p-8 shadow-xs space-y-6">
                  <p className="text-[16px] font-medium text-[#1E1E1E] leading-relaxed">
                    {q.questionText} <span className="text-red-500">*</span>
                  </p>

                  {/* 1. TIPE SCALE */}
                  {q.type === "SCALE" ? (
                    <div className="pt-2">
                      <div className="flex items-center justify-between gap-3 md:gap-8 max-w-2xl mx-auto">
                        <span className="text-[14px] font-normal text-[#64748B] text-right flex-1 leading-tight">{q.scaleMinLabel || "Sangat Tidak Sesuai"}</span>

                        <div className="flex items-center gap-2 md:gap-4 shrink-0">
                          {Array.from(
                            {
                              length: (q.scaleMax || 5) - (q.scaleMin || 1) + 1,
                            },
                            (_, i) => (q.scaleMin || 1) + i,
                          ).map((scoreVal) => {
                            const isSelected = userAnswers[q.id] === scoreVal;

                            return (
                              <button
                                key={scoreVal}
                                type="button"
                                onClick={() => handleSelectQuestionAnswer(q.id, scoreVal)}
                                className={`w-11 h-11 md:w-14 md:h-14 rounded-[8px] font-bold text-[14px] transition-all flex items-center justify-center border cursor-pointer ${
                                  isSelected ? "bg-[#002045] text-white border-[#002045] shadow-md scale-105" : "bg-white text-[#002045] border-gray-200 hover:bg-gray-50/80 hover:border-gray-300 hover:scale-105"
                                }`}
                              >
                                {scoreVal}
                              </button>
                            );
                          })}
                        </div>

                        <span className="text-[14px] font-normal text-[#64748B] text-left flex-1 leading-tight">{q.scaleMaxLabel || "Sangat Sesuai"}</span>
                      </div>
                    </div>
                  ) : q.type === "CHECKBOX" ? (
                    /* 2. TIPE CHECKBOX (BISA PILIH LEBIH DARI SATU) */
                    <div className="space-y-2.5">
                      {q.options && q.options.length > 0 ? (
                        q.options.map((opt, optIdx) => {
                          const currentVal = userAnswers[q.id];
                          const isChecked = Array.isArray(currentVal) && currentVal.includes(optIdx);

                          return (
                            <label
                              key={optIdx}
                              className={`w-full p-4 rounded-[8px] border text-[14px] font-normal flex items-start gap-4 cursor-pointer transition-all hover:bg-gray-50/80 hover:border-gray-300 ${
                                isChecked ? "bg-[#E6F0F0] border-[#006A61] font-semibold text-[#002045]" : "bg-white border-gray-200/80 text-[#1E1E1E]"
                              }`}
                            >
                              <input type="checkbox" checked={isChecked} onChange={() => handleQuestionCheckboxToggle(q.id, optIdx)} className="accent-[#006A61] w-4 h-4 rounded-[4px] mt-0.5 cursor-pointer" />
                              <span className="text-[14px] font-normal leading-relaxed">{opt.text}</span>
                            </label>
                          );
                        })
                      ) : (
                        <p className="text-xs text-gray-400 italic">Tidak ada opsi checkbox tersedia.</p>
                      )}
                    </div>
                  ) : q.type === "DROPDOWN" ? (
                    /* 3. TIPE DROPDOWN */
                    <div className="relative pt-1">
                      <select
                        value={userAnswers[q.id] !== undefined ? (userAnswers[q.id] as number | string) : ""}
                        onChange={(e) => handleSelectQuestionAnswer(q.id, e.target.value === "" ? "" : Number(e.target.value))}
                        className="w-full appearance-none p-3.5 text-[14px] bg-white border border-gray-200 rounded-[8px] focus:outline-none focus:border-[#006A61] hover:border-gray-300 cursor-pointer transition-colors text-[#1E1E1E]"
                      >
                        <option value="" disabled>
                          Pilih salah satu jawaban
                        </option>
                        {q.options?.map((opt, optIdx) => (
                          <option key={optIdx} value={optIdx}>
                            {opt.text}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  ) : q.type === "MULTIPLE_CHOICE" ? (
                    /* 4. TIPE MULTIPLE CHOICE (PILIHAN GANDA A, B, C, D) */
                    <div className="space-y-2.5">
                      {q.options && q.options.length > 0 ? (
                        q.options.map((opt, optIdx) => {
                          const isSelected = userAnswers[q.id] === optIdx;
                          const optionLabel = opt.label || String.fromCharCode(65 + optIdx);

                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => handleSelectQuestionAnswer(q.id, optIdx)}
                              className={`w-full p-4 rounded-[8px] text-left border transition-all flex items-start gap-4 cursor-pointer hover:bg-gray-50/80 hover:border-gray-300 ${
                                isSelected ? "bg-[#E6F0F0] border-[#006A61] text-[#002045]" : "bg-white border-gray-200/80 text-[#1E1E1E]"
                              }`}
                            >
                              <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs md:text-sm shrink-0 transition-colors ${isSelected ? "bg-[#006A61] text-white" : "bg-gray-100 text-[#002045]"}`}>
                                {optionLabel}
                              </span>
                              <span className="text-[14px] font-normal pt-0.5 leading-relaxed">{opt.text}</span>
                            </button>
                          );
                        })
                      ) : (
                        <p className="text-xs text-gray-400 italic">Tidak ada opsi multiple choice tersedia.</p>
                      )}
                    </div>
                  ) : q.type === "SHORT_TEXT" ? (
                    /* 5. TIPE SHORT TEXT (1 BARIS) */
                    <div className="pt-2">
                      <input
                        type="text"
                        value={(userAnswers[q.id] as string) || ""}
                        onChange={(e) => handleSelectQuestionAnswer(q.id, e.target.value)}
                        placeholder="Tuliskan jawaban singkat Anda di sini..."
                        className="w-full p-3.5 text-[14px] font-normal bg-white border border-gray-200 rounded-[8px] focus:outline-none focus:border-[#006A61] hover:border-gray-300 transition-colors placeholder:text-gray-300 text-[#1E1E1E]"
                      />
                    </div>
                  ) : (
                    /* 6. TIPE LONG TEXT (TEXTAREA URAIAN) */
                    <div className="pt-2">
                      <textarea
                        rows={4}
                        value={(userAnswers[q.id] as string) || ""}
                        onChange={(e) => handleSelectQuestionAnswer(q.id, e.target.value)}
                        placeholder="Tuliskan jawaban Anda di sini..."
                        className="w-full p-4 text-[14px] font-normal bg-white border border-gray-200 rounded-[8px] focus:outline-none focus:border-[#006A61] hover:border-gray-300 transition-colors resize-none placeholder:text-gray-300 text-[#1E1E1E]"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* ACTION BUTTONS NAVIGASI PER DIMENSI */}
            <div className="flex justify-between items-center w-full pt-4">
              <button
                type="button"
                onClick={handlePrevDimension}
                className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-[8px] text-[14px] font-medium text-[#002045] hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98] cursor-pointer transition-all shadow-xs"
              >
                <ArrowLeft className="w-4 h-4" /> Sebelumnya
              </button>

              {currentDimensionIndex < groupedDimensions.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNextDimension}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#002045] hover:bg-[#001833] hover:shadow-md active:scale-[0.98] cursor-pointer text-white text-[14px] font-medium rounded-[8px] transition-all shadow-xs"
                >
                  Selanjutnya <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSubmitAssessment}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#006A61] hover:bg-[#00544d] hover:shadow-md active:scale-[0.98] cursor-pointer text-white text-[14px] font-semibold rounded-[8px] transition-all shadow-xs disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" /> {isSubmitting ? "Selesai..." : "Selesaikan Assessment"}
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="py-4 text-center text-[11px] text-gray-400 border-t border-gray-100 bg-white shrink-0">© 2026 Civix.id. All rights reserved</footer>
    </div>
  );
}
