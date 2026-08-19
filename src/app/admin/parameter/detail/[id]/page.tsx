"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronRight, ArrowLeft, ChevronLeft } from "lucide-react";
import { getCategoryDetailWithQuestions } from "../../actions";

interface QuestionOption {
  id?: string;
  label?: string;
  text: string;
  score: number;
}

interface QuestionItem {
  id: string;
  code: string;
  questionText: string;
  dimension: string;
  type: string;
  status: string;
  options: QuestionOption[];
}

interface CategoryDetailData {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  status: string;
  totalQuestions: number;
  questions: QuestionItem[];
}

export default function DetailParameterPage() {
  const params = useParams();
  const id = params.id as string;

  const [categoryData, setCategoryData] = useState<CategoryDetailData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      try {
        const data = await getCategoryDetailWithQuestions(id);
        setCategoryData(data as CategoryDetailData);
      } catch (error) {
        console.error("Gagal mengambil data detail parameter:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center text-sm text-[#64748B]">Memuat detail parameter dimensi...</div>;
  }

  if (!categoryData) {
    return (
      <div className="space-y-4 p-8 text-center">
        <p className="text-sm font-semibold text-rose-500">Data parameter dimensi tidak ditemukan.</p>
        <Link href="/admin/parameter" className="inline-flex items-center text-xs font-semibold text-[#002045] hover:underline">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Kembali ke Parameter
        </Link>
      </div>
    );
  }

  const isActive = categoryData.status === "ACTIVE";
  const questions = categoryData.questions || [];

  // Logika Pagination
  const totalItems = questions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentQuestions = questions.slice(startIndex, endIndex);

  return (
    <div className="space-y-6 w-full pb-10">
      {/* Breadcrumb & Header */}
      <div className="space-y-1">
        <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs text-[#64748B]">
          <Link href="/admin/parameter" className="hover:text-[#002045] hover:underline transition-colors font-medium">
            Parameter Assessment
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="font-semibold text-[#002045]">Detail Dimensi Kompetensi</span>
        </nav>
        <h1 className="text-2xl font-semibold text-[#002045] pt-1">Detail Dimensi Kompetensi</h1>
      </div>

      {/* Grid Utama: Kolom Kiri (Informasi Dimensi + Tabel Soal) & Kolom Kanan (Status Card) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* KOLOM KIRI (Lebar 2 Kolom) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Informasi Dimensi */}
          <div className="bg-white border border-gray-200/80 rounded-[16px] p-6 sm:p-8 shadow-xs space-y-6">
            <h2 className="text-lg font-semibold text-[#002045]">Informasi Dimensi</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-gray-100">
              <div>
                <span className="text-[14px] font-medium text-[#64748B] block mb-1">ID Dimensi</span>
                <span className="text-[16px] font-bold text-[#002045]">{categoryData.code}</span>
              </div>
              <div>
                <span className="text-[14px] font-medium text-[#64748B] block mb-1 sm:text-right">Total Pertanyaan</span>
                <div className="sm:text-right">
                  <span className="text-[16px] font-bold text-[#006A61]">{categoryData.totalQuestions} Soal</span>
                </div>
              </div>
            </div>

            <div>
              <span className="text-[14px] font-medium text-[#64748B] block mb-1">Nama Dimensi Kompetensi</span>
              <p className="text-[16px] font-normal text-[#1E1E1E] leading-relaxed">{categoryData.name}</p>
            </div>

            {categoryData.description && (
              <div>
                <span className="text-[14px] font-medium text-[#64748B] block mb-1">DESKRIPSI</span>
                <p className="text-[16px] font-normal text-[#1E1E1E] leading-relaxed">{categoryData.description}</p>
              </div>
            )}
          </div>

          {/* Card 2: Tabel Daftar Pertanyaan Terkait */}
          <div className="bg-white border border-gray-200/80 rounded-[16px] p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-[#002045]">Daftar Pertanyaan Terkait</h2>
              <p className="text-xs text-[#64748B] mt-0.5">Seluruh soal asesmen yang terhubung dengan dimensi {categoryData.name}.</p>
            </div>

            {/* Tabel Soal */}
            <div className="overflow-x-auto border border-gray-100 rounded-[10px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-gray-200/80 text-[#64748B] text-[14px]">
                    <th className="py-3.5 px-4 w-12 text-center font-semibold">#</th>
                    <th className="py-3.5 px-4 w-28 font-semibold">ID</th>
                    <th className="py-3.5 px-4 font-semibold">Pertanyaan</th>
                    <th className="py-3.5 px-4 w-36 text-center font-semibold">Jenis Jawaban</th>
                    <th className="py-3.5 px-4 w-28 text-center font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-[16px]">
                  {currentQuestions.length > 0 ? (
                    currentQuestions.map((q, idx) => (
                      <tr key={q.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-4 px-4 text-center text-gray-400 font-medium">{startIndex + idx + 1}</td>
                        <td className="py-4 px-4 font-bold text-[#002045]">{q.code}</td>
                        <td className="py-4 px-4 max-w-[320px] align-middle">
                          <div
                            title={q.questionText}
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              lineHeight: "1.4",
                              maxHeight: "2.8em",
                            }}
                            className="text-[#1E1E1E] cursor-default font-normal"
                          >
                            {q.questionText}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-600 font-medium text-center">{q.type}</td>
                        <td className="py-4 px-4 text-center">
                          <span
                            className={`inline-block px-3 py-1 rounded-[6px] text-[12px] font-semibold ${
                              q.status === "ACTIVE" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-gray-100 text-gray-500 border border-gray-200"
                            }`}
                          >
                            {q.status === "ACTIVE" ? "Active" : "Inactive"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-gray-400 italic text-xs">
                        Belum ada pertanyaan yang terhubung dengan dimensi ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Baris Pagination (Kondisional > 10 data) */}
            {totalItems > itemsPerPage && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-xs text-[#64748B]">
                <div>
                  Menampilkan <span className="font-semibold text-[#002045]">{startIndex + 1}</span> hingga <span className="font-semibold text-[#002045]">{Math.min(endIndex, totalItems)}</span> dari{" "}
                  <span className="font-semibold text-[#002045]">{totalItems}</span> total pertanyaan
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-[8px] border border-gray-200 text-[#002045] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    title="Halaman Sebelumnya"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-[8px] text-[14px] font-semibold transition-colors ${currentPage === pageNum ? "bg-[#002045] text-white shadow-xs" : "border border-gray-200 text-[#002045] hover:bg-gray-50"}`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-[8px] border border-gray-200 text-[#002045] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    title="Halaman Selanjutnya"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* KOLOM KANAN: Card Status (Disabled Grey Toggle) */}
        <div className="bg-white border border-gray-200/80 rounded-[16px] p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-lg font-semibold text-[#002045]">Status</h2>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[16px] font-normal text-[#1E1E1E]">Active</span>
            <div className={`w-12 h-6 flex items-center rounded-full p-1 cursor-not-allowed ${isActive ? "bg-gray-300" : "bg-gray-200"}`}>
              <div className={`bg-white w-4 h-4 rounded-full shadow-xs transform transition-transform ${isActive ? "translate-x-6" : "translate-x-0"}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Tombol Navigasi Kembali */}
      <div className="pt-2">
        <Link href="/admin/parameter" className="inline-flex items-center justify-center px-6 py-2.5 border border-gray-200 text-[#002045] text-[14px] font-medium rounded-[8px] hover:bg-white bg-white/60 transition-all shadow-xs">
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
        </Link>
      </div>
    </div>
  );
}
