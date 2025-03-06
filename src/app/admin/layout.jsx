'use client';

import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const ADMIN_PASSWORD = 'admin123'; // 관리자 비밀번호 (임시 설정)

export default function AdminLayout({ children }) {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast.success('로그인 성공!', { position: 'top-center' });
    } else {
      toast.error('패스워드가 틀렸습니다.', { position: 'top-center' });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className='w-full h-screen flex items-center justify-center bg-gray-100'>
        <div className='bg-white p-6 rounded-lg shadow-md text-center'>
          <h2 className='text-2xl font-bold mb-4'>관리자 로그인</h2>
          <input
            type='password'
            placeholder='비밀번호 입력'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='border p-2 rounded w-full mb-4'
          />
          <button
            onClick={handleLogin}
            className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full'
          >
            로그인
          </button>
        </div>
        <ToastContainer autoClose={2000} hideProgressBar closeOnClick pauseOnHover />
      </div>
    );
  }

  return (
    <div className='w-full min-h-screen bg-gray-100 p-6'>
      <h1 className='text-3xl font-bold text-gray-900 mb-6'>관리자 페이지</h1>
      {children}
      <ToastContainer autoClose={2000} hideProgressBar closeOnClick pauseOnHover />
    </div>
  );
}
