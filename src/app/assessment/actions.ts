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
  id?: string;
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

export async function getActiveQuestions(): Promise<QuestionData[]> {
  try {
    const questions = await prisma.question.findMany({
      where: { status: "ACTIVE" },
      include: {
        options: {
          orderBy: { label: "asc" },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return questions.map((q, idx: number) => {
      const optionsArr: OptionItem[] = Array.isArray(q.options)
        ? q.options.map((opt) => ({
            id: opt.id,
            label: opt.label || "",
            text: opt.text,
            score: typeof opt.score === "number" ? opt.score : 0,
          }))
        : [];

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
  } catch (error) {
    console.error("Gagal mengambil data soal:", error);
    return [];
  }
}

async function generateUserCode(): Promise<string> {
  const count = await prisma.assessmentResult.count();
  const nextNum = count + 1;
  return `USR${nextNum.toString().padStart(3, "0")}`;
}

export async function submitAssessment(biodata: UserBiodata, demographics: Record<string, string>, answers: AnswerSubmission[], durationText: string) {
  const userIdCode = await generateUserCode();

  const totalScore = answers.reduce((acc, curr) => acc + curr.score, 0);
  const compositeScore = answers.length > 0 ? Math.round(totalScore / answers.length) : 0;

  const levels = await prisma.competencyLevel.findMany({
    where: { status: "ACTIVE" },
    orderBy: { minScore: "asc" },
  });

  let matchedLevel = "Level 1";
  const found = levels.find((lvl) => compositeScore >= lvl.minScore && compositeScore <= lvl.maxScore);
  if (found) {
    matchedLevel = found.name;
  }

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
      demographicAnswers: demographics,
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
