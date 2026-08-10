"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "Apakah saya perlu login untuk assessment?",
    answer: "Tidak perlu. Anda dapat langsung memulai diagnostik mandiri tanpa harus membuat akun atau melakukan proses login.",
  },
  {
    question: "Apakah data pribadi saya aman?",
    answer: "Sangat aman. Sistem kami dirancang secara anonim dan tidak menyimpan informasi sensitif pribadi pengajar.",
  },
  {
    question: "Apakah hasil tes ini resmi?",
    answer: "Hasil asesmen ini dikembangkan berdasarkan kerangka akademik RIPP-PPKn sebagai alat refleksi kritis dan pemetaan diagnostik kompetensi mandiri.",
  },
  {
    question: "Berapa lama validitas hasil assessment ini?",
    answer: "Hasil assessment ini ideal digunakan sebagai pemicu refleksi berkala (setiap 6–12 bulan) untuk memantau perkembangan profesionalitas Anda.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-white py-20 px-6 lg:px-12 border-t border-gray-100">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-[32px] font-bold text-[#002045] text-center mb-12">Frequently Asked Questions</h2>

        <div className="divide-y divide-gray-200">
          {faqs.map((faq, index) => (
            <div key={index} className="py-5">
              <button onClick={() => toggleFaq(index)} className="w-full flex justify-between items-center text-left focus:outline-none group">
                <span className="text-base font-semibold text-[#002045] group-hover:text-[#006A61] transition-colors">{faq.question}</span>
                <ChevronDown className={`w-5 h-5 text-[#64748B] transition-transform duration-200 ${openIndex === index ? "rotate-180 text-[#006A61]" : ""}`} />
              </button>
              {openIndex === index && <p className="mt-3 text-sm text-[#64748B] leading-relaxed">{faq.answer}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
