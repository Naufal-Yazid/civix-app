import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import LevelForm from "@/components/admin/LevelForm";
import { ChevronRight } from "lucide-react";

interface EditLevelPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditLevelPage({ params }: EditLevelPageProps) {
  const { id } = await params;
  const level = await prisma.competencyLevel.findUnique({ where: { id } });

  if (!level) notFound();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <nav className="flex items-center space-x-2 text-xs text-[#64748B]">
          <Link href="/admin/parameter?tab=level" className="hover:text-[#002045] hover:underline transition-colors font-medium">
            Parameter Assessment
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="font-semibold text-[#002045]">Edit Level Kompetensi</span>
        </nav>

        <div className="pt-1">
          <h1 className="text-2xl font-bold text-[#002045]">Edit Level Kompetensi</h1>
        </div>
      </div>

      <LevelForm initialData={level} isEdit={true} />
    </div>
  );
}
