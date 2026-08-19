"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { getAssessmentResults } from "@/app/admin/pengguna/actions";
import DeleteUserModal from "@/components/admin/DeleteUserModal";
import { Download, Eye, ArrowUpDown, Search, ChevronDown, ChevronLeft, ChevronRight, Inbox } from "lucide-react";

interface UserResultItem {
  id: string;
  userIdCode: string;
  userName: string;
  institution?: string | null;
  gradeLevel?: string | null;
  city?: string | null;
  duration?: string | null;
  badgeLevel: string;
  compositeScore: number;
  createdAt: Date | string;
}

export default function DataPenggunaPage() {
  const [userResults, setUserResults] = useState<UserResultItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filter States
  const [selectedId, setSelectedId] = useState<string>("");
  const [selectedName, setSelectedName] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Sort & Pagination States
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAssessmentResults();
        setUserResults(data as unknown as UserResultItem[]);
      } catch (error) {
        console.error("Gagal mengambil data hasil assessment:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Helper Format Tanggal Indonesia
  const formatDateIndo = (dateInput: Date | string) => {
    return new Date(dateInput).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Helper Format YYYY-MM-DD untuk Value Filter
  const formatDateValue = (dateInput: Date | string) => {
    const d = new Date(dateInput);
    return d.toISOString().split("T")[0];
  };

  // Unik Opsi Dropdown
  const uniqueIds = useMemo(() => Array.from(new Set(userResults.map((u) => u.userIdCode))).filter(Boolean), [userResults]);
  const uniqueNames = useMemo(() => Array.from(new Set(userResults.map((u) => u.userName))).filter(Boolean), [userResults]);
  const uniqueLevels = useMemo(() => Array.from(new Set(userResults.map((u) => u.badgeLevel))).filter(Boolean), [userResults]);
  const uniqueDates = useMemo(() => {
    const dateMap = new Map<string, string>();
    userResults.forEach((u) => {
      const val = formatDateValue(u.createdAt);
      const label = formatDateIndo(u.createdAt);
      if (!dateMap.has(val)) {
        dateMap.set(val, label);
      }
    });
    return Array.from(dateMap.entries());
  }, [userResults]);

  // Filter & Search Logic
  const filteredResults = useMemo(() => {
    return userResults
      .filter((usr) => {
        const matchId = selectedId ? usr.userIdCode === selectedId : true;
        const matchName = selectedName ? usr.userName === selectedName : true;
        const matchLevel = selectedLevel ? usr.badgeLevel === selectedLevel : true;
        const matchDate = selectedDate ? formatDateValue(usr.createdAt) === selectedDate : true;

        const matchSearch = searchQuery
          ? usr.userIdCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
            usr.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            usr.badgeLevel.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (usr.institution && usr.institution.toLowerCase().includes(searchQuery.toLowerCase()))
          : true;

        return matchId && matchName && matchLevel && matchDate && matchSearch;
      })
      .sort((a, b) => {
        if (sortAsc) {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [userResults, selectedId, selectedName, selectedDate, selectedLevel, searchQuery, sortAsc]);

  // Pagination Logic
  const totalItems = filteredResults.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredResults.slice(startIndex, endIndex);

  // Export CSV Handler
  const handleExportCSV = () => {
    if (filteredResults.length === 0) return;

    const headers = ["ID Pengguna", "Nama Lengkap", "Tanggal", "Level", "Skor Akhir"];
    const rows = filteredResults.map((u) => [`"${u.userIdCode}"`, `"${u.userName}"`, `"${formatDateIndo(u.createdAt)}"`, `"${u.badgeLevel}"`, `"${u.compositeScore}/100"`]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `data_hasil_assessment_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* 1. TITLE & EXPORT CTA */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold text-[#002045]">Data Hasil Assessment</h1>
          <p className="text-xs text-[#64748B] mt-1">Monitoring kompetensi civitas akademik secara real-time.</p>
        </div>

        <button type="button" onClick={handleExportCSV} className="inline-flex items-center gap-2 px-5 py-3 bg-[#002045] text-white text-[14px] font-semibold rounded-xl hover:bg-[#001833] transition-colors shadow-xs cursor-pointer">
          <Download className="w-[22px] h-[22px]" />
          Export CSV/Excel
        </button>
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

          {/* Filter Nama */}
          <div className="space-y-1.5">
            <label className="block text-[14px] font-normal text-[#6B7280]">
              Nama <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={selectedName}
                onChange={(e) => {
                  setSelectedName(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full appearance-none px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-[16px] text-gray-600 focus:outline-none focus:border-[#006A61] truncate pr-8 cursor-pointer"
              >
                <option value="">Semua Nama</option>
                {uniqueNames.map((name, idx) => (
                  <option key={idx} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Filter Tanggal */}
          <div className="space-y-1.5">
            <label className="block text-[14px] font-normal text-[#6B7280]">
              Tanggal <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full appearance-none px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-[16px] text-gray-600 focus:outline-none focus:border-[#006A61] cursor-pointer"
              >
                <option value="">Semua Tanggal</option>
                {uniqueDates.map(([val, label]) => (
                  <option key={val} value={val}>
                    {label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Filter Level */}
          <div className="space-y-1.5">
            <label className="block text-[14px] font-normal text-[#6B7280]">
              Level <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={selectedLevel}
                onChange={(e) => {
                  setSelectedLevel(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full appearance-none px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-[16px] text-gray-600 focus:outline-none focus:border-[#006A61] cursor-pointer"
              >
                <option value="">Semua Level</option>
                {uniqueLevels.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
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
          <button type="button" onClick={() => setSortAsc(!sortAsc)} className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-500 cursor-pointer transition-colors" title="Sortir Tanggal">
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
                <th className="p-4 font-semibold">Nama</th>
                <th className="p-4 font-semibold">Tanggal</th>
                <th className="p-4 font-semibold text-center w-36">Level</th>
                <th className="p-4 font-semibold text-center w-28">Skor</th>
                <th className="p-4 font-semibold text-center w-28">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-[16px]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-sm text-[#64748B]">
                    Memuat data hasil assessment...
                  </td>
                </tr>
              ) : currentUsers.length > 0 ? (
                currentUsers.map((usr, idx) => (
                  <tr key={usr.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="p-4 text-center">
                      <input type="checkbox" className="rounded border-gray-300 accent-[#002045]" />
                    </td>
                    <td className="p-4 text-gray-400">{startIndex + idx + 1}</td>
                    <td className="p-4 font-bold text-[#002045]">{usr.userIdCode}</td>
                    <td className="p-4 font-medium text-[#1E1E1E]">{usr.userName}</td>
                    <td className="p-4 text-gray-500 font-normal">{formatDateIndo(usr.createdAt)}</td>
                    <td className="p-4 text-center">
                      <span className="px-3 py-1 bg-[#002045] text-white rounded-full font-semibold text-[12px] tracking-wider uppercase inline-block">{usr.badgeLevel}</span>
                    </td>
                    <td className="p-4 text-center font-bold text-[#002045]">{usr.compositeScore}/100</td>
                    <td className="p-4">
                      <div className="flex items-center justify-center space-x-2 text-gray-500">
                        <Link href={`/admin/pengguna/detail/${usr.id}`} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" title="Lihat Detail">
                          <Eye className="w-[22px] h-[22px] text-gray-500" />
                        </Link>
                        <DeleteUserModal id={usr.id} userName={usr.userName} userCode={usr.userIdCode} />
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
                      <h3 className="font-bold text-sm text-[#002045]">{searchQuery || selectedId || selectedName || selectedDate || selectedLevel ? "Tidak Ada Data yang Cocok" : "Belum Ada Data Pengguna"}</h3>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        {searchQuery || selectedId || selectedName || selectedDate || selectedLevel
                          ? "Coba ubah kata kunci pencarian atau filter yang dipilih."
                          : "Data hasil kuesioner pengguna akan otomatis muncul di sini begitu pengajar melakukan assessment."}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 4. PAGINATION FOOTER (Hanya Muncul Jika Total Data > 10) */}
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
