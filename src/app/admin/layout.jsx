"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/context/AdminContext";

export default function AdminLayout({ children }) {
  const { isAdmin } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    // 관리자가 아닌 경우 홈으로 리다이렉트
    if (!isAdmin) {
      router.push("/");
    }
  }, [isAdmin, router]);

  // 로딩 중 또는 접근 제한 상태일 때
  if (!isAdmin) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold mb-4">접근 제한</h2>
          <p className="text-gray-600 mb-4">관리자만 접근할 수 있는 페이지입니다.</p>
        </div>
      </div>
    );
  }

  return <div className="w-full min-h-screen bg-gray-100">{children}</div>;
}
