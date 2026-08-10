import React from "react";
import { prisma } from "@/lib/prisma";
import QuestionForm from "@/components/admin/QuestionForm";
import { notFound } from "next/navigation";

export default async function EditSoalPage({ params }: { params: { id: string } }) {
  const question = await prisma.question.findUnique({
    where: { id: params.id },
    include: { options: true },
  });

  if (!question) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs text-[#64748B] mb-1">
          Manajemen Soal / <span className="text-[#002045] font-semibold">Edit Pertanyaan</span>
        </div>
        <h1 className="text-2xl font-bold text-[#002045]">Edit Pertanyaan ({question.code})</h1>
      </div>

      <QuestionForm initialData={question} isEdit />
    </div>
  );
}
