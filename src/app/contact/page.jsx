"use client";

import React from "react";

export default function Contact() {
	return (
		<div className="w-full min-h-screen flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 text-gray-900">
			{/* 헤더 섹션 */}
			<div className="w-full max-w-3xl flex flex-col items-center text-center mb-12">
				<h1 className="text-3xl font-bold text-gray-800">문의하기</h1>
				<p className="text-lg sm:text-xl text-gray-700 mt-4">
					궁금하신 점이 있으시면 아래 폼을 통해 언제든지 문의해 주세요. 빠른
					시일 내에 답변드리겠습니다.
				</p>
			</div>

			{/* 연락처 정보 섹션 */}
			<div className="w-full max-w-3xl space-y-4 mb-12 text-lg leading-relaxed text-gray-800 text-center">
				<p>
					<span className="font-semibold">전화번호:</span> 010-8494-8906
				</p>
				<p>
					<span className="font-semibold">이메일:</span> 90yoonkim@gmail.com
				</p>
				<p>
					<span className="font-semibold">주소:</span> 서울특별시 송파구
					위례서로 252, 우원플러스 송파 203호
				</p>
			</div>

			<div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
				<form className="space-y-6">
					<div>
						<label
							htmlFor="name"
							className="block text-sm font-medium text-gray-700"
						>
							이름
						</label>
						<input
							type="text"
							id="name"
							name="name"
							className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
							required
						/>
					</div>

					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-700"
						>
							이메일
						</label>
						<input
							type="email"
							id="email"
							name="email"
							className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
							required
						/>
					</div>

					<div>
						<label
							htmlFor="message"
							className="block text-sm font-medium text-gray-700"
						>
							메시지
						</label>
						<textarea
							id="message"
							name="message"
							rows="4"
							className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
							required
						></textarea>
					</div>

					<div className="flex justify-center">
						<button
							type="submit"
							className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md shadow-md focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						>
							보내기
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
