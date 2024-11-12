"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";

const Footer = () => {
  const [isOpen, setIsOpen] = useState(false);

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
          <Link href="/updates" className="mr-4">
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
        </div>

        {isOpen && (
          <div
            className="rounded-lg p-4 text-left mx-auto w-full max-w-lg"
            style={{ backgroundColor: "var(--gray-6)" }}
          >
            <p>대표이사: 홍길동</p>
            <p>전화: 02 - 1234 - 5678 (대표전화)</p>
            <p>사업자등록번호: 855-96-01265</p>
            <p>주소: 서울 특별시 강남 테헤란로 123, 시너지그룹 빌딩 10층</p>
            <p>이메일: test@naver.com</p>
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;
