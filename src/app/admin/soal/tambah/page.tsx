import React from "react";
import QuestionForm from "@/components/admin/QuestionForm";

export default function TambahSoalPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs text-[#64748B] mb-1">
          Manajemen Soal / <span className="text-[#002045] font-semibold">Tambah Pertanyaan</span>
        </div>
        <h1 className="text-2xl font-bold text-[#002045]">Tambah Pertanyaan</h1>
      </div>

      <QuestionForm />
    </div>
  );
}
