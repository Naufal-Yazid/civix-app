import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteModalButton from "@/components/admin/DeleteModalButton";
import { Plus, Eye, Edit3 } from "lucide-react";

export default async function ManajemenSoalPage() {
  const questions = await prisma.question.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      {/* Title & CTA */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-[#002045]">Manajemen Soal</h1>
          <p className="text-xs text-[#64748B] mt-1">Kelola bank soal untuk asesmen kompetensi kewarganegaraan.</p>
        </div>

        <Link href="/admin/soal/tambah" className="inline-flex items-center gap-2 px-5 py-3 bg-[#002045] text-white text-xs font-semibold rounded-xl hover:bg-[#001833] transition-colors shadow-xs">
          <Plus className="w-4 h-4" />
          Tambah Pertanyaan
        </Link>
      </div>

      {/* Tabel Data Soal */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-gray-200 text-[#64748B]">
              <th className="p-4 font-semibold w-12">#</th>
              <th className="p-4 font-semibold w-24">ID</th>
              <th className="p-4 font-semibold">Pertanyaan</th>
              <th className="p-4 font-semibold">Dimensi</th>
              <th className="p-4 font-semibold">Jenis Jawaban</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-center w-28">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {questions.map((q, idx) => (
              <tr key={q.id} className="hover:bg-gray-50/80 transition-colors">
                <td className="p-4 text-gray-400">{idx + 1}</td>
                <td className="p-4 font-bold text-[#002045]">{q.code}</td>
                <td className="p-4 max-w-xs truncate text-[#1E1E1E]">{q.questionText}</td>
                <td className="p-4">
                  <span className="px-2.5 py-1 rounded-lg bg-teal-50 text-[#006A61] font-semibold text-[11px]">{q.dimension}</span>
                </td>
                <td className="p-4 font-medium text-gray-600">{q.type}</td>
                <td className="p-4">
                  <span className={`font-semibold ${q.status === "ACTIVE" ? "text-emerald-600" : q.status === "INACTIVE" ? "text-rose-500" : "text-amber-500"}`}>{q.status}</span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Link href={`/admin/soal/edit/${q.id}`} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500">
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link href={`/admin/soal/edit/${q.id}`} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500">
                      <Edit3 className="w-4 h-4" />
                    </Link>
                    <DeleteModalButton id={q.id} code={q.code} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
