"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { QuestionType, QuestionStatus } from "@prisma/client";

// Interface Payload Data Soal
export interface QuestionInput {
  questionText: string;
  dimension: string;
  type: QuestionType;
  status: QuestionStatus;
  options?: { label?: string; text: string; score: number }[];
  scaleMin?: number;
  scaleMax?: number;
  scaleMinLabel?: string;
  scaleMaxLabel?: string;
}

// 1. Generate Kode Unik Soal (QUE001, QUE002, dst)
async function generateQuestionCode(): Promise<string> {
  const count = await prisma.question.count();
  const nextNumber = count + 1;
  return `QUE${nextNumber.toString().padStart(3, "0")}`;
}

// 2. Tambah Pertanyaan
export async function createQuestion(data: QuestionInput) {
  const code = await generateQuestionCode();

  await prisma.question.create({
    data: {
      code,
      questionText: data.questionText,
      dimension: data.dimension,
      type: data.type,
      status: data.status,
      scaleMin: data.scaleMin,
      scaleMax: data.scaleMax,
      scaleMinLabel: data.scaleMinLabel,
      scaleMaxLabel: data.scaleMaxLabel,
      options:
        data.options && data.options.length > 0
          ? {
              create: data.options.map((opt) => ({
                label: opt.label,
                text: opt.text,
                score: opt.score,
              })),
            }
          : undefined,
    },
  });

  revalidatePath("/admin/soal");
}

// 3. Update Pertanyaan
export async function updateQuestion(id: string, data: QuestionInput) {
  // Hapus opsi lama terlebih dahulu
  await prisma.option.deleteMany({ where: { questionId: id } });

  await prisma.question.update({
    where: { id },
    data: {
      questionText: data.questionText,
      dimension: data.dimension,
      type: data.type,
      status: data.status,
      scaleMin: data.scaleMin,
      scaleMax: data.scaleMax,
      scaleMinLabel: data.scaleMinLabel,
      scaleMaxLabel: data.scaleMaxLabel,
      options:
        data.options && data.options.length > 0
          ? {
              create: data.options.map((opt) => ({
                label: opt.label,
                text: opt.text,
                score: opt.score,
              })),
            }
          : undefined,
    },
  });

  revalidatePath("/admin/soal");
}

// 4. Hapus Pertanyaan
export async function deleteQuestion(id: string) {
  await prisma.question.delete({
    where: { id },
  });
  revalidatePath("/admin/soal");
}
