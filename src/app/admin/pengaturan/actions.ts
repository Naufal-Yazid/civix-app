"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

// Ambil data profil admin aktif
export async function getAdminProfile() {
  const cookieStore = await cookies();
  const sessionAdminId = cookieStore.get("admin_session")?.value;

  if (!sessionAdminId) return null;

  const admin = await prisma.admin.findUnique({
    where: { id: sessionAdminId },
    select: {
      id: true,
      name: true,
      email: true,
      updatedAt: true,
    },
  });

  return admin;
}

// Update Nama & Email Profil
export async function updateAdminProfile(formData: FormData) {
  const cookieStore = await cookies();
  const sessionAdminId = cookieStore.get("admin_session")?.value;

  if (!sessionAdminId) {
    return { success: false, message: "Sesi admin tidak valid. Silakan login kembali." };
  }

  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();

  if (!name || !email) {
    return { success: false, message: "Nama dan Email wajib diisi." };
  }

  try {
    // Cek apakah email sudah dipakai oleh akun admin lain
    const existing = await prisma.admin.findFirst({
      where: {
        email,
        NOT: { id: sessionAdminId },
      },
    });

    if (existing) {
      return { success: false, message: "Email ini sudah digunakan oleh akun lain." };
    }

    await prisma.admin.update({
      where: { id: sessionAdminId },
      data: { name, email },
    });

    revalidatePath("/admin/pengaturan");
    return { success: true, message: "Profil berhasil diperbarui!" };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, message: "Gagal memperbarui profil." };
  }
}

// Ubah Password Admin
export async function updateAdminPassword(formData: FormData) {
  const cookieStore = await cookies();
  const sessionAdminId = cookieStore.get("admin_session")?.value;

  if (!sessionAdminId) {
    return { success: false, message: "Sesi tidak valid." };
  }

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { success: false, message: "Semua kolom kata sandi wajib diisi." };
  }

  if (newPassword.length < 6) {
    return { success: false, message: "Kata sandi baru minimal 6 karakter." };
  }

  if (newPassword !== confirmPassword) {
    return { success: false, message: "Konfirmasi kata sandi baru tidak cocok." };
  }

  try {
    const admin = await prisma.admin.findUnique({
      where: { id: sessionAdminId },
    });

    if (!admin) {
      return { success: false, message: "Admin tidak ditemukan." };
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return { success: false, message: "Kata sandi saat ini salah." };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.admin.update({
      where: { id: sessionAdminId },
      data: { password: hashedPassword },
    });

    revalidatePath("/admin/pengaturan");
    return { success: true, message: "Kata sandi berhasil diubah!" };
  } catch (error) {
    console.error("Error updating password:", error);
    return { success: false, message: "Gagal mengubah kata sandi." };
  }
}
