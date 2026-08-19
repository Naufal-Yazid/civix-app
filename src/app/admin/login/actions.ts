"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function loginAdmin(formData: FormData) {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  try {
    const admin = await prisma.admin.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    });

    if (!admin) {
      return { success: false, message: "Email atau kata sandi yang Anda masukkan salah." };
    }

    // Cek kecocokan password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return { success: false, message: "Email atau kata sandi yang Anda masukkan salah." };
    }

    // Set cookie session
    const cookieStore = await cookies();
    cookieStore.set("admin_session", admin.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "Terjadi kesalahan pada sistem." };
  }
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/admin/login");
}
