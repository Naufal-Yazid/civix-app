"use client";

import React, { useState } from "react";
import { deleteQuestion } from "@/app/admin/soal/actions";
import { AlertTriangle, Trash2 } from "lucide-react";

export default function DeleteModalButton({ id, code }: { id: string; code: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    await deleteQuestion(id);
    setLoading(false);
    setIsOpen(false);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="p-1.5 hover:bg-gray-100 rounded-lg text-rose-500 hover:text-red-500">
        <Trash2 className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-gray-100 rounded-3xl p-8 max-w-md w-full text-center space-y-5 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#002045]">Hapus Pertanyaan?</h3>
              <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
                Apakah Anda yakin ingin menghapus pertanyaan <strong>{code}</strong> ini? Tindakan ini tidak dapat dibatalkan dan akan menghapus soal dari bank data assessment secara permanen.
              </p>
            </div>

            <div className="flex space-x-3 pt-2">
              <button onClick={() => setIsOpen(false)} className="flex-1 py-3 border border-gray-200 text-[#002045] text-xs font-semibold rounded-xl hover:bg-gray-50">
                Batal
              </button>
              <button disabled={loading} onClick={handleDelete} className="flex-1 py-3 bg-red-600 text-white text-xs font-semibold rounded-xl hover:bg-red-700 disabled:opacity-50">
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
