'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaQuoteLeft, FaQuoteRight } from 'react-icons/fa';

export default function CeoMessage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <div className='w-full min-h-screen bg-gradient-to-b from-gray-50 to-white'>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className='w-full h-[70vh] relative overflow-hidden'
      >
        <Image src='/ceo-background.jpg' fill style={{ objectFit: 'cover' }} alt='contact' className='brightness-75' />
        {/* 애니메이션 배경 */}
        <div className='absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center'>
          <motion.div
            initial={{ opacity: 0.3 }}
            animate={{
              opacity: [0.3, 0.5, 0.3],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]'
          />
          <motion.div
            initial={{ opacity: 0.1 }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: 1,
            }}
            className='absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.2),transparent_50%)]'
          />
        </div>

        {/* 콘텐츠 */}
        <div className='absolute inset-0 flex flex-col items-center justify-center text-center px-4'>
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className='space-y-6 max-w-3xl relative z-10'
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className='w-24 h-1 bg-[#90ccef] mx-auto rounded-full'
            />
            <h1 className='text-4xl md:text-6xl font-bold text-white mb-4'>CEO 인사말</h1>
            <p className='text-xl md:text-2xl text-blue-100'>리더님의 꿈을 실현시켜 드리는 시너지그룹</p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className='text-lg text-blue-200 mt-4 font-light'
            >
              &ldquo;신뢰할 수 있는 파트너십으로 함께 성장하는 미래를 만들어갑니다&rdquo;
            </motion.p>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.5 }}
              className='w-24 h-1 bg-[#90ccef] mx-auto rounded-full'
            />
          </motion.div>
        </div>

        {/* 장식용 패턴 */}
        <div className='absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.3)_0%,transparent_100%)]' />
      </motion.div>

      {/* Content Section */}
      <div className='max-w-4xl mx-auto px-4 py-16 md:py-24'>
        {/* CEO Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className='flex flex-col md:flex-row items-center gap-8 mb-16'
        >
          <div className='relative w-48 h-48 md:w-64 md:h-64'>
            <Image
              src='/ceo_image.jpg'
              alt='CEO Portrait'
              fill
              style={{ objectFit: 'cover', objectPosition: 'center top' }}
              className='rounded-2xl shadow-2xl'
            />
          </div>
          <div className='text-center md:text-left'>
            <h2 className='text-3xl font-bold text-gray-900 mb-2'>김윤성</h2>
            <p className='text-xl text-gray-600 mb-4'>시너지그룹 대표이사</p>
            <p className='text-gray-500'>&ldquo;리더님의 꿈을 이루는 삶을 위해 최선을 다하겠습니다&rdquo;</p>
          </div>
        </motion.div>

        {/* Message Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className='relative'
        >
          <FaQuoteLeft className='absolute -top-6 -left-6 text-4xl text-blue-200 opacity-50' />
          <div className='space-y-6 text-lg leading-relaxed text-gray-700 px-8'>
            <motion.p {...fadeInUp}>
              시너지그룹 주식회사(이하 &apos;시너지그룹&apos;이라고만 합니다)는 창립 이래 &ldquo;리더님의 꿈을 이루는
              삶&rdquo;을 위해 복합 금융 서비스를 제공해오며 많은 리더 님들과 함께 성장해왔습니다.
            </motion.p>

            <motion.div {...fadeInUp} className='bg-blue-50 p-6 rounded-xl my-8'>
              <h3 className='text-xl font-semibold text-blue-900 mb-4'>첫 번째 미션</h3>
              <p className='text-gray-700'>
                저희의 첫 번째 미션은 여러분 사업의 불편함을 대신 해소시켜 드리는 것입니다. 각자 사업에서는 최고의
                전문가인 여러분들조차도 법무, 세무, 노무, 행정 등 모든 영역을 완벽하게 커버하기란 매우 어려운 일이므로,
                믿을만한 파트너가 사업에만 오롯이 집중할 수 있도록 이를 대신해 줄 수 있다면 사업의 효율성은 크게 늘어날
                것입니다.
              </p>
            </motion.div>

            <motion.div {...fadeInUp} className='bg-blue-50 p-6 rounded-xl my-8'>
              <h3 className='text-xl font-semibold text-blue-900 mb-4'>두 번째 미션</h3>
              <p className='text-gray-700'>
                두 번째 미션은 리더님 사업이 어려움에 직면했을 때 의지할 만한 언덕이 되어드리는 것입니다. 사업상
                발생하는 미수금의 해결부터 운전자금, 시설자금, 정책자금, 금융권 대출, 소상공인 대출, 법인 대출까지
                신용정보회사는 물론 각종 대부까지 원스톱으로 연결하며 빠르고 만족할 만한 솔루션을 제공해 드립니다.
              </p>
            </motion.div>

            <motion.div {...fadeInUp} className='bg-blue-50 p-6 rounded-xl my-8'>
              <h3 className='text-xl font-semibold text-blue-900 mb-4'>세 번째 미션</h3>
              <p className='text-gray-700'>
                마지막 미션은 리더님의 사업이 앞으로 백년대계를 세울 수 있도록 현 상태를 정확히 진단하고 향후 더 발전할
                수 있는 모델을 만들어 드리는 데 기여하는 것입니다. 기본적인 광고&홍보&마케팅부터 종합적인 경영컨설팅까지
                리더님의 신념과 가치, 그리고 철학이 더욱 세상에 빛날 수 있도록 세심하게 지원해 드립니다.
              </p>
            </motion.div>

            <motion.p {...fadeInUp}>
              시너지그룹은 과거에 쌓아온 역량과 경험을 지렛대로 삼아, 현 위치에 안주하지 않고 새로운 트렌드와 정책에 늘
              모든 감각을 기민하게 세우며 언제나 리더님과 함께 성장하는 평생 사업 파트너가 되겠습니다.
            </motion.p>

            <motion.p {...fadeInUp}>
              리더님의 가정과 사업에 늘 평화와 번영이 함께하길 기원하며 어제보다 더 나은 오늘, 오늘보다 더 나은 내일을
              만들어가기 위해 최선을 다하겠습니다.
            </motion.p>
          </div>
          <FaQuoteRight className='absolute -bottom-6 -right-6 text-4xl text-blue-200 opacity-50' />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className='text-right mt-12'
        >
          <p className='text-xl font-semibold text-gray-900'>감사합니다.</p>
          <p className='text-gray-600'>시너지그룹 대표이사 김윤성</p>
        </motion.div>
      </div>
    </div>
  );
}
