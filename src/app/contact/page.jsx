"use client";

import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { supabase } from "@/utils/supabase";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaBuilding, FaUser, FaIdCard } from 'react-icons/fa';

export default function Contact() {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting }
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
				message: data.message
			};

			const { error } = await supabase
				.from('contact_inquiries')
				.insert([formattedData]);
			
			if (error) throw error;
			
			alert('문의가 성공적으로 접수되었습니다.');
			reset();
		} catch (error) {
			console.error('Error:', error);
			alert('문의 접수 중 오류가 발생했습니다.');
		}
	};

	return (
		<div className="w-full min-h-screen flex flex-col items-center bg-gray-50 text-gray-900">
			{/* Hero Section with Image */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 1 }}
				className="w-full h-[60vh] relative overflow-hidden"
			>
				<Image
					src="/contact.jpg"
					fill
					style={{ objectFit: 'cover' }}
					alt="contact"
					className="brightness-75"
				/>
				<div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
					<motion.div
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.5, duration: 0.8 }}
						className="text-center space-y-4"
					>
						<h1 className="text-4xl md:text-6xl font-bold text-white">
							Contact Us
						</h1>
						<p className="text-xl text-gray-200">
							언제든지 문의해 주세요. 최선을 다해 도와드리겠습니다.
						</p>
					</motion.div>
				</div>
			</motion.div>

			{/* 회사 정보 섹션 */}
			<motion.div
				initial={{ y: 20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.8, duration: 0.8 }}
				className="w-full max-w-4xl mx-auto py-16 px-4"
			>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-12">
					<div className="space-y-8">
						<h2 className="text-3xl font-bold text-gray-900 mb-8">회사 정보</h2>
						<div className="space-y-6">
							<div className="flex items-center space-x-4">
								<FaBuilding className="w-6 h-6 text-blue-400" />
								<div>
									<p className="font-semibold">기업명</p>
									<p className="text-gray-600">주식회사 시너지그룹</p>
								</div>
							</div>
							<div className="flex items-center space-x-4">
								<FaUser className="w-6 h-6 text-blue-400" />
								<div>
									<p className="font-semibold">대표이사</p>
									<p className="text-gray-600">김윤성</p>
								</div>
							</div>
							<div className="flex items-center space-x-4">
								<FaIdCard className="w-6 h-6 text-blue-400" />
								<div>
									<p className="font-semibold">사업자등록번호</p>
									<p className="text-gray-600">688-86-02869</p>
								</div>
							</div>
							<div className="flex items-center space-x-4">
								<FaPhone className="w-6 h-6 text-blue-400" />
								<div>
									<p className="font-semibold">전화번호</p>
									<p className="text-gray-600">010-8494-8906</p>
								</div>
							</div>
							<div className="flex items-center space-x-4">
								<FaEnvelope className="w-6 h-6 text-blue-400" />
								<div>
									<p className="font-semibold">이메일</p>
									<p className="text-gray-600">90yoonkim@gmail.com</p>
								</div>
							</div>
							<div className="flex items-center space-x-4">
								<FaMapMarkerAlt className="w-6 h-6 text-blue-400" />
								<div>
									<p className="font-semibold">주소</p>
									<p className="text-gray-600">서울특별시 송파구 위례서로 252<br />(유원플러스 송파 203호)</p>
								</div>
							</div>
						</div>
					</div>

					{/* 문의 폼 섹션 */}
					<motion.div
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 1, duration: 0.8 }}
						className="bg-white rounded-xl shadow-xl p-8"
					>
						<h2 className="text-2xl font-bold text-gray-900 mb-6">문의하기</h2>
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
							<div>
								<label className="block text-sm font-medium text-gray-700">
									기업명 <span className="text-red-500">*</span>
								</label>
								<input
									{...register("companyName", { required: "기업명을 입력해주세요" })}
									className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
									placeholder="기업명을 입력해주세요"
								/>
								{errors.companyName && (
									<p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>
								)}
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700">
									담당자명 <span className="text-red-500">*</span>
								</label>
								<input
									{...register("representative", { required: "담당자명을 입력해주세요" })}
									className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
									placeholder="담당자명을 입력해주세요"
								/>
								{errors.representative && (
									<p className="mt-1 text-sm text-red-600">{errors.representative.message}</p>
								)}
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700">
									연락처 <span className="text-red-500">*</span>
								</label>
								<input
									{...register("phone", { 
										required: "연락처를 입력해주세요",
										pattern: {
											value: /^[0-9]{2,3}-?[0-9]{3,4}-?[0-9]{4}$/,
											message: "올바른 전화번호 형식이 아닙니다"
										}
									})}
									className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
									placeholder="연락처를 입력해주세요"
								/>
								{errors.phone && (
									<p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
								)}
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700">
									이메일 <span className="text-red-500">*</span>
								</label>
								<input
									{...register("email", { 
										required: "이메일을 입력해주세요",
										pattern: {
											value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
											message: "올바른 이메일 형식이 아닙니다"
										}
									})}
									className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
									placeholder="이메일을 입력해주세요"
								/>
								{errors.email && (
									<p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
								)}
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700">
									제목 <span className="text-red-500">*</span>
								</label>
								<input
									{...register("title", { required: "제목을 입력해주세요" })}
									className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
									placeholder="제목을 입력해주세요"
								/>
								{errors.title && (
									<p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
								)}
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700">
									문의사항 <span className="text-red-500">*</span>
								</label>
								<textarea
									{...register("message", { required: "문의사항을 입력해주세요" })}
									rows="4"
									className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
									placeholder="문의사항을 입력해주세요"
								/>
								{errors.message && (
									<p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
								)}
							</div>

							<button
								type="submit"
								disabled={isSubmitting}
								className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isSubmitting ? "처리중..." : "문의하기"}
							</button>
						</form>
					</motion.div>
				</div>
			</motion.div>
		</div>
	);
}
