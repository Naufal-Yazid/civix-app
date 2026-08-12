import React from "react";
import Link from "next/link";
import LevelForm from "@/components/admin/LevelForm";
import { ChevronRight } from "lucide-react";

export default function TambahLevelPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <nav className="flex items-center space-x-2 text-xs text-[#64748B]">
          <Link href="/admin/parameter?tab=level" className="hover:text-[#002045] hover:underline transition-colors font-medium">
            Parameter Assessment
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="font-semibold text-[#002045]">Tambah Level Kompetensi</span>
        </nav>

        <div className="pt-1">
          <h1 className="text-2xl font-bold text-[#002045]">Tambah Level Kompetensi</h1>
        </div>
      </div>

      <LevelForm isEdit={false} />
    </div>
  );
}
