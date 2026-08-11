import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteCategoryModal from "@/components/admin/DeleteCategoryModal";
import { Plus, Eye, Edit3, ArrowUpDown, Search, ChevronDown, ChevronLeft, ChevronRight, Inbox } from "lucide-react";

export default async function ParameterAssessmentPage() {
  // Ambil data Kategori Kompetensi beserta hitungan jumlah soal terkait dari DB
  const categories = await prisma.dimensionCategory.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      {/* 1. TITLE & TAMBAH DIMENSI CTA */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-[#002045]">Parameter Assessment</h1>
          <p className="text-xs text-[#64748B] mt-1">Monitoring kompetensi civitas akademik secara real-time.</p>
        </div>

        <Link href="/admin/parameter/tambah" className="inline-flex items-center gap-2 px-5 py-3 bg-[#002045] text-white text-xs font-semibold rounded-xl hover:bg-[#001833] transition-colors shadow-xs">
          <Plus className="w-4 h-4" />
          Tambah Dimensi
        </Link>
      </div>

      {/* 2. TAB NAVIGATION (Kategori Kompetensi & Level Kompetensi) */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button className="py-3 text-xs font-bold text-[#002045] border-b-2 border-[#002045] transition-colors">Kategori Kompetensi</button>
          <button className="py-3 text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors cursor-not-allowed">Level Kompetensi</button>
        </nav>
      </div>

      {/* 3. FILTER CARD CONTAINER */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Filter ID */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-[#002045]">
              ID <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select className="w-full appearance-none px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-600 focus:outline-none focus:border-[#006A61]">
                <option value="">Semua ID</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Filter Nama Dimensi */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-[#002045]">
              Nama Dimensi <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select className="w-full appearance-none px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-600 focus:outline-none focus:border-[#006A61]">
                <option value="">Semua Nama Dimensi</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Filter Status */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-[#002045]">
              Status <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select className="w-full appearance-none px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-600 focus:outline-none focus:border-[#006A61]">
                <option value="">Semua Status</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* 4. TABLE CONTAINER */}
      <div className="bg-white border border-gray-200/80 rounded-2xl shadow-xs overflow-hidden">
        {/* Table Top Controls */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <button className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-500">
            <ArrowUpDown className="w-4 h-4" />
          </button>

          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
            <input type="text" placeholder="Search..." className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#006A61] placeholder:text-gray-300" />
          </div>
        </div>

        {/* Table Data */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-gray-100 text-[#64748B]">
                <th className="p-4 w-10 text-center">
                  <input type="checkbox" className="rounded border-gray-300 accent-[#002045]" />
                </th>
                <th className="p-4 font-semibold w-12">#</th>
                <th className="p-4 font-semibold w-24">ID</th>
                <th className="p-4 font-semibold w-48">Nama Dimensi</th>
                <th className="p-4 font-semibold">Deskripsi</th>
                <th className="p-4 font-semibold text-center w-24">Total Soal</th>
                <th className="p-4 font-semibold w-24">Status</th>
                <th className="p-4 font-semibold text-center w-28">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {categories.length > 0 ? (
                categories.map((cat, idx) => (
                  <tr key={cat.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="p-4 text-center">
                      <input type="checkbox" className="rounded border-gray-300 accent-[#002045]" />
                    </td>
                    <td className="p-4 text-gray-400">{idx + 1}</td>
                    <td className="p-4 font-bold text-[#002045]">{cat.code}</td>
                    <td className="p-4 font-medium text-[#1E1E1E]">{cat.name}</td>
                    <td className="p-4 max-w-xs truncate text-gray-500">{cat.description || "-"}</td>
                    <td className="p-4 text-center font-bold text-[#002045]">0</td>
                    <td className="p-4 font-semibold">
                      <span className={cat.status === "ACTIVE" ? "text-emerald-600" : "text-rose-500"}>{cat.status === "ACTIVE" ? "Active" : "Inactive"}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center space-x-2 text-gray-500">
                        <Link href={`/admin/parameter/detail/${cat.id}`} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" title="Lihat Detail">
                          <Eye className="w-4 h-4 text-gray-500" />
                        </Link>

                        <Link href={`/admin/parameter/edit/${cat.id}`} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
                          <Edit3 className="w-4 h-4 text-emerald-600" />
                        </Link>

                        <DeleteCategoryModal id={cat.id} name={cat.name} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                /* Empty State */
                <tr>
                  <td colSpan={8} className="p-12 text-center">
                    <div className="max-w-xs mx-auto space-y-3">
                      <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto border border-gray-100">
                        <Inbox className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-sm text-[#002045]">Belum Ada Dimensi</h3>
                      <p className="text-xs text-gray-400 leading-relaxed">Kategori dimensi masih kosong. Klik &quot;Tambah Dimensi&quot; di atas untuk memasukkan data baru.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Kondisional (> 10 Data) */}
        {categories.length > 10 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between">
            <button className="p-2 border border-gray-200 rounded-xl text-gray-400 hover:bg-gray-50">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center space-x-2 text-xs font-semibold">
              <button className="w-8 h-8 rounded-xl bg-[#002045] text-white">1</button>
              <button className="w-8 h-8 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50">2</button>
            </div>
            <button className="p-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
