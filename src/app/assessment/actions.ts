"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface UserBiodata {
  userName: string;
  institution: string;
  gradeLevel: string;
  city: string;
}

export interface AnswerSubmission {
  questionId: string;
  questionCode: string;
  questionText: string;
  selectedAnswer: string;
  score: number;
}

export interface OptionItem {
  label?: string;
  text: string;
  score: number;
}

export interface QuestionData {
  id: string;
  code: string;
  questionText: string;
  dimension: string;
  type: string;
  scaleMin?: number | null;
  scaleMax?: number | null;
  scaleMinLabel?: string | null;
  scaleMaxLabel?: string | null;
  options: OptionItem[];
}

// 1. Fetch Seluruh Soal Aktif dari Bank Soal Admin
export async function getActiveQuestions(): Promise<QuestionData[]> {
  const questions = await prisma.question.findMany({
    where: { status: "ACTIVE" },
    orderBy: { createdAt: "asc" },
  });

  return questions.map((q, idx) => {
    let optionsArr: OptionItem[] = [];

    // Ambil raw options secara type-safe dari q
    const rawOptions = (q as unknown as { options?: unknown }).options;

    if (rawOptions) {
      if (typeof rawOptions === "string") {
        try {
          optionsArr = JSON.parse(rawOptions) as OptionItem[];
        } catch {
          optionsArr = [];
        }
      } else if (Array.isArray(rawOptions)) {
        optionsArr = rawOptions as OptionItem[];
      }
    }

    return {
      id: q.id,
      code: q.code || `QUE${(idx + 1).toString().padStart(3, "0")}`,
      questionText: q.questionText,
      dimension: q.dimension,
      type: q.type,
      scaleMin: q.scaleMin,
      scaleMax: q.scaleMax,
      scaleMinLabel: q.scaleMinLabel,
      scaleMaxLabel: q.scaleMaxLabel,
      options: optionsArr,
    };
  });
}

// 2. Generate User ID Code Unik (USR001, USR002, dst)
async function generateUserCode(): Promise<string> {
  const count = await prisma.assessmentResult.count();
  const nextNum = count + 1;
  return `USR${nextNum.toString().padStart(3, "0")}`;
}

// 3. Simpan Hasil Assessment ke Database
export async function submitAssessment(biodata: UserBiodata, answers: AnswerSubmission[], durationText: string) {
  const userIdCode = await generateUserCode();

  // Hitung Skor Komposit (Rata-Rata)
  const totalScore = answers.reduce((acc, curr) => acc + curr.score, 0);
  const compositeScore = answers.length > 0 ? Math.round(totalScore / answers.length) : 0;

  // Tentukan Level berdasarkan Skor Komposit dari database
  const levels = await prisma.competencyLevel.findMany({
    where: { status: "ACTIVE" },
    orderBy: { minScore: "asc" },
  });

  let matchedLevel = "Level 1";
  const found = levels.find((lvl) => compositeScore >= lvl.minScore && compositeScore <= lvl.maxScore);
  if (found) {
    matchedLevel = found.name;
  }

  // Simpan ke Prisma AssessmentResult & AssessmentAnswer
  const result = await prisma.assessmentResult.create({
    data: {
      userIdCode,
      userName: biodata.userName,
      institution: biodata.institution,
      gradeLevel: biodata.gradeLevel,
      city: biodata.city,
      duration: durationText,
      badgeLevel: matchedLevel,
      compositeScore,
      answers: {
        create: answers.map((a) => ({
          questionCode: a.questionCode,
          questionText: a.questionText,
          selectedAnswer: a.selectedAnswer,
          score: a.score,
        })),
      },
    },
  });

  revalidatePath("/admin/pengguna");
  return result;
}
