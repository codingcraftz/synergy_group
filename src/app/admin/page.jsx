'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Inquiries from './Inquiries';

const tabs = [
  { id: 'inquiries', label: '문의사항', component: <Inquiries /> },
  // 다른 탭도 추가 가능
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('inquiries');

  return (
    <div className='w-full min-h-screen bg-gray-100 p-6'>
      <h1 className='text-3xl font-bold text-gray-900 mb-6'>관리자 페이지</h1>

      {/* 탭 네비게이션 */}
      <div className='flex border-b border-gray-300 mb-6'>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 text-lg font-semibold border-b-2 transition-all duration-300 ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
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
