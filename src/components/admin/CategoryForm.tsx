"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { QuestionStatus } from "@prisma/client";
import { createCategory, updateCategory, CategoryInput } from "@/app/admin/parameter/actions";

interface CategoryFormProps {
  initialData?: {
    id: string;
    code: string;
    name: string;
    description?: string | null;
    status: QuestionStatus;
  };
  isEdit?: boolean;
  isViewOnly?: boolean;
}

export default function CategoryForm({ initialData, isEdit = false, isViewOnly = false }: CategoryFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [status, setStatus] = useState<QuestionStatus>(initialData?.status || "ACTIVE");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isViewOnly) return;

    if (!name) {
      alert("Harap isi Nama Dimensi.");
      return;
    }

    setLoading(true);

    const payload: CategoryInput = {
      name,
      description,
      status,
    };

    try {
      if (isEdit && initialData?.id) {
        await updateCategory(initialData.id, payload);
      } else {
        await createCategory(payload);
      }
      router.push("/admin/parameter");
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan kategori kompetensi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Form Utama (Kiri) */}
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs space-y-5">
          <h2 className="font-bold text-lg text-[#002045]">Dimensi</h2>

          {/* Input ID (Readonly / Auto Generated) */}
          <div>
            <label className="block text-xs font-semibold text-[#002045] mb-2">ID</label>
            <input type="text" readOnly value={initialData?.code || "DMS001"} className="w-full p-3 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-400 font-medium cursor-not-allowed focus:outline-none" />
          </div>

          {/* Input Nama Dimensi */}
          <div>
            <label className="block text-xs font-semibold text-[#002045] mb-2">Nama Dimensi</label>
            <input
              type="text"
              disabled={isViewOnly}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama Dimensi"
              className="w-full p-3 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#006A61] placeholder:text-gray-300 text-[#1E1E1E] disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Input Deskripsi */}
          <div>
            <label className="block text-xs font-semibold text-[#002045] mb-2">Deskripsi</label>
            <textarea
              rows={4}
              disabled={isViewOnly}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Penjelasan Dimensi..."
              className="w-full p-3.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#006A61] resize-none placeholder:text-gray-300 text-[#1E1E1E] disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 pt-2">
          {!isViewOnly && (
            <button type="submit" disabled={loading} className="px-6 py-3 bg-[#002045] text-white text-xs font-semibold rounded-xl hover:bg-[#001833] transition-colors disabled:opacity-50">
              {isEdit ? "Simpan Perubahan" : "Simpan"}
            </button>
          )}

          <button type="button" onClick={() => router.push("/admin/parameter")} className="px-6 py-3 border border-gray-200 text-[#002045] text-xs font-semibold rounded-xl hover:bg-gray-50 transition-colors">
            {isViewOnly ? "Kembali" : "Batal"}
          </button>
        </div>
      </div>

      {/* Sidebar Status (Kanan) */}
      <div className="lg:col-span-4">
        <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-[#002045]">Status</h3>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-semibold text-[#1E1E1E]">{status === "ACTIVE" ? "Active" : "Inactive"}</span>

            <button
              type="button"
              disabled={isViewOnly}
              onClick={() => !isViewOnly && setStatus(status === "ACTIVE" ? "INACTIVE" : "ACTIVE")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${status === "ACTIVE" ? "bg-[#006A61]" : "bg-gray-300"} ${isViewOnly ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${status === "ACTIVE" ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
