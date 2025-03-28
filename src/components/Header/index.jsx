"use client";

import Link from "next/link";
import Image from "next/image";
import { useAdmin } from "@/context/AdminContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function Header() {
  const { isAdmin, logout } = useAdmin();

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black bg-opacity-50 backdrop-blur-md transition-all duration-300 ease-in-out hover:bg-opacity-70">
      <div className="flex justify-between items-center p-4 max-w-7xl mx-auto">
        {/* 로고 */}
        <div>
          <Link href="/">
            <Image
              src="/synergy-white.png"
              width={140}
              height={60}
              alt="logo"
              className="transition-transform duration-300 hover:scale-105"
            />
          </Link>
        </div>

        {/* 네비게이션 */}
        <nav className="flex items-center gap-6 font-semibold text-base text-white">
          <Link
            href="/ceo-message"
            className="relative after:block after:h-0.5 after:bg-white after:scale-x-0 after:transition-transform after:duration-300 after:ease-in-out hover:after:scale-x-100"
          >
            CEO 인사말
          </Link>
          <Link
            href="/gallery"
            className="relative after:block after:h-0.5 after:bg-white after:scale-x-0 after:transition-transform after:duration-300 after:ease-in-out hover:after:scale-x-100"
          >
            갤러리
          </Link>
          <Link
            href="/events"
            className="relative after:block after:h-0.5 after:bg-white after:scale-x-0 after:transition-transform after:duration-300 after:ease-in-out hover:after:scale-x-100"
          >
            행사
          </Link>
          <Link
            href="/contact"
            className="relative after:block after:h-0.5 after:bg-white after:scale-x-0 after:transition-transform after:duration-300 after:ease-in-out hover:after:scale-x-100"
          >
            문의하기
          </Link>
          {isAdmin && (
            <div className="flex items-center gap-2">
              <span className="text-green-400">관리자</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="text-white hover:text-red-400"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
