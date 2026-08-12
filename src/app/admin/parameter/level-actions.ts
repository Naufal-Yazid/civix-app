"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { QuestionStatus } from "@prisma/client";

export interface LevelInput {
  name: string;
  minScore: number;
  maxScore: number;
  status: QuestionStatus;
}

// 1. Generate Kode Unik Level (LVL001, LVL002, dst)
async function generateLevelCode(): Promise<string> {
  const count = await prisma.competencyLevel.count();
  const nextNumber = count + 1;
  return `LVL${nextNumber.toString().padStart(3, "0")}`;
}

// 2. Cek Validasi Rentang Skor Tumpang Tindih (Overlap Check)
export async function checkScoreOverlap(minScore: number, maxScore: number, currentId?: string) {
  const levels = await prisma.competencyLevel.findMany({
    where: {
      ...(currentId ? { NOT: { id: currentId } } : {}),
      status: "ACTIVE",
    },
  });

  const overlappingLevel = levels.find((lvl) => {
    return (minScore >= lvl.minScore && minScore <= lvl.maxScore) || (maxScore >= lvl.minScore && maxScore <= lvl.maxScore) || (minScore <= lvl.minScore && maxScore >= lvl.maxScore);
  });

  if (overlappingLevel) {
    return {
      hasOverlap: true,
      message: `Peringatan: Rentang skor ini tumpang tindih dengan level '${overlappingLevel.name}' (${overlappingLevel.minScore}% - ${overlappingLevel.maxScore}%). Harap sesuaikan kembali.`,
    };
  }

  return {
    hasOverlap: false,
    message: "Rentang skor valid dan tidak tumpang tindih dengan level kompetensi lainnya.",
  };
}

// 3. Tambah Level
export async function createLevel(data: LevelInput) {
  const code = await generateLevelCode();
  const level = await prisma.competencyLevel.create({
    data: {
      code,
      name: data.name,
      minScore: data.minScore,
      maxScore: data.maxScore,
      status: data.status,
    },
  });
  revalidatePath("/admin/parameter");
  return level;
}

// 4. Update Level
export async function updateLevel(id: string, data: LevelInput) {
  const level = await prisma.competencyLevel.update({
    where: { id },
    data: {
      name: data.name,
      minScore: data.minScore,
      maxScore: data.maxScore,
      status: data.status,
    },
  });
  revalidatePath("/admin/parameter");
  return level;
}

// 5. Hapus Level
export async function deleteLevel(id: string) {
  await prisma.competencyLevel.delete({
    where: { id },
  });
  revalidatePath("/admin/parameter");
}
