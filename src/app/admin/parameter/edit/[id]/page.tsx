import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CategoryForm from "@/components/admin/CategoryForm";
import { ChevronRight } from "lucide-react";

interface EditCategoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = await params;
  const category = await prisma.dimensionCategory.findUnique({ where: { id } });

  if (!category) notFound();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <nav className="flex items-center space-x-2 text-xs text-[#64748B]">
          <Link href="/admin/parameter" className="hover:text-[#002045] hover:underline transition-colors font-medium">
            Parameter Assessment
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="font-semibold text-[#002045]">Edit Kategori Kompetensi</span>
        </nav>

        <div className="pt-1">
          <h1 className="text-2xl font-bold text-[#002045]">Edit Kategori Kompetensi</h1>
        </div>
      </div>

      <CategoryForm initialData={category} isEdit={true} />
    </div>
  );
}
