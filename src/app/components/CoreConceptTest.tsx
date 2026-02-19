"use client";

import Image from "next/image";

export default function TabButton({ children, onSelect }) {


  return (
    <li>
      <button onClick={onSelect}>{children}</button>
    </li>
  );
}
