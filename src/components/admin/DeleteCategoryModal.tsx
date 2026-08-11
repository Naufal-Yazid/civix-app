"use client";

import React, { useState } from "react";
import { Trash2, AlertTriangle } from "lucide-react";
import { deleteCategory } from "@/app/admin/parameter/actions";

interface DeleteCategoryModalProps {
  id: string;
  name: string;
}

export default function DeleteCategoryModal({ id, name }: DeleteCategoryModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteCategory(id);
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus kategori.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors" title="Hapus">
        <Trash2 className="w-4 h-4 text-red-500/80" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-150 border border-gray-100">
            {/* Warning Icon Container */}
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-500 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            {/* Modal Title & Message */}
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-[#002045]">Hapus Kategori Kompetensi?</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Apakah anda yakin ingin menghapus data kategori kompetensi <span className="font-bold text-[#002045]">&quot;{name}&quot;</span>? Dengan menghapus data ini akan mempengaruhi pertanyaan yang sudah dibuat.
              </p>
            </div>

            {/* Modal Action Buttons */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button type="button" disabled={loading} onClick={() => setIsOpen(false)} className="w-full py-2.5 px-4 border border-gray-200 rounded-xl text-xs font-semibold text-[#002045] hover:bg-gray-50 transition-colors">
                Batal
              </button>

              <button type="button" disabled={loading} onClick={handleDelete} className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs disabled:opacity-50">
                {loading ? "Deleting..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
