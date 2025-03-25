"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { useAdmin } from "@/context/AdminContext";
import { ADMIN_PASSWORD } from "@/constants/auth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Footer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [password, setPassword] = useState("");
  const { login } = useAdmin();
  const { toast } = useToast();

  const handleAdminLogin = () => {
    if (password === ADMIN_PASSWORD) {
      login();
      toast({
        title: "관리자 로그인 성공",
        description: "관리자로 로그인되었습니다.",
        variant: "default",
      });
      setPassword("");
      setIsDialogOpen(false);
    } else {
      toast({
        title: "로그인 실패",
        description: "비밀번호가 일치하지 않습니다.",
        variant: "destructive",
      });
    }
  };

  return (
    <footer className="p-4" style={{ background: "var(--gray-2)" }}>
      <div direction="column" className="container mx-auto text-center">
        <div className="mb-4 w-full">
          {/* <Link href="/term-of-service" className="mr-4"> */}
          {/*   이용약관 */}
          {/* </Link> */}
          {/* <Link href="/privacy-policy" className="mr-4"> */}
          {/*   개인정보처리방침 */}
          {/* </Link> */}
          <Link href="/contact" className="mr-4">
            고객센터
          </Link>
          <button onClick={() => setIsOpen(!isOpen)}>
            <div className="flex items-center">
              <span>사업자 정보</span>
              {isOpen ? (
                <ChevronUpIcon width="1rem" height="1rem" />
              ) : (
                <ChevronDownIcon width="1rem" height="1rem" />
              )}
            </div>
          </button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button className="ml-4">관리자</button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>관리자 로그인</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <Input
                  type="password"
                  placeholder="관리자 비밀번호를 입력하세요"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAdminLogin()}
                />
                <Button onClick={handleAdminLogin}>로그인</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {isOpen && (
          <div
            className="rounded-lg p-4 text-left mx-auto w-full max-w-lg"
            style={{ backgroundColor: "var(--gray-6)" }}
          >
            <p>대표이사: 김윤성</p>
            <p>전화: 010 - 8494 - 8906 (대표전화)</p>
            <p>사업자등록번호: 688-86-02869</p>
            <p>주소: 서울특별시 송파구 위례서로 252(유원플러스 송파 203호) </p>
            <p>이메일: 90yoonkim@gmail.com</p>
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;
