import React from "react";
import Link from "next/link";
import { LayoutDashboard, FileText, Target, Users, Settings } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-[#1E1E1E]">
      {/* Sidebar Kanan */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          {/* Logo Civix */}
          <Link href="/admin/soal" className="text-3xl font-bold text-[#002045] block">
            Civix<span className="text-[#006A61]">.id</span>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1.5 text-xs font-semibold">
            <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#64748B] hover:bg-gray-50 transition-colors">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard Overview
            </Link>

            <Link href="/admin/soal" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#002045] text-white shadow-xs">
              <FileText className="w-4 h-4" />
              Manajemen Soal
            </Link>

            <Link href="/admin/parameter" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#64748B] hover:bg-gray-50 transition-colors">
              <Target className="w-4 h-4" />
              Parameter Assessment
            </Link>

            <Link href="/admin/pengguna" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#64748B] hover:bg-gray-50 transition-colors">
              <Users className="w-4 h-4" />
              Data Pengguna
            </Link>
          </nav>
        </div>

        <div>
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#64748B] hover:bg-gray-50 transition-colors text-xs font-semibold w-full">
            <Settings className="w-4 h-4" />
            Pengaturan
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Top Bar */}
        <header className="h-20 bg-white border-b border-gray-200 px-8 flex items-center justify-between">
          <input type="text" placeholder="Cari data..." className="w-72 px-4 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#006A61]" />

          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-amber-400 text-white font-bold text-xs flex items-center justify-center">AD</div>
            <div className="text-left leading-tight">
              <span className="block text-xs font-bold text-[#002045]">Admin Civix</span>
              <span className="block text-[10px] text-[#64748B]">admin@civix.edu</span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
