import React from "react";
import Link from "next/link";
import QuestionForm from "@/components/admin/QuestionForm";
import { ChevronRight } from "lucide-react";

export default function TambahSoalPage() {
  return (
    <div className="space-y-6">
      {/* HEADER & BREADCRUMBS */}
      <div className="space-y-1">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs text-[#64748B]">
          <Link href="/admin/soal" className="hover:text-[#002045] hover:underline transition-colors font-medium">
            Manajemen Soal
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="font-semibold text-[#002045]">Tambah Pertanyaan</span>
        </nav>

        {/* Title & Description */}
        <div className="pt-1">
          <h1 className="text-2xl font-bold text-[#002045]">Tambah Pertanyaan</h1>
          <p className="text-xs text-[#64748B] mt-1">Buat pertanyaan baru untuk bank soal asesmen kompetensi kewarganegaraan.</p>
        </div>
      </div>

      {/* FORM TAMBAH PERTANYAAN */}
      <QuestionForm isEdit={false} />
    </div>
  );
}
