"use client";

import React, { useState, useEffect, useTransition } from "react";
import { User, Lock, Eye, EyeOff, X, CheckCircle2, AlertCircle } from "lucide-react";
import { getAdminProfile, updateAdminProfile, updateAdminPassword } from "./actions";

export default function AdminPengaturanPage() {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [lastUpdatedText, setLastUpdatedText] = useState("Terakhir diperbarui: 19 Agustus 2026");

  // Status Alert Feedback
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // State Modal Ganti Password
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    async function loadData() {
      const data = await getAdminProfile();
      if (data) {
        setName(data.name || "Admin Civix");
        setEmail(data.email || "admin@civix.edu");
        if (data.updatedAt) {
          const date = new Date(data.updatedAt);
          const formatted = date.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });
          setLastUpdatedText(`Terakhir diperbarui: ${formatted}`);
        }
      }
    }
    loadData();
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);

    startTransition(async () => {
      const res = await updateAdminProfile(formData);
      if (res.success) {
        setStatusMsg({ type: "success", text: res.message });

        // Kirim sinyal ke layout/top bar agar update seketika secara real-time
        window.dispatchEvent(
          new CustomEvent("admin-profile-updated", {
            detail: { name, email },
          }),
        );
      } else {
        setStatusMsg({ type: "error", text: res.message });
      }
    });
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    const formData = new FormData();
    formData.append("currentPassword", currentPassword);
    formData.append("newPassword", newPassword);
    formData.append("confirmPassword", confirmPassword);

    startTransition(async () => {
      const res = await updateAdminPassword(formData);
      if (res.success) {
        setPasswordMsg({ type: "success", text: res.message });
        setTimeout(() => {
          setIsPasswordModalOpen(false);
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
          setPasswordMsg(null);
        }, 1200);
      } else {
        setPasswordMsg({ type: "error", text: res.message });
      }
    });
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* HEADER SECTION */}
      <div>
        <h1 className="text-2xl font-bold text-[#002045]">Pengaturan</h1>
        <p className="text-[14px] text-[#64748B] mt-1">Kelola profil Anda dan konfigurasi parameter assessment untuk sistem.</p>
      </div>

      {/* MAIN CONTAINER CARD */}
      <div className="bg-white border border-gray-200/80 rounded-2xl shadow-xs overflow-hidden">
        <div className="flex flex-col md:flex-row min-h-[520px]">
          {/* TAB MENU KIRI */}
          <div className="w-full md:w-70 p-6 md:p-8 md:border-r border-gray-100 shrink-0">
            <button type="button" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-white text-[#002045] font-medium text-[14px] shadow-xs cursor-default text-left">
              <User className="w-5 h-5 text-[#002045]" />
              <span>Profile Pengguna</span>
            </button>
          </div>

          {/* FORM AREA KANAN */}
          <div className="flex-1 p-6 md:p-10 max-w-4xl space-y-7">
            <div>
              <h2 className="text-lg font-bold text-[#002045]">Informasi Profil</h2>
              <p className="text-[13px] text-[#64748B] mt-0.5">Kelola profil Anda dan konfigurasi parameter assessment untuk sistem.</p>
            </div>

            {/* ALERT NOTIFIKASI */}
            {statusMsg && (
              <div
                className={`p-3.5 rounded-xl border text-xs font-medium flex items-center gap-2.5 animate-in fade-in duration-150 ${
                  statusMsg.type === "success" ? "bg-emerald-50 border-emerald-200/80 text-emerald-800" : "bg-red-50 border-red-200/80 text-red-700"
                }`}
              >
                {statusMsg.type === "success" ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
                <span>{statusMsg.text}</span>
              </div>
            )}

            {/* FORM INPUT PROFIL */}
            <form onSubmit={handleSaveProfile} className="space-y-5">
              {/* Nama Lengkap */}
              <div className="space-y-1.5">
                <label className="block text-[14px] font-medium text-[#1E1E1E]">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Admin Civix"
                  className="w-full px-4 py-3 text-[14px] bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#006A61] text-[#1E1E1E] transition-colors"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="block text-[14px] font-medium text-[#1E1E1E]">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@civix.edu"
                  className="w-full px-4 py-3 text-[14px] bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#006A61] text-[#1E1E1E] transition-colors"
                />
              </div>

              {/* CARD KEAMANAN KATA SANDI */}
              <div className="p-4 bg-white border border-gray-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#006A61] flex items-center justify-center shrink-0">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-[#002045]">Keamanan Kata Sandi</h4>
                    <p className="text-[12px] text-[#64748B] mt-0.5">{lastUpdatedText}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="px-4 py-2 text-[13px] font-medium text-[#006A61] border border-[#006A61] hover:bg-[#006A61]/5 rounded-xl transition-colors shrink-0 cursor-pointer"
                >
                  Ubah Password
                </button>
              </div>

              {/* TOMBOL SIMPAN PERUBAHAN */}
              <div className="flex justify-end pt-3">
                <button type="submit" disabled={isPending} className="px-6 py-3 bg-[#002045] hover:bg-[#001833] text-white font-semibold text-[14px] rounded-xl transition-all shadow-xs disabled:opacity-50 cursor-pointer">
                  {isPending ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* MODAL UBAH PASSWORD */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 sm:p-7 shadow-xl border border-gray-100 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#002045]">Ubah Kata Sandi</h3>
                <p className="text-xs text-[#64748B] mt-0.5">Perbarui kata sandi login admin Anda.</p>
              </div>
              <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="p-1 rounded-lg text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {passwordMsg && (
              <div className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2 ${passwordMsg.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-700"}`}>
                <span>{passwordMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleSavePassword} className="space-y-4">
              {/* Kata Sandi Saat Ini */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-[#1E1E1E]">Kata Sandi Saat Ini</label>
                <div className="relative">
                  <input
                    type={showCurrent ? "text" : "password"}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Masukkan kata sandi saat ini"
                    className="w-full px-3.5 pr-10 py-2.5 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#006A61]"
                  />
                  <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Kata Sandi Baru */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-[#1E1E1E]">Kata Sandi Baru</label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full px-3.5 pr-10 py-2.5 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#006A61]"
                  />
                  <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Konfirmasi Kata Sandi Baru */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-[#1E1E1E]">Konfirmasi Kata Sandi Baru</label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi kata sandi baru"
                    className="w-full px-3.5 pr-10 py-2.5 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#006A61]"
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="px-4 py-2 border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
                  Batal
                </button>
                <button type="submit" disabled={isPending} className="px-4 py-2 bg-[#002045] hover:bg-[#001833] text-white text-xs font-medium rounded-xl transition-colors shadow-xs disabled:opacity-50 cursor-pointer">
                  {isPending ? "Memproses..." : "Simpan Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
