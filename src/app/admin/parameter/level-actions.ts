"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { QuestionStatus } from "@prisma/client";

export interface LevelInput {
  code?: string;
  name: string;
  minScore: number;
  maxScore: number;
  status: QuestionStatus;
}

// 1. Ambil Kode ID Level Berikutnya Secara Realtime (5 Karakter: LV001, LV002, dst)
// Ambil Kode ID Level Berikutnya (Format: LVL001, LVL002, dst)
export async function getNextLevelCode(): Promise<string> {
  try {
    const count = await prisma.competencyLevel.count();
    const nextNumber = count + 1;
    return `LVL${nextNumber.toString().padStart(3, "0")}`;
  } catch (error) {
    console.error("Gagal generate kode level:", error);
    return "LVL001";
  }
}

// 2. Cek Validasi Rentang Skor Tumpang Tindih (Overlap Check)
export async function checkScoreOverlap(minScore: number, maxScore: number, currentId?: string) {
  try {
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
  } catch (error) {
    console.error("Check Overlap Error:", error);
    return {
      hasOverlap: false,
      message: "Gagal memeriksa validasi rentang skor.",
    };
  }
}

// 3. Tambah Level
export async function createLevel(data: LevelInput) {
  try {
    const code = data.code ? data.code.trim() : await getNextLevelCode();
    const level = await prisma.competencyLevel.create({
      data: {
        code,
        name: data.name.trim(),
        minScore: Number(data.minScore),
        maxScore: Number(data.maxScore),
        status: data.status || "ACTIVE",
      },
    });

    revalidatePath("/admin/parameter");
    return { success: true, data: level };
  } catch (error) {
    console.error("Create Level Error:", error);
    return { success: false, message: "Gagal menambahkan level kompetensi baru." };
  }
}

// 4. Update Level
export async function updateLevel(id: string, data: LevelInput) {
  try {
    const level = await prisma.competencyLevel.update({
      where: { id },
      data: {
        name: data.name.trim(),
        minScore: Number(data.minScore),
        maxScore: Number(data.maxScore),
        status: data.status || "ACTIVE",
      },
    });

    revalidatePath("/admin/parameter");
    revalidatePath(`/admin/parameter/level/detail/${id}`);
    revalidatePath(`/admin/parameter/level/edit/${id}`);
    return { success: true, data: level };
  } catch (error) {
    console.error("Update Level Error:", error);
    return { success: false, message: "Gagal memperbarui level kompetensi." };
  }
}

// 5. Hapus Level
export async function deleteLevel(id: string) {
  try {
    await prisma.competencyLevel.delete({
      where: { id },
    });

    revalidatePath("/admin/parameter");
    return { success: true, message: "Level kompetensi berhasil dihapus." };
  } catch (error) {
    console.error("Delete Level Error:", error);
    return { success: false, message: "Gagal menghapus level kompetensi." };
  }
}
