"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Send } from "lucide-react";

export default function KontakPage() {
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    subjek: "",
    pesan: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Proses pengiriman formulir di sini
    alert("Pesan Anda telah berhasil terkirim!");
  };

  return (
    <main className="min-h-screen bg-white text-[#1E1E1E]">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="pt-20 pb-12 px-6 lg:px-12 text-center max-w-4xl mx-auto">
        <h1 className="text-[32px] sm:text-[32px] font-bold text-[#002045] tracking-tight leading-tight mb-4">Ada yang bisa kami bantu?</h1>
        <p className="text-[#64748B] text-[16px] leading-relaxed max-w-xl mx-auto">Punya pertanyaan atau butuh bantuan? Kami siap membantu. Hubungi kami dan kami akan membalas dalam waktu 24 jam.</p>
      </section>

      {/* 2. FORM CONTACT CARD SECTION */}
      <section className="pb-24 px-6 lg:px-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border border-gray-200/80 rounded-3xl p-8 sm:p-10 shadow-sm">
            {/* Header Form */}
            <div className="mb-8">
              <div className="flex items-center space-x-2.5 text-[#002045] mb-2">
                <Mail className="w-5 h-5 text-[#002045]" />
                <h2 className="text-xl font-bold">Hubungi Kami</h2>
              </div>
              <p className="text-xs text-[#64748B]">Isi formulir dan kami akan segera menghubungi Anda kembali.</p>
            </div>

            {/* Form Inputs */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Grid Nama & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Input Nama */}
                <div className="space-y-2">
                  <label htmlFor="nama" className="block text-xs font-semibold text-[#002045]">
                    Nama
                  </label>
                  <input
                    type="text"
                    id="nama"
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    placeholder="Nama Anda"
                    required
                    className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#006A61] focus:ring-1 focus:ring-[#006A61] transition-all placeholder:text-gray-300"
                  />
                </div>

                {/* Input Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-xs font-semibold text-[#002045]">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="anda@email.com"
                    required
                    className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#006A61] focus:ring-1 focus:ring-[#006A61] transition-all placeholder:text-gray-300"
                  />
                </div>
              </div>

              {/* Input Subjek */}
              <div className="space-y-2">
                <label htmlFor="subjek" className="block text-xs font-semibold text-[#002045]">
                  Subjek
                </label>
                <input
                  type="text"
                  id="subjek"
                  name="subjek"
                  value={formData.subjek}
                  onChange={handleChange}
                  placeholder="Ada yang bisa kami bantu?"
                  required
                  className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#006A61] focus:ring-1 focus:ring-[#006A61] transition-all placeholder:text-gray-300"
                />
              </div>

              {/* Textarea Pesan */}
              <div className="space-y-2">
                <label htmlFor="pesan" className="block text-xs font-semibold text-[#002045]">
                  Pesan
                </label>
                <textarea
                  id="pesan"
                  name="pesan"
                  rows={5}
                  value={formData.pesan}
                  onChange={handleChange}
                  placeholder="Ceritakan lebih banyak..."
                  required
                  className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#006A61] focus:ring-1 focus:ring-[#006A61] transition-all placeholder:text-gray-300 resize-none"
                />
              </div>

              {/* Tombol Submit */}
              <button type="submit" className="w-full py-3.5 bg-[#002045] text-white text-sm font-semibold rounded-xl hover:bg-[#001833] transition-colors shadow-sm flex items-center justify-center gap-2 mt-4">
                <Send className="w-4 h-4 rotate-45" />
                Kirim Pesan
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 3. FOOTER (Tanpa CTA Banner) */}
      <Footer />
    </main>
  );
}
