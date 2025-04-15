"use client";

import Link from "next/link";
import Image from "next/image";
import { useAdmin } from "@/context/AdminContext";
import { Button } from "@/components/ui/button";
import { LogOut, ChevronDown, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // 화면 크기 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

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

  // 모바일 메뉴 클릭 핸들러
  const handleMobileClick = (menu) => {
    if (menu === "company") {
      setCompanyOpen(!companyOpen);
      setMediaOpen(false);
    } else if (menu === "media") {
      setMediaOpen(!mediaOpen);
      setCompanyOpen(false);
    }
  };

  // 모바일 메뉴 링크 클릭 시 메뉴 닫기
  const handleMobileLinkClick = () => {
    setMobileMenuOpen(false);
    setCompanyOpen(false);
    setMediaOpen(false);
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

        {/* 모바일 햄버거 버튼 */}
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white p-2">
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* 데스크톱 네비게이션 */}
        <nav className="hidden md:flex items-center gap-6 font-semibold text-base text-white">
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

      {/* 모바일 메뉴 */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black bg-opacity-90 text-white">
          <div className="p-4 space-y-4">
            {/* 회사소개 아코디언 */}
            <div>
              <button
                onClick={() => handleMobileClick("company")}
                className="flex w-full justify-between items-center py-2 border-b border-gray-700"
              >
                <span>회사소개</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${companyOpen ? "rotate-180" : ""}`}
                />
              </button>
              {companyOpen && (
                <div className="ml-4 mt-2 space-y-2">
                  <Link href="/ceo-message" className="block py-2" onClick={handleMobileLinkClick}>
                    CEO 메세지
                  </Link>
                  <Link href="/branches" className="block py-2" onClick={handleMobileLinkClick}>
                    지점 안내
                  </Link>
                </div>
              )}
            </div>

            {/* 미디어 아코디언 */}
            <div>
              <button
                onClick={() => handleMobileClick("media")}
                className="flex w-full justify-between items-center py-2 border-b border-gray-700"
              >
                <span>미디어</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${mediaOpen ? "rotate-180" : ""}`}
                />
              </button>
              {mediaOpen && (
                <div className="ml-4 mt-2 space-y-2">
                  <Link href="/gallery" className="block py-2" onClick={handleMobileLinkClick}>
                    사진 아카이브
                  </Link>
                  <Link href="/videos" className="block py-2" onClick={handleMobileLinkClick}>
                    영상 아카이브
                  </Link>
                </div>
              )}
            </div>

            {/* 기타 메뉴 */}
            <Link
              href="/events"
              className="block py-2 border-b border-gray-700"
              onClick={handleMobileLinkClick}
            >
              일정 안내
            </Link>
            <Link
              href="/careers"
              className="block py-2 border-b border-gray-700"
              onClick={handleMobileLinkClick}
            >
              인재채용
            </Link>
            <Link
              href="/contact"
              className="block py-2 border-b border-gray-700"
              onClick={handleMobileLinkClick}
            >
              문의하기
            </Link>

            {/* 관리자 메뉴 */}
            {isAdmin && (
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <Link href="/admin" className="text-green-400" onClick={handleMobileLinkClick}>
                  관리자
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-white hover:text-red-400 p-1"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
