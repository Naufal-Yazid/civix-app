import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import QuestionForm from "@/components/admin/QuestionForm";
import { ChevronRight } from "lucide-react";

interface DetailSoalPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function DetailSoalPage({ params }: DetailSoalPageProps) {
  const { id } = await params;

  const question = await prisma.question.findUnique({
    where: { id },
  });

  if (!question) {
    notFound();
  }

  const formattedOptions = (question.options as { label?: string; text: string; score: number }[]) || [];

  return (
    <div className="space-y-6">
      {/* HEADER & BREADCRUMBS */}
      <div className="space-y-1">
        <nav className="flex items-center space-x-2 text-xs text-[#64748B]">
          <Link href="/admin/soal" className="hover:text-[#002045] hover:underline transition-colors font-medium">
            Manajemen Soal
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="font-semibold text-[#002045]">Detail Pertanyaan</span>
        </nav>

        <div className="pt-1">
          <h1 className="text-2xl font-bold text-[#002045]">Detail Pertanyaan</h1>
          <p className="text-xs text-[#64748B] mt-1">Lihat rincian konfigurasi dan opsi jawaban dari pertanyaan ini.</p>
        </div>
      </div>

      {/* FORM DETAIL (MODE READ ONLY) */}
      <QuestionForm
        initialData={{
          ...question,
          options: formattedOptions,
        }}
        isViewOnly={true}
      />
    </div>
  );
}
