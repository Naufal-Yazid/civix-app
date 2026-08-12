import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteCategoryModal from "@/components/admin/DeleteCategoryModal";
import DeleteLevelModal from "@/components/admin/DeleteLevelModal";
import { Plus, Eye, Edit3, ArrowUpDown, Search, ChevronDown, ChevronLeft, ChevronRight, Inbox } from "lucide-react";

interface ParameterPageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function ParameterAssessmentPage({ searchParams }: ParameterPageProps) {
  const { tab } = await searchParams;
  const activeTab = tab === "level" ? "level" : "kategori";

  // Fetch data sesuai tab yang aktif
  const categories = await prisma.dimensionCategory.findMany({
    orderBy: { createdAt: "desc" },
  });

  const levels = await prisma.competencyLevel.findMany({
    orderBy: { minScore: "asc" },
  });

  return (
    <div className="space-y-6">
      {/* 1. TITLE & CTA BUTTON */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-[#002045]">Parameter Assessment</h1>
          <p className="text-xs text-[#64748B] mt-1">Monitoring kompetensi civitas akademik secara real-time.</p>
        </div>

        {activeTab === "kategori" ? (
          <Link href="/admin/parameter/tambah" className="inline-flex items-center gap-2 px-5 py-3 bg-[#002045] text-white text-xs font-semibold rounded-xl hover:bg-[#001833] transition-colors shadow-xs">
            <Plus className="w-4 h-4" />
            Tambah Dimensi
          </Link>
        ) : (
          <Link href="/admin/parameter/level/tambah" className="inline-flex items-center gap-2 px-5 py-3 bg-[#002045] text-white text-xs font-semibold rounded-xl hover:bg-[#001833] transition-colors shadow-xs">
            <Plus className="w-4 h-4" />
            Tambah Level
          </Link>
        )}
      </div>

      {/* 2. TAB NAVIGATION */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <Link href="/admin/parameter?tab=kategori" className={`py-3 text-xs font-bold transition-colors border-b-2 ${activeTab === "kategori" ? "text-[#002045] border-[#002045]" : "text-gray-400 border-transparent hover:text-gray-600"}`}>
            Kategori Kompetensi
          </Link>

          <Link href="/admin/parameter?tab=level" className={`py-3 text-xs font-bold transition-colors border-b-2 ${activeTab === "level" ? "text-[#002045] border-[#002045]" : "text-gray-400 border-transparent hover:text-gray-600"}`}>
            Level Kompetensi
          </Link>
        </nav>
      </div>

      {/* 3. FILTER CARD CONTAINER (Hanya Tampil di Tab Kategori) */}
      {activeTab === "kategori" && (
        <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
      )}

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

        {/* TAB 1: KATEGORI KOMPETENSI TABLE */}
        {activeTab === "kategori" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-gray-100 text-[#64748B]">
                  <th className="p-4 w-10 text-center">
                    <input type="checkbox" className="rounded border-gray-300 accent-[#002045]" />
                  </th>
                  <th className="p-4 font-semibold w-12">#</th>
                  <th className="p-4 font-semibold w-24">ID</th>
                  <th className="p-4 font-semibold">Nama Dimensi</th>
                  <th className="p-4 font-semibold text-center w-28">Total Soal</th>
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
                      <td className="p-4 text-center font-bold text-[#002045]">0</td>
                      <td className="p-4 font-semibold">
                        <span className={cat.status === "ACTIVE" ? "text-emerald-600" : "text-rose-500"}>{cat.status === "ACTIVE" ? "Active" : "Inactive"}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center space-x-2 text-gray-500">
                          <Link href={`/admin/parameter/detail/${cat.id}`} className="p-1.5 hover:bg-gray-100 rounded-lg">
                            <Eye className="w-4 h-4 text-gray-500" />
                          </Link>
                          <Link href={`/admin/parameter/edit/${cat.id}`} className="p-1.5 hover:bg-gray-100 rounded-lg">
                            <Edit3 className="w-4 h-4 text-emerald-600" />
                          </Link>
                          <DeleteCategoryModal id={cat.id} name={cat.name} />
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
                        <h3 className="font-bold text-sm text-[#002045]">Belum Ada Dimensi</h3>
                        <p className="text-xs text-gray-400 leading-relaxed">Kategori dimensi masih kosong. Klik &quot;Tambah Dimensi&quot; di atas.</p>
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
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-gray-100 text-[#64748B]">
                  <th className="p-4 w-10 text-center">
                    <input type="checkbox" className="rounded border-gray-300 accent-[#002045]" />
                  </th>
                  <th className="p-4 font-semibold w-12">#</th>
                  <th className="p-4 font-semibold w-24">ID</th>
                  <th className="p-4 font-semibold">Nama Level</th>
                  <th className="p-4 font-semibold">Rentang Skor</th>
                  <th className="p-4 font-semibold w-24">Status</th>
                  <th className="p-4 font-semibold text-center w-28">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {levels.length > 0 ? (
                  levels.map((lvl, idx) => (
                    <tr key={lvl.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="p-4 text-center">
                        <input type="checkbox" className="rounded border-gray-300 accent-[#002045]" />
                      </td>
                      <td className="p-4 text-gray-400">{idx + 1}</td>
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
                          <Link href={`/admin/parameter/level/detail/${lvl.id}`} className="p-1.5 hover:bg-gray-100 rounded-lg">
                            <Eye className="w-4 h-4 text-gray-500" />
                          </Link>
                          <Link href={`/admin/parameter/level/edit/${lvl.id}`} className="p-1.5 hover:bg-gray-100 rounded-lg">
                            <Edit3 className="w-4 h-4 text-emerald-600" />
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
                        <h3 className="font-bold text-sm text-[#002045]">Belum Ada Level Kompetensi</h3>
                        <p className="text-xs text-gray-400 leading-relaxed">Level kompetensi masih kosong. Klik &quot;Tambah Level&quot; di atas untuk memasukkan data.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
