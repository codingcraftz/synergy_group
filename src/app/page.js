"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const HomePage = () => {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 bg-gray-50 text-gray-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="w-full h-32 sm:h-48 md:h-64 flex items-center justify-center mb-2"
      >
        <Image src="/synergy_logo.png" width={400} height={400} alt="logo" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center text-center mt-4 px-4"
      >
        <p size="6 sm:7 md:8" weight="bold" className="text-center mb-4">
          리더님의 꿈을 실현시켜 드리는 시너지그룹
        </p>
        <p size="3 sm:4" className="text-center mb-8">
          전문 금융 및 법률 서비스로 사업의 가치를 높여드립니다.
        </p>
      </motion.div>

      <div className="w-full max-w-xl md:max-w-3xl lg:max-w-4xl py-8 sm:py-16">
        <p className="text-center font-semibold mb-6 sm:mb-8 text-xl">
          리더님을 위한 세가지 약속
        </p>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-4"
        >
          {[
            {
              title: "편의성 제공",
              description:
                "법무, 세무, 노무, 행정 등 다양한 분야에서 사업의 효율을 높여주는 믿음직한 파트너가 되겠습니다.",
            },
            {
              title: "든든한 지원",
              description:
                "사업 자금 지원부터 법률 문제 해결까지 원스톱 솔루션을 제공합니다.",
            },
            {
              title: "미래를 위한 동반자",
              description:
                "현 상태를 진단하고, 미래 성장을 위한 맞춤 솔루션을 제시하여 성공을 함께 이루어 나갑니다.",
            },
          ].map((content, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="transform transition-transform duration-300"
            >
              <div
                className="p-4 sm:p-6 h-full rounded-lg shadow-lg hover:shadow-2xl transition-shadow flex flex-col justify-between"
                style={{
                  backgroundColor: "var(--slate-3)",
                  border: "2px solid var(--gray-2)",
                }}
              >
                <div className="mb-4">
                  <p className="font-semibold text-lg">{content.title}</p>
                </div>
                <p className="flex-1" size="2">
                  {content.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;
