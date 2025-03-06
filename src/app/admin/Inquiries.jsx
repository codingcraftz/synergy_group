'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import Pagination from '@/components/Pagination';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function Inquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [expandedInquiry, setExpandedInquiry] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;

  const fetchInquiries = useCallback(async () => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage - 1;
    const { data, count, error } = await supabase
      .from('contact_inquiries')
      .select('*', { count: 'exact' })
      .order('is_read', { ascending: true }) // 안읽은 문의를 위로 정렬
      .order('created_at', { ascending: false })
      .range(start, end);

    if (error) {
      console.error('Error fetching inquiries:', error);
    } else {
      setInquiries(data);
      setTotalPages(Math.ceil(count / itemsPerPage));
    }
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  async function markAsRead(id) {
    await supabase.from('contact_inquiries').update({ is_read: true }).eq('id', id);
    fetchInquiries();
  }

  async function deleteInquiry(id) {
    await supabase.from('contact_inquiries').delete().eq('id', id);
    fetchInquiries();
  }

  const toggleInquiry = (id) => {
    setExpandedInquiry(expandedInquiry === id ? null : id);
  };

  return (
    <div className='bg-white shadow-md rounded-lg p-6'>
      <h2 className='text-2xl font-bold mb-4'>문의사항</h2>
      {inquiries.length === 0 ? (
        <p className='text-gray-600'>문의 사항이 없습니다.</p>
      ) : (
        <div className='space-y-4'>
          {inquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              className={`border rounded-lg p-4 cursor-pointer transition duration-150 ease-in-out hover:shadow-lg ${
                expandedInquiry === inquiry.id ? 'bg-gray-100' : 'bg-white'
              }`}
              onClick={() => toggleInquiry(inquiry.id)}
            >
              <div className='flex justify-between items-center'>
                <div>
                  <h3 className='text-lg font-semibold'>{inquiry.title}</h3>
                  <p className='text-sm text-gray-600'>
                    {inquiry.company_name} | {inquiry.representative}
                  </p>
                  <p className='text-sm text-gray-500'>
                    📧 {inquiry.email} | 📞 {inquiry.phone}
                  </p>
                </div>
                <span
                  className={`text-sm px-3 py-1 rounded-full ${
                    inquiry.is_read ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                  }`}
                >
                  {inquiry.is_read ? '읽음' : '안읽음'}
                </span>
              </div>
              <p className='text-sm text-gray-500 mt-1'>{new Date(inquiry.created_at).toLocaleDateString()}</p>
              {expandedInquiry === inquiry.id && (
                <div className='mt-4 flex flex-col'>
                  <p className='text-gray-700'>{inquiry.message}</p>
                  <div className='mt-2 flex space-x-2 ml-auto'>
                    {!inquiry.is_read && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(inquiry.id);
                        }}
                        className='bg-blue-400 text-white px-2 py-1 rounded hover:bg-blue-600 transition'
                      >
                        읽음 처리
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteInquiry(inquiry.id);
                      }}
                      className='bg-red-400 text-white px-2 py-1 rounded hover:bg-red-600 transition'
                    >
                      삭제
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
}
