import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import QuestionForm from "@/components/admin/QuestionForm";
import { ChevronRight } from "lucide-react";

interface EditSoalPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditSoalPage({ params }: EditSoalPageProps) {
  // 1. Await params terlebih dahulu (untuk kompatibilitas Next.js 15+)
  const { id } = await params;

  // 2. Ambil data soal dari database
  const question = await prisma.question.findUnique({
    where: { id },
  });

  if (!question) {
    notFound();
  }

  // Cast options ke tipe array yang sesuai
  const formattedOptions = (question as unknown as { options: { label?: string; text: string; score: number }[] }).options || [];

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
          <span className="font-semibold text-[#002045]">Edit Pertanyaan</span>
        </nav>

        {/* Title & Description */}
        <div className="pt-1">
          <h1 className="text-2xl font-bold text-[#002045]">Edit Pertanyaan</h1>
          <p className="text-xs text-[#64748B] mt-1">Ubah detail teks pertanyaan, dimensi, atau opsi jawaban.</p>
        </div>
      </div>

      {/* FORM EDIT PERTANYAAN */}
      <QuestionForm
        initialData={{
          ...question,
          options: formattedOptions,
        }}
        isEdit={true}
      />
    </div>
  );
}
