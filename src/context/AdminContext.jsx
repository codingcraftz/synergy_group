"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);

  // 컴포넌트 마운트 시 로컬 스토리지에서 관리자 상태 불러오기
  useEffect(() => {
    const storedAdminState = localStorage.getItem("isAdmin");
    if (storedAdminState === "true") {
      setIsAdmin(true);
    }
  }, []);

  const login = () => {
    setIsAdmin(true);
    localStorage.setItem("isAdmin", "true");
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.setItem("isAdmin", "false");
  };

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout }}>{children}</AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
