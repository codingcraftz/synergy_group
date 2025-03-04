"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaHandshake, FaChartLine, FaUsers } from 'react-icons/fa';

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
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900">리더님을 위한 세가지 약속</h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FaHandshake className="w-12 h-12 text-blue-400" />,
                title: "편의성 제공",
                description: "법무, 세무, 노무, 행정 등 다양한 분야에서 사업의 효율을 높여주는 믿음직한 파트너가 되겠습니다."
              },
              {
                icon: <FaChartLine className="w-12 h-12 text-blue-400" />,
                title: "든든한 지원",
                description: "사업 자금 지원부터 법률 문제 해결까지 원스톱 솔루션을 제공합니다."
              },
              {
                icon: <FaUsers className="w-12 h-12 text-blue-400" />,
                title: "미래를 위한 동반자",
                description: "현 상태를 진단하고, 미래 성장을 위한 맞춤 솔루션을 제시하여 성공을 함께 이루어 나갑니다."
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  {service.icon}
                  <h3 className="text-xl font-semibold text-gray-900">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


    </div>
  );
};

export default HomePage;
