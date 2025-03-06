'use client';

import React from 'react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const handlePageClick = (page) => {
    if (page !== currentPage) onPageChange(page);
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          className={`px-4 py-2 mx-1 rounded-lg border ${
            i === currentPage ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
          }`}
          onClick={() => handlePageClick(i)}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className='flex justify-center items-center space-x-2 mt-4'>
      <button
        className='px-4 py-2 rounded-lg border bg-white text-gray-700 border-gray-300 hover:bg-gray-100 disabled:opacity-50'
        onClick={handlePrev}
        disabled={currentPage === 1}
      >
        이전
      </button>
      {renderPageNumbers()}
      <button
        className='px-4 py-2 rounded-lg border bg-white text-gray-700 border-gray-300 hover:bg-gray-100 disabled:opacity-50'
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        다음
      </button>
    </div>
  );
}
