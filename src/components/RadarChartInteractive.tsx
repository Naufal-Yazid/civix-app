"use client";

import React, { useState } from "react";

interface DimensionPoint {
  name: string;
  x: number;
  y: number;
  align: "left" | "right" | "center"; // Penentu posisi teks (kiri, kanan, atau tengah)
}

// 10 Titik Dimensi di Ujung Paling Luar (Full Radar Chart Polygon)
const dimensions: DimensionPoint[] = [
  { name: "Civic Competence", x: 100, y: 20, align: "center" },
  { name: "Professionalisme Reflektif", x: 147, y: 35, align: "left" },
  { name: "Identitas Pedagogik", x: 176, y: 76, align: "left" },
  { name: "Professional Agency", x: 176, y: 124, align: "left" },
  { name: "Civic Disposition", x: 147, y: 165, align: "left" },
  { name: "Digital Citizenship Pedagogy", x: 100, y: 180, align: "center" },
  { name: "Civic Skills", x: 53, y: 165, align: "right" },
  { name: "Community of Practice", x: 24, y: 124, align: "right" },
  { name: "Komitmen Demokratis", x: 24, y: 76, align: "right" },
  { name: "Penguasaan Materi", x: 53, y: 35, align: "right" },
];

export default function RadarChartInteractive() {
  const [activeDim, setActiveDim] = useState<DimensionPoint | null>(null);

  // String polygon mentok ke semua titik terluar
  const outerPolygonPoints = dimensions.map((d) => `${d.x},${d.y}`).join(" ");

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="relative w-full max-w-[380px] aspect-square flex items-center justify-center">
        {/* SVG Radar Chart */}
        <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
          {/* 1. Radar Grid Lines (Concentric Polygons) */}
          <polygon points="100,20 147,35 176,76 176,124 147,165 100,180 53,165 24,124 24,76 53,35" fill="none" stroke="#E2E8F0" strokeWidth="1" />
          <polygon points="100,40 135,51 157,82 157,118 135,149 100,160 65,149 43,118 43,82 65,51" fill="none" stroke="#E2E8F0" strokeWidth="1" />
          <polygon points="100,60 123,68 138,88 138,112 123,132 100,140 77,132 62,112 62,88 77,68" fill="none" stroke="#E2E8F0" strokeWidth="1" />
          <polygon points="100,80 112,84 120,94 120,106 112,116 100,120 88,116 80,106 80,94 88,84" fill="none" stroke="#E2E8F0" strokeWidth="1" />

          {/* 2. Radar Radial Axes */}
          {dimensions.map((dim, i) => (
            <line key={i} x1="100" y1="100" x2={dim.x} y2={dim.y} stroke="#E2E8F0" strokeWidth="1" />
          ))}

          {/* 3. Full Data Shape Fill (Mentok ke Ujung) */}
          <polygon points={outerPolygonPoints} fill="#006A61" fillOpacity="0.25" stroke="#006A61" strokeWidth="2.5" className="transition-all duration-300" />

          {/* 4. Interactive Dots & Tooltip Samping */}
          {dimensions.map((dim, idx) => {
            const isHovered = activeDim?.name === dim.name;

            // Perhitungan Offset Posisi Teks Tooltip Samping
            let textX = dim.x;
            let textY = dim.y + 4;
            let textAnchor: "start" | "middle" | "end" = "middle";

            if (dim.align === "left") {
              textX = dim.x + 10;
              textAnchor = "start";
            } else if (dim.align === "right") {
              textX = dim.x - 10;
              textAnchor = "end";
            } else if (dim.y < 100) {
              textY = dim.y - 8; // Titik paling atas
            } else {
              textY = dim.y + 16; // Titik paling bawah
            }

            return (
              <g key={idx} className="cursor-pointer">
                {/* Invisible Hitbox untuk kemudahan hover */}
                <circle cx={dim.x} cy={dim.y} r="12" fill="transparent" onMouseEnter={() => setActiveDim(dim)} onMouseLeave={() => setActiveDim(null)} />

                {/* Visual Circle Dot */}
                <circle
                  cx={dim.x}
                  cy={dim.y}
                  r={isHovered ? "5.5" : "3.5"}
                  fill={isHovered ? "#002045" : "#006A61"}
                  stroke="#ffffff"
                  strokeWidth={isHovered ? "2" : "1"}
                  className="transition-all duration-200"
                  onMouseEnter={() => setActiveDim(dim)}
                  onMouseLeave={() => setActiveDim(null)}
                />

                {/* Teks Dimensi Samping (Hanya Tampil Saat Hover) */}
                {isHovered && (
                  <text x={textX} y={textY} textAnchor={textAnchor} fill="#002045" fontSize="8" fontWeight="500" className="animate-in fade-in zoom-in-95 duration-150 pointer-events-none drop-shadow-xs">
                    {dim.name}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <span className="text-base font-bold text-[#002045] mt-2">Visualisasi Kompetensi</span>
    </div>
  );
}
