"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { QuestionType, QuestionStatus } from "@prisma/client";

export interface OptionItem {
  id?: string;
  label?: string;
  text: string;
  score: number;
}

// Interface yang diexport untuk QuestionForm.tsx
export interface QuestionInput {
  id?: string;
  code?: string;
  questionText: string;
  dimension: string;
  type: QuestionType;
  scaleMin?: number | null;
  scaleMax?: number | null;
  scaleMinLabel?: string | null;
  scaleMaxLabel?: string | null;
  options?: OptionItem[] | string;
  status?: QuestionStatus;
}

// Alias agar kompatibel jika ada komponen lain yang menggunakan nama QuestionFormData
export type QuestionFormData = QuestionInput;

// 1. Generate Kode Soal Otomatis (misal: QUE001, QUE002)
async function generateQuestionCode(): Promise<string> {
  const count = await prisma.question.count();
  return `QUE${(count + 1).toString().padStart(3, "0")}`;
}

// Helper untuk standarisasi format options berdasarkan tipe soal
function parseAndFormatOptions(type: QuestionType, rawOptionsInput?: OptionItem[] | string): { label: string; text: string; score: number }[] {
  let rawList: OptionItem[] = [];

  if (typeof rawOptionsInput === "string") {
    try {
      rawList = JSON.parse(rawOptionsInput);
    } catch {
      rawList = [];
    }
  } else if (Array.isArray(rawOptionsInput)) {
    rawList = rawOptionsInput;
  }

  // 1. Format untuk tipe SCALE
  if (type === "SCALE") {
    return rawList.map((opt, idx) => ({
      label: opt.label?.trim() || String(idx + 1),
      text: opt.text?.trim() || `Skala ${opt.label || idx + 1}`,
      score: isNaN(Number(opt.score)) ? 0 : Number(opt.score),
    }));
  }

  // 2. Format untuk MULTIPLE_CHOICE, CHECKBOX, DROPDOWN
  if (["MULTIPLE_CHOICE", "CHECKBOX", "DROPDOWN"].includes(type)) {
    return rawList
      .filter((opt) => opt && typeof opt.text === "string" && opt.text.trim() !== "")
      .map((opt, idx) => ({
        label: opt.label?.trim() || String.fromCharCode(65 + idx),
        text: opt.text.trim(),
        score: isNaN(Number(opt.score)) ? 0 : Number(opt.score),
      }));
  }

  return [];
}

// 2. Ambil Semua Data Soal untuk Tabel Admin (Termasuk Relasi Options)
export async function getAdminQuestions() {
  try {
    const questions = await prisma.question.findMany({
      include: {
        options: {
          orderBy: { label: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return questions;
  } catch (error) {
    console.error("Gagal mengambil data soal admin:", error);
    return [];
  }
}

// 3. Ambil Detail Soal Berdasarkan ID
export async function getQuestionById(id: string) {
  try {
    const question = await prisma.question.findUnique({
      where: { id },
      include: {
        options: {
          orderBy: { label: "asc" },
        },
      },
    });
    return question;
  } catch (error) {
    console.error("Gagal mengambil detail soal:", error);
    return null;
  }
}

// 4. Tambah Soal Baru
export async function createQuestion(data: QuestionInput) {
  try {
    const code = data.code ? data.code.trim() : await generateQuestionCode();
    const isScaleType = data.type === "SCALE";
    const formattedOptions = parseAndFormatOptions(data.type, data.options);

    const newQuestion = await prisma.question.create({
      data: {
        code,
        questionText: data.questionText.trim(),
        dimension: data.dimension.trim(),
        type: data.type,
        scaleMin: isScaleType ? (data.scaleMin !== undefined && data.scaleMin !== null ? Number(data.scaleMin) : 1) : null,
        scaleMax: isScaleType ? (data.scaleMax !== undefined && data.scaleMax !== null ? Number(data.scaleMax) : 5) : null,
        scaleMinLabel: isScaleType ? data.scaleMinLabel?.trim() || "Sangat Tidak Setuju" : null,
        scaleMaxLabel: isScaleType ? data.scaleMaxLabel?.trim() || "Sangat Setuju" : null,
        status: data.status || "ACTIVE",
        options: {
          create: formattedOptions,
        },
      },
      include: {
        options: true,
      },
    });

    revalidatePath("/admin/soal");
    revalidatePath("/admin/parameter");
    revalidatePath("/assessment");
    return { success: true, data: newQuestion };
  } catch (error) {
    console.error("Create Question Error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal menambahkan pertanyaan baru.",
    };
  }
}

// 5. Update / Edit Soal
export async function updateQuestion(id: string, data: QuestionInput) {
  try {
    const isScaleType = data.type === "SCALE";
    const formattedOptions = parseAndFormatOptions(data.type, data.options);

    const updated = await prisma.question.update({
      where: { id },
      data: {
        ...(data.code ? { code: data.code.trim() } : {}),
        questionText: data.questionText.trim(),
        dimension: data.dimension.trim(),
        type: data.type,
        scaleMin: isScaleType ? (data.scaleMin !== undefined && data.scaleMin !== null ? Number(data.scaleMin) : 1) : null,
        scaleMax: isScaleType ? (data.scaleMax !== undefined && data.scaleMax !== null ? Number(data.scaleMax) : 5) : null,
        scaleMinLabel: isScaleType ? data.scaleMinLabel?.trim() || "Sangat Tidak Setuju" : null,
        scaleMaxLabel: isScaleType ? data.scaleMaxLabel?.trim() || "Sangat Setuju" : null,
        status: data.status || "ACTIVE",
        options: {
          deleteMany: {},
          create: formattedOptions,
        },
      },
      include: {
        options: true,
      },
    });

    revalidatePath("/admin/soal");
    revalidatePath(`/admin/soal/edit/${id}`);
    revalidatePath(`/admin/soal/detail/${id}`);
    revalidatePath("/admin/parameter");
    revalidatePath("/assessment");
    return { success: true, data: updated };
  } catch (error) {
    console.error("Update Question Error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal memperbarui pertanyaan.",
    };
  }
}

// 6. Hapus Soal
export async function deleteQuestion(id: string) {
  try {
    await prisma.question.delete({
      where: { id },
    });

    revalidatePath("/admin/soal");
    revalidatePath("/admin/parameter");
    revalidatePath("/assessment");
    return { success: true, message: "Pertanyaan berhasil dihapus." };
  } catch (error) {
    console.error("Delete Question Error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal menghapus pertanyaan.",
    };
  }
}
