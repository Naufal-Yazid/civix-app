"use client";

import React, { useState } from "react";
import { Trash2, AlertTriangle, X } from "lucide-react";
import { deleteCategory } from "@/app/admin/parameter/actions";

interface DeleteCategoryModalProps {
  id: string;
  name: string;
  totalQuestions?: number;
}

export default function DeleteCategoryModal({ id, name, totalQuestions = 0 }: DeleteCategoryModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const hasRelatedQuestions = totalQuestions > 0;

  const handleDelete = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await deleteCategory(id);
      if (res.success) {
        setIsOpen(false);
      } else {
        setErrorMessage(res.message || "Gagal menghapus data kategori.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Terjadi kesalahan saat menghapus data.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button di Baris Tabel */}
      <button
        type="button"
        onClick={() => {
          setErrorMessage("");
          setIsOpen(true);
        }}
        className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-500 transition-colors"
        title="Hapus Dimensi"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {/* Modal Popup */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="relative bg-white rounded-[20px] max-w-[460px] w-full shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Tombol Close 'X' di Pojok Kanan Atas */}
            <button type="button" onClick={() => setIsOpen(false)} className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10" aria-label="Tutup modal">
              <X className="w-5 h-5" />
            </button>

            {hasRelatedQuestions ? (
              /* =========================================================
                 1. MODAL PERINGATAN (Jika Masih Terhubung dengan Soal)
                 ========================================================= */
              <div>
                <div className="p-8 pt-10 text-center flex flex-col items-center space-y-4">
                  {/* Ikon Warning Kuning */}
                  <div className="w-14 h-14 rounded-full bg-[#FEF6E7] flex items-center justify-center text-[#E5A000]">
                    <AlertTriangle className="w-7 h-7 stroke-[2.2]" />
                  </div>

                  {/* Judul & Deskripsi */}
                  <div className="space-y-2">
                    <h3 className="text-[20px] font-bold text-[#002045]">Dimensi Tidak Dapat Dihapus</h3>
                    <p className="text-[14px] text-[#475569] leading-relaxed">
                      Kategori dimensi <strong className="text-[#002045] font-bold">{name}</strong> saat ini masih terhubung dengan <strong className="text-[#002045] font-bold">{totalQuestions} soal</strong> yang telah dibuat.
                    </p>
                  </div>

                  {/* Kotak Petunjuk Kuning */}
                  <div className="w-full bg-[#FEF8ED] border border-[#FDE6BA] rounded-[12px] p-4 text-[13px] text-[#8C5D07] text-center leading-relaxed">
                    untuk menghapus dimensi ini, silahkan hapus atau ubah dimensi kategor pada soal soal terkait di menu <strong className="text-[#6D4500] font-bold">Manajemen Soal</strong> terlebih dahulu
                  </div>
                </div>

                {/* Footer Action Button */}
                <div className="border-t border-gray-100 p-6 pt-4">
                  <button type="button" onClick={() => setIsOpen(false)} className="w-full py-3 px-6 bg-[#002045] hover:bg-[#001833] text-white text-[15px] font-semibold rounded-[10px] transition-colors shadow-xs">
                    Mengerti
                  </button>
                </div>
              </div>
            ) : (
              /* =========================================================
                 2. MODAL KONFIRMASI HAPUS (Jika 0 Soal Terkait)
                 ========================================================= */
              <div>
                <div className="p-8 pt-10 text-center flex flex-col items-center space-y-4">
                  {/* Ikon Danger Merah */}
                  <div className="w-14 h-14 rounded-full bg-[#FEE2E2]/60 flex items-center justify-center text-[#DC2626]">
                    <AlertTriangle className="w-7 h-7 stroke-[2.2]" />
                  </div>

                  {/* Judul & Deskripsi */}
                  <div className="space-y-2">
                    <h3 className="text-[20px] font-bold text-[#002045]">Hapus Kategori Kompetensi?</h3>
                    <p className="text-[14px] text-[#475569] leading-relaxed">
                      Apakah anda yakin ingin menghapus data kategori kompetensi <strong className="text-[#002045] font-bold">{name}?</strong> Dengan Menghapus data ini akan mempengaruhi pertanyaan yang sudah dibuat.
                    </p>
                  </div>

                  {errorMessage && <div className="w-full p-3 bg-rose-50 border border-rose-200 rounded-[10px] text-xs text-rose-600 text-center">{errorMessage}</div>}
                </div>

                {/* Footer Action Buttons */}
                <div className="border-t border-gray-100 p-6 pt-4 flex items-center gap-3">
                  <button type="button" disabled={isLoading} onClick={() => setIsOpen(false)} className="flex-1 py-3 border border-gray-300 hover:bg-gray-50 text-[#002045] text-[15px] font-semibold rounded-[10px] transition-colors">
                    Batal
                  </button>
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={handleDelete}
                    className="flex-1 py-3 bg-[#B91C1C] hover:bg-[#991B1B] text-white text-[15px] font-semibold rounded-[10px] inline-flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    {isLoading ? "Menghapus..." : "Hapus"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
