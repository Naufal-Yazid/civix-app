import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import QuestionForm from "@/components/admin/QuestionForm";
import { getActiveCategories } from "@/app/admin/parameter/actions";
import { ChevronRight } from "lucide-react";

interface DetailSoalPageProps {
  params: Promise<{ id: string }>;
}

export default async function DetailSoalPage({ params }: DetailSoalPageProps) {
  const { id } = await params;

  const [question, categories] = await Promise.all([prisma.question.findUnique({ where: { id } }), getActiveCategories()]);

  if (!question) notFound();

  const dimensionsList = categories.map((c) => c.name);
  const formattedOptions = (question as unknown as { options: { label?: string; text: string; score: number }[] }).options || [];

  return (
    <div className="space-y-6">
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
        </div>
      </div>

      <QuestionForm initialData={{ ...question, options: formattedOptions }} dimensionsList={dimensionsList} isViewOnly={true} />
    </div>
  );
}
