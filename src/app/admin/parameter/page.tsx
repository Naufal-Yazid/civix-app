"use client";

import React, { useState, useEffect, useMemo, use } from "react";
import Link from "next/link";
import { getAdminCategories, getAdminLevels } from "./actions";
import DeleteCategoryModal from "@/components/admin/DeleteCategoryModal";
import DeleteLevelModal from "@/components/admin/DeleteLevelModal";
import { Plus, Eye, Edit3, ArrowUpDown, Search, ChevronDown, ChevronLeft, ChevronRight, Inbox } from "lucide-react";

interface CategoryItem {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  status: "ACTIVE" | "INACTIVE" | "DRAFT";
  totalQuestions: number;
}

interface LevelItem {
  id: string;
  code: string;
  name: string;
  minScore: number;
  maxScore: number;
  status: "ACTIVE" | "INACTIVE" | "DRAFT";
}

interface ParameterPageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default function ParameterAssessmentPage({ searchParams }: ParameterPageProps) {
  const resolvedSearchParams = use(searchParams);
  const activeTab = resolvedSearchParams?.tab === "level" ? "level" : "kategori";

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [levels, setLevels] = useState<LevelItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filter States (Khusus Tab Kategori)
  const [selectedId, setSelectedId] = useState<string>("");
  const [selectedName, setSelectedName] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Sort & Pagination States
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // Fetch Kategori dan Level secara bersamaan
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [catData, lvlData] = await Promise.all([getAdminCategories(), getAdminLevels()]);
        setCategories(catData as CategoryItem[]);
        setLevels(lvlData as LevelItem[]);
      } catch (error) {
        console.error("Gagal mengambil data parameter:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filter Dropdown Options
  const uniqueIds = useMemo(() => Array.from(new Set(categories.map((c) => c.code))).filter(Boolean), [categories]);
  const uniqueNames = useMemo(() => Array.from(new Set(categories.map((c) => c.name))).filter(Boolean), [categories]);

  // Filter & Search Logic (Kategori)
  const filteredCategories = useMemo(() => {
    return categories
      .filter((cat) => {
        const matchId = selectedId ? cat.code === selectedId : true;
        const matchName = selectedName ? cat.name === selectedName : true;
        const matchStatus = selectedStatus ? cat.status === selectedStatus : true;
        const matchSearch = searchQuery ? cat.code.toLowerCase().includes(searchQuery.toLowerCase()) || cat.name.toLowerCase().includes(searchQuery.toLowerCase()) : true;

        return matchId && matchName && matchStatus && matchSearch;
      })
      .sort((a, b) => {
        if (sortAsc) {
          return a.code.localeCompare(b.code);
        }
        return b.code.localeCompare(a.code);
      });
  }, [categories, selectedId, selectedName, selectedStatus, searchQuery, sortAsc]);

  // Filter & Search Logic (Level)
  const filteredLevels = useMemo(() => {
    return levels
      .filter((lvl) => {
        if (!searchQuery) return true;
        return lvl.code.toLowerCase().includes(searchQuery.toLowerCase()) || lvl.name.toLowerCase().includes(searchQuery.toLowerCase());
      })
      .sort((a, b) => {
        if (sortAsc) {
          return a.minScore - b.minScore;
        }
        return b.minScore - a.minScore;
      });
  }, [levels, searchQuery, sortAsc]);

  // Pagination Logic
  const totalItems = activeTab === "kategori" ? filteredCategories.length : filteredLevels.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCategories = filteredCategories.slice(startIndex, endIndex);
  const currentLevels = filteredLevels.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      {/* 1. TITLE & CTA BUTTON */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold text-[#002045]">Parameter Assessment</h1>
          <p className="text-xs text-[#64748B] mt-1">Monitoring kompetensi civitas akademik secara real-time.</p>
        </div>

        {activeTab === "kategori" ? (
          <Link href="/admin/parameter/tambah" className="inline-flex items-center gap-2 px-5 py-3 bg-[#002045] text-white text-[14px] font-semibold rounded-xl hover:bg-[#001833] transition-colors shadow-xs">
            <Plus className="w-[22px] h-[22px]" />
            Tambah Dimensi
          </Link>
        ) : (
          <Link href="/admin/parameter/level/tambah" className="inline-flex items-center gap-2 px-5 py-3 bg-[#002045] text-white text-[14px] font-semibold rounded-xl hover:bg-[#001833] transition-colors shadow-xs">
            <Plus className="w-[22px] h-[22px]" />
            Tambah Level
          </Link>
        )}
      </div>

      {/* 2. TAB NAVIGATION */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <Link
            href="/admin/parameter?tab=kategori"
            onClick={() => {
              setCurrentPage(1);
              setSearchQuery("");
            }}
            className={`py-3 text-[14px] font-semibold transition-colors border-b-2 ${activeTab === "kategori" ? "text-[#002045] border-[#002045]" : "text-gray-400 border-transparent hover:text-gray-600"}`}
          >
            Dimensi Kompetensi
          </Link>

          <Link
            href="/admin/parameter?tab=level"
            onClick={() => {
              setCurrentPage(1);
              setSearchQuery("");
            }}
            className={`py-3 text-[14px] font-semibold transition-colors border-b-2 ${activeTab === "level" ? "text-[#002045] border-[#002045]" : "text-gray-400 border-transparent hover:text-gray-600"}`}
          >
            Level Kompetensi
          </Link>
        </nav>
      </div>

      {/* 3. FILTER CARD CONTAINER (Hanya Tampil di Tab Kategori) */}
      {activeTab === "kategori" && (
        <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

            {/* Filter Nama Dimensi */}
            <div className="space-y-1.5">
              <label className="block text-[14px] font-normal text-[#6B7280]">
                Nama Dimensi <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={selectedName}
                  onChange={(e) => {
                    setSelectedName(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full appearance-none px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-[16px] text-gray-600 focus:outline-none focus:border-[#006A61] cursor-pointer"
                >
                  <option value="">Semua Nama Dimensi</option>
                  {uniqueNames.map((name) => (
                    <option key={name} value={name}>
                      {name}
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
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. TABLE CONTAINER */}
      <div className="bg-white border border-gray-200/80 rounded-2xl shadow-xs overflow-hidden">
        {/* Table Top Controls */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <button type="button" onClick={() => setSortAsc(!sortAsc)} className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-500 cursor-pointer transition-colors" title="Sortir Data">
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

        {/* TAB 1: KATEGORI KOMPETENSI TABLE */}
        {activeTab === "kategori" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-gray-100 text-[#64748B] text-[14px]">
                  <th className="p-4 w-10 text-center">
                    <input type="checkbox" className="rounded border-gray-300 accent-[#002045]" />
                  </th>
                  <th className="p-4 font-semibold w-12">#</th>
                  <th className="p-4 font-semibold w-28">ID</th>
                  <th className="p-4 font-semibold">Nama Dimensi</th>
                  <th className="p-4 font-semibold text-center w-28">Total Soal</th>
                  <th className="p-4 font-semibold w-24">Status</th>
                  <th className="p-4 font-semibold text-center w-28">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 text-[16px]">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-sm text-[#64748B]">
                      Memuat data kategori dimensi...
                    </td>
                  </tr>
                ) : currentCategories.length > 0 ? (
                  currentCategories.map((cat, idx) => (
                    <tr key={cat.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="p-4 text-center">
                        <input type="checkbox" className="rounded border-gray-300 accent-[#002045]" />
                      </td>
                      <td className="p-4 text-gray-400">{startIndex + idx + 1}</td>
                      <td className="p-4 font-bold text-[#002045]">{cat.code}</td>
                      <td className="p-4 font-medium text-[#1E1E1E]">{cat.name}</td>
                      <td className="p-4 text-center font-bold text-[#002045]">{cat.totalQuestions}</td>
                      <td className="p-4 font-semibold">
                        <span className={cat.status === "ACTIVE" ? "text-emerald-600" : "text-rose-500"}>{cat.status === "ACTIVE" ? "Active" : "Inactive"}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center space-x-2 text-gray-500">
                          <Link href={`/admin/parameter/detail/${cat.id}`} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" title="Lihat Detail">
                            <Eye className="w-[20px] h-[20px] text-gray-500" />
                          </Link>
                          <Link href={`/admin/parameter/edit/${cat.id}`} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" title="Edit Dimensi">
                            <Edit3 className="w-[20px] h-[20px] text-emerald-600" />
                          </Link>
                          <DeleteCategoryModal id={cat.id} name={cat.name} totalQuestions={cat.totalQuestions} />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-12 text-center">
                      <div className="max-w-xs mx-auto space-y-3">
                        <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto border border-gray-100">
                          <Inbox className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-sm text-[#002045]">{searchQuery || selectedId || selectedName || selectedStatus ? "Tidak Ada Data yang Cocok" : "Belum Ada Dimensi"}</h3>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          {searchQuery || selectedId || selectedName || selectedStatus ? "Coba ubah kata kunci pencarian atau filter yang dipilih." : 'Kategori dimensi masih kosong. Klik "Tambah Dimensi" di atas.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* TAB 2: LEVEL KOMPETENSI TABLE */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-gray-100 text-[#64748B] text-[14px]">
                  <th className="p-4 w-10 text-center">
                    <input type="checkbox" className="rounded border-gray-300 accent-[#002045]" />
                  </th>
                  <th className="p-4 font-semibold w-12">#</th>
                  <th className="p-4 font-semibold w-28">ID</th>
                  <th className="p-4 font-semibold">Nama Level</th>
                  <th className="p-4 font-semibold">Rentang Skor</th>
                  <th className="p-4 font-semibold w-24">Status</th>
                  <th className="p-4 font-semibold text-center w-28">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 text-[16px]">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-sm text-[#64748B]">
                      Memuat data level kompetensi...
                    </td>
                  </tr>
                ) : currentLevels.length > 0 ? (
                  currentLevels.map((lvl, idx) => (
                    <tr key={lvl.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="p-4 text-center">
                        <input type="checkbox" className="rounded border-gray-300 accent-[#002045]" />
                      </td>
                      <td className="p-4 text-gray-400">{startIndex + idx + 1}</td>
                      <td className="p-4 font-bold text-[#002045]">{lvl.code}</td>
                      <td className="p-4 font-medium text-[#1E1E1E]">{lvl.name}</td>
                      <td className="p-4 font-semibold text-[#002045]">
                        {lvl.minScore}%–{lvl.maxScore}%
                      </td>
                      <td className="p-4 font-semibold">
                        <span className={lvl.status === "ACTIVE" ? "text-emerald-600" : "text-rose-500"}>{lvl.status === "ACTIVE" ? "Active" : "Inactive"}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center space-x-2 text-gray-500">
                          <Link href={`/admin/parameter/level/detail/${lvl.id}`} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" title="Lihat Detail">
                            <Eye className="w-[20px] h-[20px] text-gray-500" />
                          </Link>
                          <Link href={`/admin/parameter/level/edit/${lvl.id}`} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" title="Edit Level">
                            <Edit3 className="w-[20px] h-[20px] text-emerald-600" />
                          </Link>
                          <DeleteLevelModal id={lvl.id} name={lvl.name} />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-12 text-center">
                      <div className="max-w-xs mx-auto space-y-3">
                        <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto border border-gray-100">
                          <Inbox className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-sm text-[#002045]">{searchQuery ? "Tidak Ada Level yang Cocok" : "Belum Ada Level Kompetensi"}</h3>
                        <p className="text-xs text-gray-400 leading-relaxed">{searchQuery ? "Coba ubah kata kunci pencarian level." : 'Level kompetensi masih kosong. Klik "Tambah Level" di atas untuk memasukkan data.'}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* 5. PAGINATION FOOTER (Hanya Muncul Jika Total Data > 10) */}
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
