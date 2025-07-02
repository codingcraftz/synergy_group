"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Star,
  Calendar,
  Clock,
  User,
  BookOpen,
  Search,
  Trophy,
  ThumbsUp,
  Quote,
  Users,
  TrendingUp,
  ExternalLink,
  Building,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { motion } from "framer-motion";

// 구글 폼 URL (실제 구글 폼 URL로 교체해야 함)
const GOOGLE_FORM_URL = "https://forms.gle/your-form-id";

// 교육시간 포맷팅 함수
const formatTrainingTime = (timeStr) => {
  if (!timeStr) return "";

  try {
    // "10:00 - 11:00, 11:00 - 12:00" 형태의 문자열 파싱
    const timeRanges = timeStr.split(",").map((range) => range.trim());

    if (timeRanges.length === 0) return timeStr;

    // 첫 번째와 마지막 시간 추출
    const firstRange = timeRanges[0].split(" - ");
    const lastRange = timeRanges[timeRanges.length - 1].split(" - ");

    if (firstRange.length < 2 || lastRange.length < 2) return timeStr;

    const startTime = firstRange[0].trim();
    const endTime = lastRange[1].trim();

    // 시간 계산
    const parseTime = (timeStr) => {
      const [hours, minutes] = timeStr.split(":").map(Number);
      return hours * 60 + minutes;
    };

    const startMinutes = parseTime(startTime);
    const endMinutes = parseTime(endTime);
    const durationMinutes = endMinutes - startMinutes;
    const durationHours = Math.floor(durationMinutes / 60);

    return `${startTime} - ${endTime} (${durationHours}시간)`;
  } catch (error) {
    return timeStr;
  }
};

// 텍스트 자르기 함수
const truncateText = (text, maxLength = 150) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

// 개별 후기 카드 컴포넌트
const ReviewCard = ({ review, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = review.content && review.content.length > 150;

  return (
    <motion.div
      key={review.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-blue-500">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-lg mb-2 text-blue-900">{review.training_title}</CardTitle>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  강사: {review.instructor_name}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {format(new Date(review.training_date), "yyyy년 MM월 dd일", {
                    locale: ko,
                  })}
                </div>
                {review.training_time && (
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatTrainingTime(review.training_time)}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center mb-2">
                {Array.from({ length: 5 }, (_, starIndex) => (
                  <Star
                    key={starIndex}
                    className={`w-4 h-4 ${starIndex < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <Badge variant="outline" className="text-xs mb-1">
                {review.reviewer_name} 프로
              </Badge>
              {review.reviewer_branch && (
                <Badge variant="secondary" className="text-xs">
                  <Building className="w-3 h-3 mr-1" />
                  {review.reviewer_branch}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="relative bg-gray-50 p-4 rounded-lg">
            <Quote className="absolute top-2 left-2 w-4 h-4 text-gray-400" />
            <div className="pl-6">
              <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line">
                {isExpanded || !shouldTruncate ? review.content : truncateText(review.content)}
              </p>

              {shouldTruncate && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-2 p-0 h-auto text-blue-600 hover:text-blue-800 hover:bg-transparent"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-1" />
                      접기
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-1" />
                      더보기
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center text-sm text-gray-500">
              <ThumbsUp className="w-4 h-4 mr-1" />
              도움이 되는 후기
            </div>
            <div className="text-xs text-gray-400">
              작성일:{" "}
              {(() => {
                try {
                  const date = new Date(review.created_at);
                  if (isNaN(date.getTime())) {
                    return "날짜 정보 없음";
                  }
                  return format(date, "MM/dd", { locale: ko });
                } catch (error) {
                  return "날짜 정보 없음";
                }
              })()}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function TrainingReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInstructor, setSelectedInstructor] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [error, setError] = useState(null);

  // 페이지네이션 및 정렬 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("latest"); // latest, oldest, rating_high, rating_low
  const itemsPerPage = 6;

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      // Next.js API 라우트를 통해 데이터 가져오기
      const response = await fetch("/api/training-reviews");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setReviews(result.data);
        console.log(`${result.count}개의 후기를 불러왔습니다.`);
      } else {
        // API에서 에러가 발생했지만 샘플 데이터는 제공하는 경우
        console.warn("API 오류:", result.error);
        setError(`데이터 로드 중 문제가 발생했습니다: ${result.error}`);
        setReviews(result.data || []);
      }
    } catch (error) {
      console.error("후기를 불러오는 중 오류가 발생했습니다:", error);
      setError("데이터를 불러오는 중 문제가 발생했습니다: " + error.message);

      // 완전한 에러 시 로컬 샘플 데이터 사용
      const sampleData = [
        {
          id: 1,
          training_title: "테스트교육명",
          instructor_name: "강사명",
          training_date: "2025-06-17",
          training_time: "10:00 - 11:00, 11:00 - 12:00",
          reviewer_name: "박준영",
          reviewer_branch: "벨류메이커스지점",
          content:
            "좋았습니다. 매우 유익한 교육이었습니다. 실무에 바로 적용할 수 있는 내용들이 많아서 도움이 되었습니다.",
          rating: 5,
          created_at: "2025-06-24T08:01:11Z",
        },
      ];
      setReviews(sampleData);
    } finally {
      setLoading(false);
    }
  };

  // 검색 및 필터링된 후기들
  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.training_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.instructor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.reviewer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.reviewer_branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesInstructor =
      selectedInstructor === "all" || review.instructor_name === selectedInstructor;

    const matchesMonth =
      selectedMonth === "all" ||
      format(new Date(review.training_date), "yyyy-MM") === selectedMonth;

    return matchesSearch && matchesInstructor && matchesMonth;
  });

  // 정렬된 후기들
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case "latest":
        return new Date(b.created_at) - new Date(a.created_at);
      case "oldest":
        return new Date(a.created_at) - new Date(b.created_at);
      case "rating_high":
        return b.rating - a.rating;
      case "rating_low":
        return a.rating - b.rating;
      default:
        return new Date(b.created_at) - new Date(a.created_at);
    }
  });

  // 페이지네이션
  const totalPages = Math.ceil(sortedReviews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReviews = sortedReviews.slice(startIndex, endIndex);

  // 페이지 변경 시 맨 위로 스크롤
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 필터나 정렬 변경 시 첫 페이지로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedInstructor, selectedMonth, sortBy]);

  // 강사별 통계
  const instructorStats = reviews.reduce((acc, review) => {
    const instructor = review.instructor_name;
    if (!acc[instructor]) {
      acc[instructor] = { count: 0, avgRating: 0, totalRating: 0 };
    }
    acc[instructor].count++;
    acc[instructor].totalRating += review.rating;
    acc[instructor].avgRating =
      Math.round((acc[instructor].totalRating / acc[instructor].count) * 10) / 10;
    return acc;
  }, {});

  // 월별 통계
  const monthlyStats = reviews.reduce((acc, review) => {
    const month = format(new Date(review.training_date), "yyyy-MM");
    if (!acc[month]) {
      acc[month] = 0;
    }
    acc[month]++;
    return acc;
  }, {});

  // 평균 평점 계산
  const averageRating =
    reviews.length > 0
      ? Math.round(
          (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length) * 10
        ) / 10
      : 0;

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-600">후기를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">{error}</p>
          <p className="text-gray-400 text-sm mt-2">샘플 데이터로 표시됩니다.</p>
          <Button onClick={fetchReviews} className="mt-4">
            다시 시도
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 히어로 섹션 - 다른 페이지와 동일한 패턴 */}
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
          alt="교육후기"
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

        {/* 콘텐츠 - 모바일 최적화 */}
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
              교육 후기
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-lg sm:text-xl text-blue-100"
            >
              실제 교육 참가자들의 생생한 후기
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="text-base sm:text-lg text-blue-200 font-light"
            >
              교육의 품질과 만족도를 확인해보세요
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

      {/* 메인 콘텐츠 */}
      <div className="container mx-auto py-8 px-4">
        {/* 통계 카드들 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="flex items-center justify-center mb-2">
                  <BookOpen className="w-6 h-6 text-blue-500 mr-2" />
                  <span className="text-2xl font-bold">{reviews.length}</span>
                </div>
                <p className="text-sm text-gray-600">총 후기 수</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-4">
                <div className="flex items-center justify-center mb-2">
                  <Star className="w-6 h-6 text-yellow-500 mr-2" />
                  <span className="text-2xl font-bold">{averageRating}</span>
                </div>
                <p className="text-sm text-gray-600">평균 만족도</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* 검색 및 필터 섹션 */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="교육명, 강사명, 후기 내용으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <select
                value={selectedInstructor}
                onChange={(e) => setSelectedInstructor(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">모든 강사</option>
                {Object.keys(instructorStats).map((instructor) => (
                  <option key={instructor} value={instructor}>
                    {instructor} ({instructorStats[instructor].count}개)
                  </option>
                ))}
              </select>

              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">모든 월</option>
                {Object.keys(monthlyStats)
                  .sort((a, b) => b.localeCompare(a))
                  .map((month) => (
                    <option key={month} value={month}>
                      {format(new Date(month + "-01"), "yyyy년 MM월", { locale: ko })} (
                      {monthlyStats[month]}개)
                    </option>
                  ))}
              </select>

              {/* 정렬 옵션 */}
              <div className="relative">
                <ArrowUpDown className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="latest">최신순</option>
                  <option value="oldest">오래된순</option>
                  <option value="rating_high">별점 높은순</option>
                  <option value="rating_low">별점 낮은순</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 결과 정보 및 페이지 정보 */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-600">
            총 {filteredReviews.length}개의 후기 중 {startIndex + 1}-
            {Math.min(endIndex, filteredReviews.length)}개 표시
          </div>
          {totalPages > 1 && (
            <div className="text-sm text-gray-600">
              {currentPage} / {totalPages} 페이지
            </div>
          )}
        </div>

        {/* 후기 목록 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {currentReviews.map((review, index) => (
            <ReviewCard key={review.id} review={review} index={index} />
          ))}
        </div>

        {filteredReviews.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">조건에 맞는 후기가 없습니다.</p>
            <p className="text-gray-400 text-sm mt-2">검색어나 필터를 변경해보세요.</p>
          </div>
        )}

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              이전
            </Button>

            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // 현재 페이지 주변 페이지만 표시 (모바일에서는 더 적게)
                const showPage =
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 2 && page <= currentPage + 2);

                if (!showPage) {
                  // 생략 표시
                  if (page === currentPage - 3 || page === currentPage + 3) {
                    return (
                      <span key={page} className="px-2 py-1 text-gray-400">
                        ...
                      </span>
                    );
                  }
                  return null;
                }

                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className="min-w-[40px]"
                  >
                    {page}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center"
            >
              다음
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}

        {/* 하단 CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl"
        >
          <h2 className="text-2xl font-bold mb-4">우리와 함께 성장해보세요!</h2>
          <p className="text-gray-600 mb-6">
            체계적인 교육 시스템과 전문 강사진이 여러분의 성공을 도와드립니다.
          </p>
          <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600">
            교육 참여하기
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
