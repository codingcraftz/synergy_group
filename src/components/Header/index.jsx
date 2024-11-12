"use client";

import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="flex justify-between items-center p-6">
      <div>
        <Link className="text-2xl font-bold" href="/">
          <Image src="/synergy_logo.png" width={200} height={200} alt="logo" />
        </Link>
      </div>
      <nav className="flex gap-4">
        <Link href="/ceo-message">CEO 인사말</Link>
        <Link href="/contact">문의하기</Link>
      </nav>
    </header>
  );
}
