"use client";

import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { supabase } from "@/utils/supabase";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaBuilding, FaUser, FaIdCard } from "react-icons/fa";
import Link from "next/link";

export default function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      // 필드명을 스네이크 케이스로 변환
      const formattedData = {
        company_name: data.companyName,
        representative: data.representative,
        phone: data.phone,
        email: data.email,
        title: data.title,
        message: data.message,
      };

      const { error } = await supabase.from("contact_inquiries").insert([formattedData]);

      if (error) throw error;

      alert("문의가 성공적으로 접수되었습니다.");
      reset();
    } catch (error) {
      console.error("Error:", error);
      alert("문의 접수 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-gray-50 text-gray-900">
      {/* Hero Section - 모바일 최적화 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="w-full h-[50vh] sm:h-[60vh] md:h-[70vh] relative overflow-hidden"
      >
        <Image
          src="/contact.jpg"
          fill
          style={{ objectFit: "cover" }}
          alt="contact"
          className="brightness-75"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-center space-y-3 sm:space-y-4 px-4 sm:px-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="w-24 sm:w-32 h-1 bg-[#90ccef] mx-auto rounded-full"
            />
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white">Contact Us</h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-200">
              언제든지 문의해 주세요. 최선을 다해 도와드리겠습니다.
            </p>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="w-24 sm:w-32 h-1 bg-[#90ccef] mx-auto rounded-full"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* 회사 정보 및 문의 폼 섹션 - 모바일 최적화 */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="w-full max-w-4xl mx-auto py-8 sm:py-12 md:py-16 px-4 sm:px-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div className="space-y-6 sm:space-y-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-8">회사 정보</h2>
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <FaBuilding className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm sm:text-base">기업명</p>
                  <p className="text-gray-600 text-sm sm:text-base">주식회사 시너지그룹</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 sm:space-x-4">
                <FaUser className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm sm:text-base">대표이사</p>
                  <p className="text-gray-600 text-sm sm:text-base">김윤성</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 sm:space-x-4">
                <FaIdCard className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm sm:text-base">사업자등록번호</p>
                  <p className="text-gray-600 text-sm sm:text-base">688-86-02869</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 sm:space-x-4">
                <FaPhone className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm sm:text-base">전화번호</p>
                  <p className="text-gray-600 text-sm sm:text-base">010-8494-8906</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 sm:space-x-4">
                <FaEnvelope className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm sm:text-base">이메일</p>
                  <p className="text-gray-600 text-sm sm:text-base">90yoonkim@gmail.com</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 sm:space-x-4">
                <FaMapMarkerAlt className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm sm:text-base">주소</p>
                  <p className="text-gray-600 text-sm sm:text-base">
                    서울특별시 송파구 위례서로 252
                    <br />
                    (유원플러스 송파 203호)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 문의 폼 섹션 - 모바일 최적화 */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="bg-white rounded-xl shadow-lg sm:shadow-xl p-5 sm:p-8"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">문의하기</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  기업명 <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("companyName", { required: "기업명을 입력해주세요" })}
                  className="mt-1 block w-full px-3 sm:px-4 py-2 sm:py-3 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="기업명을 입력해주세요"
                />
                {errors.companyName && (
                  <p className="mt-1 text-xs sm:text-sm text-red-600">
                    {errors.companyName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  담당자명 <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("representative", { required: "담당자명을 입력해주세요" })}
                  className="mt-1 block w-full px-3 sm:px-4 py-2 sm:py-3 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="담당자명을 입력해주세요"
                />
                {errors.representative && (
                  <p className="mt-1 text-xs sm:text-sm text-red-600">
                    {errors.representative.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  연락처 <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("phone", {
                    required: "연락처를 입력해주세요",
                    pattern: {
                      value: /^[0-9]{2,3}-?[0-9]{3,4}-?[0-9]{4}$/,
                      message: "올바른 전화번호 형식이 아닙니다",
                    },
                  })}
                  className="mt-1 block w-full px-3 sm:px-4 py-2 sm:py-3 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="연락처를 입력해주세요"
                />
                {errors.phone && (
                  <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  이메일 <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("email", {
                    required: "이메일을 입력해주세요",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "올바른 이메일 형식이 아닙니다",
                    },
                  })}
                  className="mt-1 block w-full px-3 sm:px-4 py-2 sm:py-3 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="이메일을 입력해주세요"
                />
                {errors.email && (
                  <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  제목 <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("title", { required: "제목을 입력해주세요" })}
                  className="mt-1 block w-full px-3 sm:px-4 py-2 sm:py-3 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="제목을 입력해주세요"
                />
                {errors.title && (
                  <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  문의사항 <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("message", { required: "문의사항을 입력해주세요" })}
                  rows="3"
                  className="mt-1 block w-full px-3 sm:px-4 py-2 sm:py-3 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="문의사항을 입력해주세요"
                />
                {errors.message && (
                  <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm sm:text-base py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "처리중..." : "문의하기"}
              </button>
            </form>
          </motion.div>
        </div>
      </motion.div>

      {/* 모바일에서 더 나은 사용자 경험을 위한 맨 위로 스크롤 버튼 */}
      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg z-50 sm:hidden"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.1 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </motion.button>
    </div>
  );
}
