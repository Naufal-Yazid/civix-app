"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Target, Users, Settings, Search, Bell, LogOut, AlertCircle, X } from "lucide-react";
import { logoutAdmin } from "@/app/admin/login/actions";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Sembunyikan sidebar & top bar jika sedang berada di halaman login admin
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Helper function untuk gaya menu aktif (font medium & 14px)
  const getNavItemClass = (path: string) => {
    const isActive = pathname.startsWith(path);
    return `flex items-center gap-3.5 px-4 py-3 rounded-xl transition-colors font-regular text-[14px] ${isActive ? "bg-[#002045] text-white shadow-xs" : "text-[#64748B] hover:bg-gray-50 hover:text-[#002045]"}`;
  };

  const handleConfirmLogout = () => {
    startTransition(async () => {
      await logoutAdmin();
    });
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex text-[#1E1E1E]">
      {/* SIDEBAR KIRI */}
      <aside className="w-68 bg-white border-r border-gray-200/80 p-6 flex flex-col justify-between shrink-0 h-screen sticky top-0">
        <div className="space-y-5">
          {/* Logo Civix.id Rata Tengah & Navigasi ke Beranda (/) */}
          <div className="text-center">
            <Link href="/" className="text-3xl font-bold text-[#002045] tracking-tight inline-block hover:opacity-90 transition-opacity">
              Civix<span className="text-[#006A61]">.id</span>
            </Link>
          </div>

          {/* Navigasi Utama */}
          <nav className="space-y-2">
            <Link href="/admin/dashboard" className={getNavItemClass("/admin/dashboard")}>
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard Overview</span>
            </Link>

            <Link href="/admin/soal" className={getNavItemClass("/admin/soal")}>
              <FileText className="w-5 h-5" />
              <span>Manajemen Soal</span>
            </Link>

            <Link href="/admin/parameter" className={getNavItemClass("/admin/parameter")}>
              <Target className="w-5 h-5" />
              <span>Parameter Assessment</span>
            </Link>

            <Link href="/admin/pengguna" className={getNavItemClass("/admin/pengguna")}>
              <Users className="w-5 h-5" />
              <span>Data Pengguna</span>
            </Link>
          </nav>
        </div>

        {/* Pengaturan Bawah */}
        <div>
          <button className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-[#64748B] hover:bg-gray-50 hover:text-[#002045] transition-colors font-medium text-[14px] w-full text-left">
            <Settings className="w-5 h-5" />
            <span>Pengaturan</span>
          </button>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* TOP BAR HEADER */}
        <header className="h-20 bg-white border-b border-gray-200/80 px-8 flex items-center justify-between shrink-0 sticky top-0 z-40">
          {/* Input Search Data */}
          <div className="relative w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari data...."
              className="w-full pl-10 pr-4 py-2.5 text-[14px] font-medium bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#006A61] placeholder:text-gray-400 placeholder:font-normal"
            />
          </div>

          {/* Profil Admin & Action Icons */}
          <div className="flex items-center space-x-6">
            <button type="button" className="relative p-2 text-gray-500 hover:bg-gray-50 rounded-xl transition-colors">
              <Bell className="w-5 h-5 text-[#002045]" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white" />
            </button>

            <div className="h-8 w-[1px] bg-gray-200" />

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-amber-400 text-white font-bold text-sm flex items-center justify-center">AD</div>
              <div className="text-left leading-tight">
                <span className="block text-[14px] font-medium text-[#002045]">Admin Civix</span>
                <span className="block text-xs text-[#64748B]">admin@civix.edu</span>
              </div>
            </div>

            {/* Tombol Logout (Buka Modal) */}
            <button type="button" onClick={() => setShowLogoutModal(true)} className="p-2 text-gray-500 hover:text-red-500 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer" title="Logout Admin">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* BODY CONTENT */}
        <main className="p-8 flex-1">{children}</main>

        {/* FOOTER */}
        <footer className="py-4 text-center text-[11px] text-gray-400 border-t border-gray-100 bg-[#F8FAFC] mt-auto">© 2026 Civix.id. All rights reserved</footer>
      </div>

      {/* POPUP MODAL LOGOUT */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-xl border border-gray-100 space-y-5 animate-in zoom-in-95 duration-150">
            {/* Header Modal */}
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <button type="button" onClick={() => setShowLogoutModal(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-1.5">
              <h3 className="text-[16px] font-bold text-[#002045]">Konfirmasi Keluar</h3>
              <p className="text-[13px] text-[#64748B] leading-relaxed">Apakah Anda yakin ingin keluar dari panel admin? Anda harus login kembali untuk mengakses data.</p>
            </div>

            {/* Tombol Aksi */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                disabled={isPending}
                className="flex-1 py-2.5 px-4 border border-gray-200 text-[#002045] font-medium text-[13px] rounded-xl hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                disabled={isPending}
                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-medium text-[13px] rounded-xl transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isPending ? "Keluar..." : "Ya, Keluar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
