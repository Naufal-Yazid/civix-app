"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 1. Ambil Semua Data Hasil Assessment Pengguna
export async function getAssessmentResults() {
  return await prisma.assessmentResult.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      answers: true,
    },
  });
}

// 2. Ambil Single Result Berdasarkan ID
export async function getAssessmentResultById(id: string) {
  return await prisma.assessmentResult.findUnique({
    where: { id },
    include: {
      answers: true,
    },
  });
}

// 3. Hapus Data Hasil Assessment
export async function deleteAssessmentResult(id: string) {
  await prisma.assessmentResult.delete({
    where: { id },
  });
  revalidatePath("/admin/pengguna");
}
