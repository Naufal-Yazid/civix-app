import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import QuestionForm from "@/components/admin/QuestionForm";
import { getActiveCategories } from "@/app/admin/parameter/actions";

interface EditSoalPageProps {
  params: Promise<{ id: string }>;
}

interface QuestionOption {
  label?: string;
  text: string;
  score: number;
}

export default async function EditSoalPage({ params }: EditSoalPageProps) {
  const { id } = await params;

  // Menambahkan include options agar data relasi pilihan ganda/checkbox termuat
  const [question, categories] = await Promise.all([
    prisma.question.findUnique({
      where: { id },
      include: {
        options: true,
      },
    }),
    getActiveCategories(),
  ]);

  if (!question) {
    notFound();
  }

  const dimensionsList = categories.map((category) => category.name);

  // Format array opsi dari relasi tabel Option Prisma
  const formattedOptions: QuestionOption[] = Array.isArray(question.options)
    ? question.options.map((opt) => ({
        label: opt.label ?? undefined,
        text: opt.text,
        score: opt.score ?? 0,
      }))
    : [];

  const initialData = {
    ...question,
    options: formattedOptions,
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs text-[#64748B]">
          <Link href="/admin/soal" className="font-medium hover:text-[#002045] hover:underline transition-colors">
            Manajemen Soal
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="font-semibold text-[#002045]">Edit Pertanyaan</span>
        </nav>

        <div className="pt-1">
          <h1 className="text-2xl font-semibold text-[#002045]">Edit Pertanyaan</h1>
        </div>
      </div>

      <QuestionForm initialData={initialData} dimensionsList={dimensionsList} isEdit={true} />
    </div>
  );
}
