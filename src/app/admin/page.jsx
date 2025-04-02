"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import EventParticipants from "./EventParticipants";
import ContactInquiries from "./ContactInquiries";

const tabs = [
  { id: "participants", label: "참가자 관리", component: <EventParticipants /> },
  { id: "inquiries", label: "문의사항", component: <ContactInquiries /> },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("participants");

  return (
    <div className="w-full min-h-screen bg-gray-100 pt-20 p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">관리자 페이지</h1>

      {/* 탭 네비게이션 */}
      <div className="flex border-b border-gray-300 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 text-lg font-semibold border-b-2 transition-all duration-300 ${
              activeTab === tab.id
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 탭 컨텐츠 */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {tabs.find((tab) => tab.id === activeTab)?.component}
      </motion.div>
    </div>
  );
}
