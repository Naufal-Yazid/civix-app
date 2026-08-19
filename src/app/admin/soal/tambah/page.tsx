import React from "react";
import Link from "next/link";
import QuestionForm from "@/components/admin/QuestionForm";
import { getActiveCategories } from "@/app/admin/parameter/actions";
import { ChevronRight } from "lucide-react";

export default async function TambahSoalPage() {
  // Fetch dimensi aktif dari database Parameter Assessment
  const categories = await getActiveCategories();
  const dimensionsList = categories.map((c) => c.name);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <nav className="flex items-center space-x-2 text-xs text-[#64748B]">
          <Link href="/admin/soal" className="hover:text-[#002045] hover:underline transition-colors font-medium">
            Manajemen Soal
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="font-semibold text-[#002045]">Tambah Pertanyaan</span>
        </nav>

        <div className="pt-1">
          <h1 className="text-2xl font-semibold text-[#002045]">Tambah Pertanyaan</h1>
        </div>
      </div>

      <QuestionForm dimensionsList={dimensionsList} isEdit={false} />
    </div>
  );
}
