"use client";

import Link from "next/link";
import Image from "next/image";
import { useAdmin } from "@/context/AdminContext";
import { Button } from "@/components/ui/button";
import { LogOut, ChevronDown } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { isAdmin, logout } = useAdmin();
  const [companyOpen, setCompanyOpen] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);

  // 드롭다운 열기/닫기 지연 타이머 관리
  const [companyTimer, setCompanyTimer] = useState(null);
  const [mediaTimer, setMediaTimer] = useState(null);

  // 회사소개 드롭다운 관련 핸들러
  const handleCompanyMouseEnter = () => {
    if (companyTimer) clearTimeout(companyTimer);
    setCompanyOpen(true);
  };

  const handleCompanyMouseLeave = () => {
    const timer = setTimeout(() => setCompanyOpen(false), 300);
    setCompanyTimer(timer);
  };

  // 미디어 드롭다운 관련 핸들러
  const handleMediaMouseEnter = () => {
    if (mediaTimer) clearTimeout(mediaTimer);
    setMediaOpen(true);
  };

  const handleMediaMouseLeave = () => {
    const timer = setTimeout(() => setMediaOpen(false), 300);
    setMediaTimer(timer);
  };

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
          {/* 회사 소개 드롭다운 */}
          <div
            className="relative"
            onMouseEnter={handleCompanyMouseEnter}
            onMouseLeave={handleCompanyMouseLeave}
          >
            <DropdownMenu open={companyOpen} onOpenChange={setCompanyOpen}>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 relative after:block after:h-0.5 after:bg-white after:scale-x-0 after:transition-transform after:duration-300 after:ease-in-out hover:after:scale-x-100 focus:outline-none">
                  회사소개
                  <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="bg-gray-900 text-white border-gray-800 min-w-[160px]"
                onMouseEnter={handleCompanyMouseEnter}
                onMouseLeave={handleCompanyMouseLeave}
              >
                <DropdownMenuItem className="hover:bg-blue-700 focus:bg-blue-700 text-white hover:text-white focus:text-white">
                  <Link href="/ceo-message" className="w-full">
                    CEO 메세지
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-blue-700 focus:bg-blue-700 text-white hover:text-white focus:text-white">
                  <Link href="/branches" className="w-full">
                    지점 안내
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* 미디어 드롭다운 */}
          <div
            className="relative"
            onMouseEnter={handleMediaMouseEnter}
            onMouseLeave={handleMediaMouseLeave}
          >
            <DropdownMenu open={mediaOpen} onOpenChange={setMediaOpen}>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 relative after:block after:h-0.5 after:bg-white after:scale-x-0 after:transition-transform after:duration-300 after:ease-in-out hover:after:scale-x-100 focus:outline-none">
                  미디어
                  <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="bg-gray-900 text-white border-gray-800 min-w-[160px]"
                onMouseEnter={handleMediaMouseEnter}
                onMouseLeave={handleMediaMouseLeave}
              >
                <DropdownMenuItem className="hover:bg-blue-700 focus:bg-blue-700 text-white hover:text-white focus:text-white">
                  <Link href="/gallery" className="w-full">
                    사진 아카이브
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-blue-700 focus:bg-blue-700 text-white hover:text-white focus:text-white">
                  <Link href="/videos" className="w-full">
                    영상 아카이브
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Link
            href="/events"
            className="relative after:block after:h-0.5 after:bg-white after:scale-x-0 after:transition-transform after:duration-300 after:ease-in-out hover:after:scale-x-100"
          >
            일정 안내
          </Link>

          <Link
            href="/careers"
            className="relative after:block after:h-0.5 after:bg-white after:scale-x-0 after:transition-transform after:duration-300 after:ease-in-out hover:after:scale-x-100"
          >
            인재채용
          </Link>

          <Link
            href="/contact"
            className="relative after:block after:h-0.5 after:bg-white after:scale-x-0 after:transition-transform after:duration-300 after:ease-in-out hover:after:scale-x-100"
          >
            문의하기
          </Link>

          {isAdmin && (
            <div className="flex items-center gap-2">
              <Link
                href="/admin"
                className="text-green-400 hover:text-green-300 flex items-center gap-1"
              >
                <span>관리자</span>
              </Link>
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
