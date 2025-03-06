'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaHandshake, FaChartLine, FaUsers } from 'react-icons/fa';

export default function HomePage() {
  return (
    <div className='w-full min-h-screen bg-gray-100'>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className='relative w-full h-[80vh] flex items-center justify-center text-center bg-cover bg-center'
        style={{ backgroundImage: "url('/main-background.jpg')" }}
      >
        {/* 오버레이 */}
        <div className='absolute inset-0 bg-black bg-opacity-50' />

        {/* 메인 콘텐츠 */}
        <div className='relative z-10 px-6 max-w-4xl'>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className='text-5xl md:text-7xl font-bold text-white tracking-tight mt-4'
          >
            SYNERGY GROUP
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.9, duration: 1 }}
            className='w-full h-1 bg-white mx-auto mt-6'
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className='text-2xl md:text-3xl text-white font-semibold mt-6'
          >
            &ldquo;비즈니스 성공을 함께 만들어가는 최고의 파트너&rdquo;
          </motion.p>
        </div>
      </motion.div>

      {/* Services Section */}
      <section className='py-20 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className='text-4xl font-bold text-gray-900 text-center mb-8'
          >
            시너지그룹이 제공하는 핵심 가치
          </motion.h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mt-16'>
            {[
              {
                icon: <FaHandshake className='w-16 h-16 text-blue-400' />,
                title: '신뢰와 협력',
                description: '파트너십을 기반으로 성장하는 기업을 돕습니다.',
              },
              {
                icon: <FaChartLine className='w-16 h-16 text-blue-400' />,
                title: '비즈니스 성장',
                description: '법률 및 금융 컨설팅을 통해 기업의 경쟁력을 강화합니다.',
              },
              {
                icon: <FaUsers className='w-16 h-16 text-blue-400' />,
                title: '맞춤형 솔루션',
                description: '고객 맞춤형 솔루션을 제공하여 비즈니스 성공을 지원합니다.',
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className='bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1'
              >
                <div className='flex flex-col items-center text-center space-y-6'>
                  <div className='p-4 bg-[#f0f9ff] rounded-full'>{service.icon}</div>
                  <h3 className='text-2xl font-bold text-gray-900'>{service.title}</h3>
                  <p className='text-gray-600 text-lg leading-relaxed'>{service.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
