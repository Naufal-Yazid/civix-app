"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { QuestionStatus } from "@prisma/client";

export interface CategoryWithCount {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  status: QuestionStatus;
  totalQuestions: number;
}

// 1. Ambil Semua Kategori Dimensi Beserta Hitungan Riil Total Soal
export async function getAdminCategories(): Promise<CategoryWithCount[]> {
  try {
    const [categories, questions] = await Promise.all([
      prisma.dimensionCategory.findMany({
        orderBy: { createdAt: "desc" },
      }),
      prisma.question.findMany({
        select: { dimension: true },
      }),
    ]);

    // Hitung soal dengan normalisasi lowercase dan trim agar selalu cocok
    const questionCountMap: Record<string, number> = {};
    questions.forEach((q) => {
      if (q.dimension) {
        const normalizedDim = q.dimension.trim().toLowerCase();
        questionCountMap[normalizedDim] = (questionCountMap[normalizedDim] || 0) + 1;
      }
    });

    return categories.map((cat) => {
      const normalizedName = cat.name.trim().toLowerCase();
      return {
        id: cat.id,
        code: cat.code,
        name: cat.name,
        description: cat.description,
        status: cat.status,
        totalQuestions: questionCountMap[normalizedName] || 0,
      };
    });
  } catch (error) {
    console.error("Gagal mengambil data dimensi:", error);
    return [];
  }
}

// 2. Ambil Kategori Dimensi yang Berstatus ACTIVE
export async function getActiveCategories() {
  try {
    const categories = await prisma.dimensionCategory.findMany({
      where: { status: "ACTIVE" },
      orderBy: { name: "asc" },
    });
    return categories;
  } catch (error) {
    console.error("Gagal mengambil kategori aktif:", error);
    return [];
  }
}

// 3. Ambil Detail Dimensi Beserta Seluruh Soal Terkait
export async function getCategoryDetailWithQuestions(id: string) {
  try {
    const category = await prisma.dimensionCategory.findUnique({
      where: { id },
    });

    if (!category) return null;

    // Ambil pertanyaan dengan pencocokan case-insensitive
    const relatedQuestions = await prisma.question.findMany({
      where: {
        dimension: {
          equals: category.name.trim(),
          mode: "insensitive",
        },
      },
      include: {
        options: {
          orderBy: { label: "asc" },
        },
      },
      orderBy: { code: "asc" },
    });

    return {
      ...category,
      totalQuestions: relatedQuestions.length,
      questions: relatedQuestions,
    };
  } catch (error) {
    console.error("Gagal mengambil detail dimensi:", error);
    return null;
  }
}

// 4. Tambah Dimensi Baru
export async function createCategory(data: { name: string; description?: string; status?: QuestionStatus }) {
  try {
    const count = await prisma.dimensionCategory.count();
    const code = `DMS${(count + 1).toString().padStart(3, "0")}`;

    const newCategory = await prisma.dimensionCategory.create({
      data: {
        code,
        name: data.name.trim(),
        description: data.description?.trim() || null,
        status: data.status || "ACTIVE",
      },
    });

    revalidatePath("/admin/parameter");
    return { success: true, data: newCategory };
  } catch (error) {
    console.error("Create Category Error:", error);
    return { success: false, message: "Gagal membuat dimensi baru." };
  }
}

// 5. Update Dimensi
export async function updateCategory(id: string, data: { name: string; description?: string; status?: QuestionStatus }) {
  try {
    const oldCategory = await prisma.dimensionCategory.findUnique({ where: { id } });

    const updated = await prisma.dimensionCategory.update({
      where: { id },
      data: {
        name: data.name.trim(),
        description: data.description?.trim() || null,
        status: data.status || "ACTIVE",
      },
    });

    if (oldCategory && oldCategory.name !== data.name.trim()) {
      await prisma.question.updateMany({
        where: { dimension: oldCategory.name },
        data: { dimension: data.name.trim() },
      });
    }

    revalidatePath("/admin/parameter");
    revalidatePath(`/admin/parameter/detail/${id}`);
    revalidatePath("/admin/soal");
    return { success: true, data: updated };
  } catch (error) {
    console.error("Update Category Error:", error);
    return { success: false, message: "Gagal memperbarui dimensi." };
  }
}

// 6. Hapus Dimensi (Dengan Validasi Relasi Soal)
export async function deleteCategory(id: string) {
  try {
    const category = await prisma.dimensionCategory.findUnique({
      where: { id },
    });

    if (!category) {
      return { success: false, message: "Kategori dimensi tidak ditemukan." };
    }

    // Cek apakah masih ada soal yang menggunakan dimensi ini
    const relatedQuestionsCount = await prisma.question.count({
      where: {
        dimension: {
          equals: category.name.trim(),
          mode: "insensitive",
        },
      },
    });

    if (relatedQuestionsCount > 0) {
      return {
        success: false,
        message: `Tidak dapat menghapus dimensi "${category.name}" karena masih terhubung dengan ${relatedQuestionsCount} soal. Hapus atau pindahkan soal terkait terlebih dahulu.`,
      };
    }

    await prisma.dimensionCategory.delete({
      where: { id },
    });

    revalidatePath("/admin/parameter");
    return { success: true, message: "Dimensi berhasil dihapus." };
  } catch (error) {
    console.error("Delete Category Error:", error);
    return { success: false, message: "Gagal menghapus dimensi." };
  }
}
