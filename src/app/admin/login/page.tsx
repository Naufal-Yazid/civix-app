"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { loginAdmin } from "./actions";

export default function AdminLoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    startTransition(async () => {
      const res = await loginAdmin(formData);
      if (res.success) {
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        setErrorMsg(res.message || "Login gagal.");
      }
    });
  };

  return (
    <div className="relative min-h-screen w-full bg-white flex flex-col justify-between overflow-hidden">
      {/* 1. TOP NAVBAR / HEADER BRAND (Kiri Atas Sesuai Gambar) */}
      <header className="w-full px-8 sm:px-12 py-5 border-b border-gray-100/80 bg-white z-20">
        <Link href="/" className="text-2xl font-bold text-[#002045] tracking-tight inline-block">
          Civix<span className="text-[#006A61]">.id</span>
        </Link>
      </header>

      {/* 2. BACKGROUND SHAPE (Kubah Melengkung Teal Pastel di Bawah Sesuai Gambar) */}
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[160vw] max-w-[1900px] h-[55vh] bg-[#E2ECE9]/60 rounded-t-[100%] pointer-events-none z-0" />

      {/* 3. MAIN CENTER CONTAINER (LOGIN CARD) */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10 my-4">
        <div className="w-full max-w-[440px] bg-white border border-gray-200/90 rounded-[28px] p-8 sm:p-10 shadow-lg shadow-gray-200/40 space-y-6">
          {/* Logo Civix.id di Dalam Card */}
          <div className="text-center pt-2">
            <h1 className="text-4xl font-extrabold text-[#002045] tracking-tight">
              Civix<span className="text-[#006A61]">.id</span>
            </h1>
          </div>

          {/* Heading Login Admin */}
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-[#006A61]">Login Admin</h2>
            <p className="text-[13px] text-[#64748B]">Masukkan kredensial Anda untuk mengakses portal</p>
          </div>

          {/* Alert Error */}
          {errorMsg && <div className="p-3 rounded-xl bg-red-50 border border-red-200/80 text-xs font-medium text-red-700 animate-in fade-in duration-150">{errorMsg}</div>}

          {/* Form Login */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input Email */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[#1E1E1E]">Email</label>
              <div className="relative flex items-center">
                <Mail className="w-[18px] h-[18px] absolute left-4 text-gray-400 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full pl-11 pr-4 py-3 text-[16px] bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#006A61] placeholder:text-gray-400 text-[#1E1E1E] transition-colors"
                />
              </div>
            </div>

            {/* Input Kata Sandi */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[#1E1E1E]">Kata Sandi</label>
              <div className="relative flex items-center">
                <Lock className="w-[18px] h-[18px] absolute left-4 text-gray-400 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Kata Sandi"
                  className="w-full pl-11 pr-11 py-3 text-[16px] bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#006A61] placeholder:text-gray-400 text-[#1E1E1E] transition-colors"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 text-gray-400 hover:text-gray-600 transition-colors p-1">
                  {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                </button>
              </div>
            </div>

            {/* Tombol Masuk */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#002045] hover:bg-[#001833] text-white font-semibold text-[15px] rounded-xl transition-all shadow-xs disabled:opacity-50 cursor-pointer"
              >
                <span>{isPending ? "Memproses..." : "Masuk"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* 4. FOOTER */}
      <footer className="w-full py-4 text-center text-xs text-gray-400 z-10">© 2026 Civix.id. All rights reserved</footer>
    </div>
  );
}
