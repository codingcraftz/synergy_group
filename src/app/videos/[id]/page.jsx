"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import videoData from "@/data/videoData";

export default function VideoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ID에 해당하는 영상 데이터 찾기
    const foundVideo = videoData.find((v) => v.id === params.id);

    if (foundVideo) {
      setVideo(foundVideo);
      // 조회수 업데이트 등의 로직을 여기에 추가할 수 있음
    } else {
      // 영상을 찾지 못한 경우 갤러리 페이지로 리다이렉트
      router.push("/videos");
    }

    setLoading(false);
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!video) {
    return null; // 리다이렉트 중이므로 아무것도 렌더링하지 않음
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* 비디오 플레이어 섹션 */}
      <div className="bg-black w-full">
        <div className="container mx-auto px-4">
          <div className="aspect-video relative overflow-hidden">
            <video
              src={video.videoUrl}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>

      {/* 비디오 정보 섹션 */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-md p-6 mb-6"
        >
          <div className="flex items-center gap-2 mb-1">
            <Link href="/videos">
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-600 hover:text-blue-800 gap-1 p-0"
              >
                <ArrowLeft className="w-4 h-4" />
                영상 목록으로 돌아가기
              </Button>
            </Link>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-3">{video.title}</h1>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{video.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{video.author}</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Share2 className="w-4 h-4" />
                공유하기
              </Button>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h2 className="text-xl font-semibold mb-3">영상 소개</h2>
            <p className="text-gray-700 whitespace-pre-line">{video.description}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
