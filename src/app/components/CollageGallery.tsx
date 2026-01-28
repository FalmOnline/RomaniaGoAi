"use client";

import React from "react";
import Image from "next/image";

interface Item {
  title: string;
  imageUrl: string;
}

export default function CollageGallery({
  title,
  items,
}: {
  title: string;
  items: Item[];
}) {
  return (
    <div className="my-10">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="flex overflow-x-auto gap-6 pb-4 hide-scrollbar">
        {items.map((item, idx) => (
          <div
            key={idx}
            className={`relative min-w-[180px] sm:min-w-[200px] md:min-w-[240px] flex-shrink-0 bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300
              ${idx % 2 === 0 ? "rotate-[-1deg]" : "rotate-[1deg]"}`}
            style={{
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.05)",
            }}
          >
            <div className="relative w-full h-40 sm:h-48">
              <Image
                src={item.imageUrl}
                alt={item.title}
                layout="fill"
                objectFit="cover"
                className="rounded-t-xl"
              />
            </div>
            <div className="p-3 text-sm text-gray-700 font-medium">
              {item.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
