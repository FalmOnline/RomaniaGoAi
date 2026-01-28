// src/components/AnimatedGallery.tsx
"use client";

import { useEffect, useRef } from "react";

export default function AnimatedGallery({ data }: { data: string[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    let animationFrame: number;
    const scrollSpeed = 0.5;

    const autoScroll = () => {
      if (el) {
        el.scrollLeft += scrollSpeed;
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth) {
          el.scrollLeft = 0;
        }
      }
      animationFrame = requestAnimationFrame(autoScroll);
    };

    animationFrame = requestAnimationFrame(autoScroll);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div
      ref={scrollRef}
      className="flex overflow-x-auto gap-4 py-2 scrollbar-hide"
      style={{ scrollBehavior: "smooth" }}
    >
      {data.map((title, idx) => (
        <div
          key={idx}
          className="min-w-[200px] bg-white rounded-xl shadow-md p-4 flex-shrink-0"
        >
          <div className="w-full h-32 bg-gray-200 rounded-md mb-2" />
          <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        </div>
      ))}
    </div>
  );
}
