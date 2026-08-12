import React from "react";
import Link from "next/link";
import { getAssessmentResults } from "@/app/admin/pengguna/actions";
import DeleteUserModal from "@/components/admin/DeleteUserModal";
import { Download, Eye, ArrowUpDown, Search, ChevronDown, ChevronLeft, ChevronRight, Inbox } from "lucide-react";

export default async function DataPenggunaPage() {
  const userResults = await getAssessmentResults();

  return (
    <div className="space-y-6">
      {/* 1. TITLE & EXPORT CTA */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-[#002045]">Data Hasil Assessment</h1>
          <p className="text-xs text-[#64748B] mt-1">Monitoring kompetensi civitas akademik secara real-time.</p>
        </div>

        <button type="button" className="inline-flex items-center gap-2 px-5 py-3 bg-[#002045] text-white text-xs font-semibold rounded-xl hover:bg-[#001833] transition-colors shadow-xs">
          <Download className="w-4 h-4" />
          Export CSV/Excel
        </button>
      </div>

      {/* 2. FILTER CARD CONTAINER */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

          {/* Filter Nama */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-[#002045]">
              Nama <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select className="w-full appearance-none px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-600 focus:outline-none focus:border-[#006A61]">
                <option value="">Semua Nama</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Filter Tanggal */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-[#002045]">
              Tanggal <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select className="w-full appearance-none px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-600 focus:outline-none focus:border-[#006A61]">
                <option value="">Semua Tanggal</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Filter Level */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-[#002045]">
              Level <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select className="w-full appearance-none px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-600 focus:outline-none focus:border-[#006A61]">
                <option value="">Semua Level</option>
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
                <th className="p-4 font-semibold">Nama</th>
                <th className="p-4 font-semibold">Tanggal</th>
                <th className="p-4 font-semibold text-center w-32">Level</th>
                <th className="p-4 font-semibold text-center w-28">Skor</th>
                <th className="p-4 font-semibold text-center w-28">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {userResults.length > 0 ? (
                userResults.map((usr, idx) => (
                  <tr key={usr.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="p-4 text-center">
                      <input type="checkbox" className="rounded border-gray-300 accent-[#002045]" />
                    </td>
                    <td className="p-4 text-gray-400">{idx + 1}</td>
                    <td className="p-4 font-bold text-[#002045]">{usr.userIdCode}</td>
                    <td className="p-4 font-medium text-[#1E1E1E]">{usr.userName}</td>
                    <td className="p-4 text-gray-500">
                      {new Date(usr.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-4 text-center">
                      <span className="px-3 py-1 bg-[#002045] text-white rounded-full font-bold text-[10px] tracking-wider uppercase">{usr.badgeLevel}</span>
                    </td>
                    <td className="p-4 text-center font-bold text-[#002045]">{usr.compositeScore}/100</td>
                    <td className="p-4">
                      <div className="flex items-center justify-center space-x-2 text-gray-500">
                        <Link href={`/admin/pengguna/detail/${usr.id}`} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" title="Lihat Detail">
                          <Eye className="w-4 h-4 text-gray-500" />
                        </Link>

                        <DeleteUserModal id={usr.id} userName={usr.userName} userCode={usr.userIdCode} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                /* Empty State saat Database Masih Kosong */
                <tr>
                  <td colSpan={8} className="p-12 text-center">
                    <div className="max-w-xs mx-auto space-y-3">
                      <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto border border-gray-100">
                        <Inbox className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-sm text-[#002045]">Belum Ada Data Pengguna</h3>
                      <p className="text-xs text-gray-400 leading-relaxed">Data hasil kuesioner pengguna akan otomatis muncul di sini begitu pengajar melakukan assessment.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Kondisional (> 10 Data) */}
        {userResults.length > 10 && (
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
