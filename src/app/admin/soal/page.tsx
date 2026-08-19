"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import DeleteModalButton from "@/components/admin/DeleteModalButton";
import { getAdminQuestions } from "./actions";
import { Plus, Eye, Edit3, ArrowUpDown, Search, ChevronDown, ChevronLeft, ChevronRight, Inbox } from "lucide-react";

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

const getDimensionBadgeStyle = (dimension: string) => {
  switch (dimension) {
    case "Civic Competence":
      return "bg-sky-100 text-sky-700";
    case "Identitas Pedagogik":
      return "bg-teal-100 text-teal-700";
    case "Civic Disposition":
      return "bg-amber-100 text-amber-700";
    default:
      return "bg-blue-100 text-blue-700";
  }
};

export default function ManajemenSoalPage() {
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filter States
  const [selectedId, setSelectedId] = useState<string>("");
  const [selectedQuestionText, setSelectedQuestionText] = useState<string>("");
  const [selectedDimension, setSelectedDimension] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Sort & Pagination States
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAdminQuestions();
        setQuestions(data as unknown as QuestionItem[]);
      } catch (error) {
        console.error("Gagal mengambil data soal:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Dropdown Options Generator
  const uniqueIds = useMemo(() => Array.from(new Set(questions.map((q) => q.code))).filter(Boolean), [questions]);
  const uniqueQuestions = useMemo(() => Array.from(new Set(questions.map((q) => q.questionText))).filter(Boolean), [questions]);
  const uniqueDimensions = useMemo(() => Array.from(new Set(questions.map((q) => q.dimension))).filter(Boolean), [questions]);

  // Filter & Search Logic
  const filteredQuestions = useMemo(() => {
    return questions
      .filter((q) => {
        const matchId = selectedId ? q.code === selectedId : true;
        const matchQuestion = selectedQuestionText ? q.questionText === selectedQuestionText : true;
        const matchDim = selectedDimension ? q.dimension === selectedDimension : true;
        const matchStat = selectedStatus ? q.status === selectedStatus : true;
        const matchSearch = searchQuery ? q.code.toLowerCase().includes(searchQuery.toLowerCase()) || q.questionText.toLowerCase().includes(searchQuery.toLowerCase()) || q.dimension.toLowerCase().includes(searchQuery.toLowerCase()) : true;

        return matchId && matchQuestion && matchDim && matchStat && matchSearch;
      })
      .sort((a, b) => {
        if (sortAsc) {
          return a.code.localeCompare(b.code);
        }
        return b.code.localeCompare(a.code);
      });
  }, [questions, selectedId, selectedQuestionText, selectedDimension, selectedStatus, searchQuery, sortAsc]);

  // Pagination Logic
  const totalItems = filteredQuestions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentQuestions = filteredQuestions.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      {/* 1. TITLE & TAMBAH PERTANYAAN CTA */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold text-[#002045]">Manajemen Soal</h1>
          <p className="text-xs text-[#64748B] mt-1">Kelola bank soal untuk asesmen kompetensi kewarganegaraan.</p>
        </div>

        <Link href="/admin/soal/tambah" className="inline-flex items-center gap-2 px-5 py-3 bg-[#002045] text-white text-[14px] font-semibold rounded-xl hover:bg-[#001833] transition-colors shadow-xs">
          <Plus className="w-[22px] h-[22px]" />
          Tambah Pertanyaan
        </Link>
      </div>

      {/* 2. FILTER CARD CONTAINER */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Filter ID */}
          <div className="space-y-1.5">
            <label className="block text-[14px] font-normal text-[#6B7280]">
              ID <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={selectedId}
                onChange={(e) => {
                  setSelectedId(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full appearance-none px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-[16px] text-gray-600 focus:outline-none focus:border-[#006A61] cursor-pointer"
              >
                <option value="">Semua ID</option>
                {uniqueIds.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Filter Pertanyaan */}
          <div className="space-y-1.5">
            <label className="block text-[14px] font-normal text-[#6B7280]">
              Pertanyaan <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={selectedQuestionText}
                onChange={(e) => {
                  setSelectedQuestionText(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full appearance-none px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-[16px] text-gray-600 focus:outline-none focus:border-[#006A61] truncate pr-8 cursor-pointer"
              >
                <option value="">Semua Pertanyaan</option>
                {uniqueQuestions.map((text, idx) => (
                  <option key={idx} value={text}>
                    {text.length > 50 ? `${text.slice(0, 50)}...` : text}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Filter Dimensi */}
          <div className="space-y-1.5">
            <label className="block text-[14px] font-normal text-[#6B7280]">
              Dimensi <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={selectedDimension}
                onChange={(e) => {
                  setSelectedDimension(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full appearance-none px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-[16px] text-gray-600 focus:outline-none focus:border-[#006A61] cursor-pointer"
              >
                <option value="">Semua Dimensi</option>
                {uniqueDimensions.map((dim) => (
                  <option key={dim} value={dim}>
                    {dim}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Filter Status */}
          <div className="space-y-1.5">
            <label className="block text-[14px] font-normal text-[#6B7280]">
              Status <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full appearance-none px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-[16px] text-gray-600 focus:outline-none focus:border-[#006A61] cursor-pointer"
              >
                <option value="">Semua Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="DRAFT">Draft</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. TABLE CONTAINER */}
      <div className="bg-white border border-gray-200/80 rounded-2xl shadow-xs overflow-hidden">
        {/* Table Top Controls */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <button type="button" onClick={() => setSortAsc(!sortAsc)} className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-500 cursor-pointer transition-colors" title="Sortir Kode Soal">
            <ArrowUpDown className="w-[22px] h-[22px]" />
          </button>

          <div className="relative w-72">
            <Search className="w-[22px] h-[22px] absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search..."
              className="w-full pl-11 pr-4 py-2.5 text-[16px] bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#006A61] placeholder:text-gray-400 placeholder:text-[16px]"
            />
          </div>
        </div>

        {/* Table Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-gray-100 text-[#64748B] text-[14px]">
                <th className="p-4 w-10 text-center">
                  <input type="checkbox" className="rounded border-gray-300 accent-[#002045]" />
                </th>
                <th className="p-4 font-semibold w-12">#</th>
                <th className="p-4 font-semibold w-28">ID</th>
                <th className="p-4 font-semibold">Pertanyaan</th>
                <th className="p-4 font-semibold w-44">Dimensi</th>
                <th className="p-4 font-semibold">Jenis Jawaban</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-center w-28">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-[16px]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-sm text-[#64748B]">
                    Memuat data pertanyaan...
                  </td>
                </tr>
              ) : currentQuestions.length > 0 ? (
                currentQuestions.map((q, idx) => (
                  <tr key={q.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="p-4 text-center">
                      <input type="checkbox" className="rounded border-gray-300 accent-[#002045]" />
                    </td>
                    <td className="p-4 text-gray-400">{startIndex + idx + 1}</td>
                    <td className="p-4 font-bold text-[#002045]">{q.code}</td>
                    <td className="p-4 max-w-[340px] align-middle">
                      <div
                        title={q.questionText}
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          lineHeight: "1.4",
                          maxHeight: "2.8em", // Kunci tinggi maksimal tepat 2 baris
                        }}
                        className="text-[#1E1E1E] cursor-default font-medium"
                      >
                        {q.questionText}
                      </div>
                    </td>
                    <td className="p-4">
                      <span title={q.dimension} className={`px-3 py-1 rounded-full font-medium text-[12px] max-w-[140px] truncate whitespace-nowrap block cursor-default ${getDimensionBadgeStyle(q.dimension)}`}>
                        {q.dimension}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600 font-medium">{q.type}</td>
                    <td className="p-4 font-semibold">
                      <span className={q.status === "ACTIVE" ? "text-emerald-600" : q.status === "INACTIVE" ? "text-rose-500" : "text-amber-500"}>{q.status === "ACTIVE" ? "Active" : q.status === "INACTIVE" ? "Inactive" : "Draft"}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center space-x-2 text-gray-500">
                        <Link href={`/admin/soal/detail/${q.id}`} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" title="Lihat Detail">
                          <Eye className="w-[20px] h-[20px] text-gray-500" />
                        </Link>
                        <Link href={`/admin/soal/edit/${q.id}`} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" title="Edit Soal">
                          <Edit3 className="w-[20px] h-[20px] text-emerald-600" />
                        </Link>
                        <DeleteModalButton id={q.id} code={q.code} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                /* EMPTY STATE */
                <tr>
                  <td colSpan={8} className="p-12 text-center">
                    <div className="max-w-xs mx-auto space-y-3">
                      <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto border border-gray-100">
                        <Inbox className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-sm text-[#002045]">{searchQuery || selectedId || selectedQuestionText || selectedDimension || selectedStatus ? "Tidak Ada Data yang Cocok" : "Belum Ada Pertanyaan"}</h3>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        {searchQuery || selectedId || selectedQuestionText || selectedDimension || selectedStatus
                          ? "Coba ubah kata kunci pencarian atau filter yang dipilih."
                          : 'Bank soal masih kosong. Klik tombol "Tambah Pertanyaan" di atas untuk mulai memasukkan soal.'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 4. PAGINATION FOOTER */}
        {totalItems > itemsPerPage && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between animate-in fade-in duration-200">
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-200 rounded-xl text-gray-400 hover:bg-gray-50 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-[22px] h-[22px]" />
            </button>

            <div className="flex items-center space-x-2 text-[14px] font-semibold">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-9 h-9 rounded-xl transition-colors ${currentPage === pageNum ? "bg-[#002045] text-white shadow-xs" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-[22px] h-[22px]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
