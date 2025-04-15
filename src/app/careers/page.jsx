"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CreditCard,
  Clock,
  CalendarDays,
  Coffee,
  Dumbbell,
  Car,
  Gift,
  Plane,
  Briefcase,
  Database,
  GraduationCap,
  Send,
} from "lucide-react";

// 섹션 애니메이션 변수
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

// 카드 애니메이션 변수
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
    },
  }),
};

export default function CareersPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApply = () => {
    setIsSubmitting(true);
    // 실제 구현에서는 여기에 지원 처리 로직 추가
    setTimeout(() => {
      setIsSubmitting(false);
      alert("지원이 접수되었습니다. 담당자가 검토 후 연락드리겠습니다.");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 히어로 섹션 - 모바일에서 높이 조정 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="w-full h-[50vh] sm:h-[60vh] md:h-[70vh] relative overflow-hidden"
      >
        <Image
          src="/career_main.jpg"
          fill
          style={{ objectFit: "cover" }}
          alt="인재채용"
          className="brightness-75"
        />

        {/* 어두운 오버레이와 애니메이션 배경 */}
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0.3 }}
            animate={{
              opacity: [0.3, 0.5, 0.3],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"
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
              repeatType: "reverse",
              delay: 1,
            }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.2),transparent_50%)]"
          />
        </div>

        {/* 콘텐츠 - 모바일에서 여백 및 텍스트 크기 조정 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="space-y-4 sm:space-y-6 max-w-3xl relative z-10"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="w-16 sm:w-20 h-1 bg-[#90ccef] mx-auto rounded-full"
            />

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white"
            >
              인재채용
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-lg sm:text-xl text-blue-100"
            >
              시너지그룹과 함께 성장할 인재를 찾습니다
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="text-base sm:text-lg text-blue-200 font-light"
            >
              도전과 성장의 기회가 기다리고 있습니다
            </motion.p>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="w-16 sm:w-20 h-1 bg-[#90ccef] mx-auto rounded-full"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* 모집 분야 섹션 - 모바일 패딩 조정 */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-10 sm:py-12 md:py-16 bg-white"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">모집 분야</h2>
            <div className="w-12 sm:w-16 h-1 bg-blue-500 mx-auto rounded-full mb-4 sm:mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              시너지그룹에서 함께할 열정적인 인재를 모집합니다. 전문성과 열정을 가진 분들의 지원을
              기다립니다.
            </p>
          </div>

          <Card className="border-blue-100 shadow-md hover:shadow-lg transition-shadow duration-300 max-w-4xl mx-auto">
            <CardContent className="p-4 sm:p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center">
                <div className="w-full md:w-1/3 bg-blue-50 rounded-lg p-4 sm:p-6 text-center">
                  <h3 className="text-lg sm:text-xl font-bold text-blue-700 mb-2 sm:mb-3">
                    재무, 보험 컨설팅
                  </h3>
                  <p className="text-gray-700 text-sm sm:text-base">
                    고객 상담 및<br />
                    고객관리 지원
                  </p>
                </div>

                <div className="w-full md:w-2/3">
                  <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                    <li className="flex items-center gap-2 text-gray-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>성별무관</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>학력 제한 없음</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>나이 제한 없음</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>금융, 보험, 서비스 관련 경험자 우대</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>커뮤니케이션 능력이 뛰어난 분</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.section>

      {/* 급여 및 조건 섹션 - 모바일 패딩 및 카드 간격 조정 */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-10 sm:py-12 md:py-16 bg-gray-50"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">급여 및 조건</h2>
            <div className="w-12 sm:w-16 h-1 bg-blue-500 mx-auto rounded-full mb-4 sm:mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              시너지그룹은 구성원들의 노력에 합당한 보상과 안정적인 근무환경을 제공합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
            <motion.div
              custom={0}
              variants={cardVariants}
              className="bg-white rounded-xl shadow-md p-4 sm:p-6 text-center"
            >
              <div className="bg-blue-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 sm:mb-2">급여</h3>
              <p className="text-gray-600 text-sm sm:text-base">월 평균 급여(성과제)</p>
              <p className="text-blue-600 font-bold text-xl sm:text-2xl mt-1 sm:mt-2">500만원</p>
              <p className="text-gray-600 text-sm sm:text-base mt-1">+ 상여금 600%</p>
            </motion.div>

            <motion.div
              custom={1}
              variants={cardVariants}
              className="bg-white rounded-xl shadow-md p-4 sm:p-6 text-center"
            >
              <div className="bg-blue-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <CalendarDays className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 sm:mb-2">근무 일수</h3>
              <p className="text-gray-600 text-sm sm:text-base">주 5일 근무</p>
              <p className="text-blue-600 font-bold text-xl sm:text-2xl mt-1 sm:mt-2">월~금</p>
              <p className="text-gray-600 text-sm sm:text-base mt-1">주말 및 공휴일 휴무</p>
            </motion.div>

            <motion.div
              custom={2}
              variants={cardVariants}
              className="bg-white rounded-xl shadow-md p-4 sm:p-6 text-center"
            >
              <div className="bg-blue-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 sm:mb-2">근무 시간</h3>
              <p className="text-gray-600 text-sm sm:text-base">정규 영업시간</p>
              <p className="text-blue-600 font-bold text-xl sm:text-2xl mt-1 sm:mt-2">
                9:00 - 18:00
              </p>
              <p className="text-gray-600 text-sm sm:text-base mt-1">점심시간 포함</p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* 복리후생 섹션 - 모바일 그리드 및 카드 스타일 조정 */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-10 sm:py-12 md:py-16 bg-white"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">복리후생</h2>
            <div className="w-12 sm:w-16 h-1 bg-blue-500 mx-auto rounded-full mb-4 sm:mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              시너지그룹은 직원들의 삶의 질 향상과 업무 능률을 위한 다양한 복리후생 제도를 운영하고
              있습니다.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-w-5xl mx-auto">
            <motion.div
              custom={0}
              variants={cardVariants}
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 sm:p-4 md:p-6 text-center"
            >
              <div className="bg-blue-50 w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4">
                <Coffee className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                구내 라운지, 카페
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
                휴식과 소통을 위한 편안한 공간
              </p>
            </motion.div>

            <motion.div
              custom={1}
              variants={cardVariants}
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 sm:p-4 md:p-6 text-center"
            >
              <div className="bg-blue-50 w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4">
                <Dumbbell className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm sm:text-base">무료 헬스장</h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">임직원 건강 관리 지원</p>
            </motion.div>

            <motion.div
              custom={2}
              variants={cardVariants}
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 sm:p-4 md:p-6 text-center"
            >
              <div className="bg-blue-50 w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4">
                <Car className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm sm:text-base">넓은 주차공간</h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
                차량 이용 직원을 위한 편의
              </p>
            </motion.div>

            <motion.div
              custom={3}
              variants={cardVariants}
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 sm:p-4 md:p-6 text-center"
            >
              <div className="bg-blue-50 w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4">
                <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm sm:text-base">경조사비</h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">임직원 경조사 지원</p>
            </motion.div>

            <motion.div
              custom={4}
              variants={cardVariants}
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 sm:p-4 md:p-6 text-center"
            >
              <div className="bg-blue-50 w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4">
                <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm sm:text-base">인센티브</h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">성과에 따른 추가 보상</p>
            </motion.div>

            <motion.div
              custom={5}
              variants={cardVariants}
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 sm:p-4 md:p-6 text-center"
            >
              <div className="bg-blue-50 w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4">
                <Plane className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm sm:text-base">해외여행</h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
                우수 실적자 해외여행 지원
              </p>
            </motion.div>

            <motion.div
              custom={6}
              variants={cardVariants}
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 sm:p-4 md:p-6 text-center col-span-2"
            >
              <div className="bg-blue-50 w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4">
                <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm sm:text-base">업무지원</h3>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-2 sm:mt-4">
                <div className="bg-gray-50 px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm">
                  비품 지원
                </div>
                <div className="bg-gray-50 px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm">
                  무료 DB 제공
                </div>
                <div className="bg-gray-50 px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm">
                  신입양성 아카데미
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* 업무 지원 섹션 - 모바일 패딩 및 그리드 조정 */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-10 sm:py-12 md:py-16 bg-blue-50"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">업무 지원</h2>
            <div className="w-12 sm:w-16 h-1 bg-blue-500 mx-auto rounded-full mb-4 sm:mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              시너지그룹은 임직원들의 업무 효율과 성과를 높이기 위한 다양한 지원을 제공합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto">
            <motion.div
              custom={0}
              variants={cardVariants}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="bg-blue-600 py-4 px-6 text-center">
                <Briefcase className="w-10 h-10 text-white mx-auto mb-2" />
                <h3 className="text-lg font-bold text-white">비품 지원</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600 text-center">
                  임직원들의 업무에 필요한 모든 비품과 장비를 지원하여 최적의 업무 환경을
                  제공합니다.
                </p>
              </div>
            </motion.div>

            <motion.div
              custom={1}
              variants={cardVariants}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="bg-blue-600 py-4 px-6 text-center">
                <Database className="w-10 h-10 text-white mx-auto mb-2" />
                <h3 className="text-lg font-bold text-white">무료 DB 제공</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600 text-center">
                  니즈가 확인된 가망 고객 DB를 제공하여 업무 성과를 높이고 효율적인 고객 관리를
                  지원합니다.
                </p>
              </div>
            </motion.div>

            <motion.div
              custom={2}
              variants={cardVariants}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="bg-blue-600 py-4 px-6 text-center">
                <GraduationCap className="w-10 h-10 text-white mx-auto mb-2" />
                <h3 className="text-lg font-bold text-white">신입양성 아카데미</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600 text-center">
                  체계적인 교육 프로그램을 통해 신입사원들의 성장을 지원하고 전문성을 키울 수 있는
                  기회를 제공합니다.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* 지원하기 섹션 - 모바일 패딩 및 텍스트 크기 조정 */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-10 sm:py-12 md:py-16 bg-white"
      >
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8">
            지금 바로 시너지그룹과 함께하세요
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6 sm:mb-10 text-sm sm:text-base">
            도전적이고 성취감 넘치는 환경에서 자신의 역량을 마음껏 발휘하고 성장할 기회를 잡으세요.
            시너지그룹은 열정적인 당신을 기다리고 있습니다.
          </p>

          {/* 지원하기 버튼 - 주석 해제 및 모바일 크기 조정 */}
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-full text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto"
            onClick={handleApply}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-t-2 border-b-2 border-white mr-2"></div>
                처리 중...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                지원하기
              </>
            )}
          </Button>

          <p className="text-xs sm:text-sm text-gray-500 mt-4 sm:mt-6">
            문의사항은 02-XXX-XXXX 또는 careers@synergygroup.co.kr로 연락주세요.
          </p>
        </div>
      </motion.section>

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
