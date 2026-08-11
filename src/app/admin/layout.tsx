import React from "react";
import Link from "next/link";
import { LayoutDashboard, FileText, Target, Users, Settings, Search, Bell, LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-[#1E1E1E]">
      {/* SIDEBAR KIRI */}
      <aside className="w-64 bg-white border-r border-gray-200/80 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          {/* Logo Civix.id */}
          <Link href="/admin/soal" className="text-2xl font-bold text-[#002045] tracking-tight block">
            Civix<span className="text-[#006A61]">.id</span>
          </Link>

          {/* Navigasi Utama */}
          <nav className="space-y-2 text-xs font-semibold">
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

        {/* Pengaturan Bawah */}
        <div>
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#64748B] hover:bg-gray-50 transition-colors text-xs font-semibold w-full">
            <Settings className="w-4 h-4" />
            Pengaturan
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP BAR HEADER */}
        <header className="h-20 bg-white border-b border-gray-200/80 px-8 flex items-center justify-between">
          {/* Input Search Data */}
          <div className="relative w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Cari data...." className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#006A61] placeholder:text-gray-400" />
          </div>

          {/* Profil Admin & Action Icons */}
          <div className="flex items-center space-x-6">
            {/* Lonceng Notifikasi dengan Badge Merah */}
            <button className="relative p-2 text-gray-500 hover:bg-gray-50 rounded-xl transition-colors">
              <Bell className="w-5 h-5 text-[#002045]" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white" />
            </button>

            <div className="h-8 w-[1px] bg-gray-200" />

            {/* Avatar & Profil Admin */}
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-amber-400 text-white font-bold text-xs flex items-center justify-center">AD</div>
              <div className="text-left leading-tight">
                <span className="block text-xs font-bold text-[#002045]">Admin Civix</span>
                <span className="block text-[10px] text-[#64748B]">admin@civix.edu</span>
              </div>
            </div>

            {/* Tombol Log Out */}
            <button className="p-2 text-gray-500 hover:text-red-500 hover:bg-gray-50 rounded-xl transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* BODY CONTENT */}
        <main className="p-8 flex-1">{children}</main>

        {/* FOOTER COPYRIGHT */}
        <footer className="py-4 text-center text-[11px] text-gray-400 border-t border-gray-100 bg-white">© 2026 Civix.id. All rights reserved</footer>
      </div>
    </div>
  );
}
