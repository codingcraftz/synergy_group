"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Calendar, User, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import videoData from "@/data/videoData";

export default function VideoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [controlsVisible, setControlsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const controlsTimerRef = useRef(null);

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

  // 비디오 컨트롤 표시 관리
  const showControls = () => {
    setControlsVisible(true);

    // 이전 타이머 정리
    if (controlsTimerRef.current) {
      clearTimeout(controlsTimerRef.current);
    }

    // 3초 후 컨트롤 숨기기
    controlsTimerRef.current = setTimeout(() => {
      if (isPlaying) {
        setControlsVisible(false);
      }
    }, 3000);
  };

  // 비디오 이벤트 핸들러
  const handleVideoPlay = () => {
    setIsPlaying(true);
    // 재생 시작 시 컨트롤 숨기기 타이머 시작
    showControls();
  };

  const handleVideoPause = () => {
    setIsPlaying(false);
    setControlsVisible(true);
    // 일시정지 시 컨트롤 계속 표시
    if (controlsTimerRef.current) {
      clearTimeout(controlsTimerRef.current);
    }
  };

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (controlsTimerRef.current) {
        clearTimeout(controlsTimerRef.current);
      }
    };
  }, []);

  // 자동 재생 시도를 위한 효과
  useEffect(() => {
    if (videoRef.current) {
      const playVideo = async () => {
        try {
          // muted로 자동재생 시도 (브라우저 정책 때문에 음소거 필요)
          videoRef.current.muted = true;
          await videoRef.current.play();

          // 자동 재생 성공 후 음소거 해제 시도
          videoRef.current.muted = false;
          setIsPlaying(true);
        } catch (error) {
          console.log("자동 재생이 차단되었습니다:", error);
          // 자동 재생 실패 시 muted 상태로 유지
        }
      };

      playVideo();
    }
  }, [video]);

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
          <div
            className="aspect-video relative overflow-hidden"
            onMouseMove={showControls}
            onClick={() => {
              if (videoRef.current) {
                if (videoRef.current.paused) {
                  videoRef.current.play();
                } else {
                  videoRef.current.pause();
                }
              }
            }}
          >
            <video
              ref={videoRef}
              src={video.videoUrl}
              controls
              playsInline
              preload="auto"
              className="w-full h-full object-contain"
              onPlay={handleVideoPlay}
              onPause={handleVideoPause}
            />

            {/* 뒤로가기 버튼 오버레이 */}
            <AnimatePresence>
              {controlsVisible && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-4 left-4 z-10"
                >
                  <Link href="/videos">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-black/50 hover:bg-black/70 text-white border-transparent rounded-full w-10 h-10 p-0"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </Button>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
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
