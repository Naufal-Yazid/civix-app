"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { QuestionStatus } from "@prisma/client";

export interface CategoryInput {
  name: string;
  description?: string;
  status: QuestionStatus;
}

// 1. Generate Kode Unik Dimensi (DMS001, DMS002, dst)
async function generateCategoryCode(): Promise<string> {
  const count = await prisma.dimensionCategory.count();
  const nextNumber = count + 1;
  return `DMS${nextNumber.toString().padStart(3, "0")}`;
}

// 2. Tambah Kategori Kompetensi
export async function createCategory(data: CategoryInput) {
  const code = await generateCategoryCode();
  const category = await prisma.dimensionCategory.create({
    data: {
      code,
      name: data.name,
      description: data.description,
      status: data.status,
    },
  });
  revalidatePath("/admin/parameter");
  return category;
}

// 3. Update Kategori Kompetensi
export async function updateCategory(id: string, data: CategoryInput) {
  const category = await prisma.dimensionCategory.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      status: data.status,
    },
  });
  revalidatePath("/admin/parameter");
  return category;
}

// 4. Hapus Kategori Kompetensi
export async function deleteCategory(id: string) {
  await prisma.dimensionCategory.delete({
    where: { id },
  });
  revalidatePath("/admin/parameter");
}

// Tambahkan di src/app/admin/parameter/actions.ts

export async function getActiveCategories() {
  const categories = await prisma.dimensionCategory.findMany({
    where: { status: "ACTIVE" },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
  return categories;
}
