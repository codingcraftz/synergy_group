"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin, Phone, Clock, Mail, ExternalLink, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useInView } from "react-intersection-observer";

// 지점 데이터
const BRANCHES = [
  {
    id: 1,
    name: "시너지그룹 강남본사",
    region: "서울",
    address: "서울특별시 강남구 테헤란로 123",
    phone: "02-1234-5678",
    email: "gangnam@synergygroup.co.kr",
    hours: "평일 09:00 - 18:00 (주말 및 공휴일 휴무)",
    description: "시너지그룹의 본사 지점으로, 주요 경영 및 관리 업무를 담당하고 있습니다.",
    lat: 37.5065,
    lng: 127.0536,
  },
  {
    id: 2,
    name: "시너지그룹 강북지점",
    region: "서울",
    address: "서울특별시 종로구 종로 5길 58",
    phone: "02-2345-6789",
    email: "gangbuk@synergygroup.co.kr",
    hours: "평일 09:00 - 18:00 (주말 및 공휴일 휴무)",
    description:
      "강북 지역의 고객들을 위한 지점으로, 접근성이 뛰어나고 다양한 서비스를 제공합니다.",
    lat: 37.5707,
    lng: 126.9926,
  },
  {
    id: 3,
    name: "시너지그룹 영등포지점",
    region: "서울",
    address: "서울특별시 영등포구 여의대로 128",
    phone: "02-3456-7890",
    email: "yeongdeungpo@synergygroup.co.kr",
    hours: "평일 09:00 - 18:00 (주말 및 공휴일 휴무)",
    description: "영등포 지역의 고객들에게 전문적인 서비스를 제공합니다.",
    lat: 37.5172,
    lng: 126.9067,
  },
  {
    id: 4,
    name: "시너지그룹 분당지점",
    region: "경기",
    address: "경기도 성남시 분당구 판교역로 10",
    phone: "031-7890-1234",
    email: "bundang@synergygroup.co.kr",
    hours: "평일 09:00 - 18:00 (주말 및 공휴일 휴무)",
    description:
      "경기도 분당 지역의 고객들을 위한 지점입니다. 최신 시설과 경험 많은 직원들이 기다리고 있습니다.",
    lat: 37.402,
    lng: 127.1087,
  },
  {
    id: 5,
    name: "시너지그룹 부산중앙지점",
    region: "부산",
    address: "부산광역시 해운대구 센텀중앙로 55",
    phone: "051-9876-5432",
    email: "busan@synergygroup.co.kr",
    hours: "평일 09:00 - 18:00 (주말 및 공휴일 휴무)",
    description: "부산 지역의 핵심 지점으로, 남부권 고객들에게 편리한 서비스를 제공합니다.",
    lat: 35.1754,
    lng: 129.1299,
  },
  {
    id: 6,
    name: "시너지그룹 대전지점",
    region: "대전",
    address: "대전광역시 유성구 대학로 99",
    phone: "042-5432-1098",
    email: "daejeon@synergygroup.co.kr",
    hours: "평일 09:00 - 18:00 (주말 및 공휴일 휴무)",
    description:
      "중부권의 중심에 위치한 대전 지점은 접근성이 뛰어나며, 다양한 서비스를 제공합니다.",
    lat: 36.3505,
    lng: 127.3848,
  },
];

// 지역별 그룹화 부분 수정 - 함수형으로 변경
const getRegions = (branches) => {
  // 지역별 지점 수 계산
  const counts = branches.reduce((acc, branch) => {
    acc[branch.region] = (acc[branch.region] || 0) + 1;
    return acc;
  }, {});

  const total = branches.length;

  return [
    { id: "all", name: "전체 지점", count: total },
    { id: "서울", name: "서울", count: counts["서울"] || 0 },
    { id: "경기", name: "경기", count: counts["경기"] || 0 },
    { id: "부산", name: "부산", count: counts["부산"] || 0 },
    { id: "대전", name: "대전", count: counts["대전"] || 0 },
  ];
};

// 애니메이션 설정
const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const mapVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, delay: 0.1, ease: "easeOut" },
  },
};

// 간단한 카카오맵 컴포넌트
function KakaoMap({ branches, selectedBranch, onSelectBranch }) {
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [markers, setMarkers] = useState([]);

  // 맵 초기화
  useEffect(() => {
    const loadKakaoMap = () => {
      if (typeof window === "undefined" || !window.kakao || !window.kakao.maps) return;

      // 이미 초기화된 경우 중복 실행 방지
      if (mapInstance) return;

      const options = {
        center: new window.kakao.maps.LatLng(selectedBranch.lat, selectedBranch.lng),
        level: 3,
      };

      const map = new window.kakao.maps.Map(mapRef.current, options);
      setMapInstance(map);
      console.log("카카오맵 인스턴스가 생성되었습니다.");
    };

    // 카카오맵이 이미 로드되었는지 확인
    if (window.kakao && window.kakao.maps) {
      loadKakaoMap();
    } else {
      // 카카오맵 SDK 직접 로드
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=6def9f0f8353fd15a325c0f811061345&autoload=false`;

      script.onload = () => {
        window.kakao.maps.load(loadKakaoMap);
      };

      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    }
  }, []);

  // 마커 생성 및 업데이트
  useEffect(() => {
    if (!mapInstance) return;

    // 기존 마커 제거
    markers.forEach((item) => {
      if (item.marker) item.marker.setMap(null);
      if (item.infowindow) item.infowindow.setMap(null);
    });

    // 지도 중심 변경
    const moveLatLng = new window.kakao.maps.LatLng(selectedBranch.lat, selectedBranch.lng);
    mapInstance.setCenter(moveLatLng);

    // 새 마커 생성
    const newMarkers = branches.map((branch) => {
      const markerPosition = new window.kakao.maps.LatLng(branch.lat, branch.lng);

      // 기본 마커 생성
      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
        map: mapInstance,
      });

      // 마커 클릭 이벤트
      window.kakao.maps.event.addListener(marker, "click", () => {
        onSelectBranch(branch);
      });

      // 선택된 지점 오버레이
      let infowindow = null;
      if (branch.id === selectedBranch.id) {
        // 선택된 지점에만 말풍선 오버레이 표시
        infowindow = new window.kakao.maps.CustomOverlay({
          position: markerPosition,
          content: `
            <div style="position: relative; background: white; border-radius: 6px; border: 2px solid #3b82f6; box-shadow: 0 2px 5px rgba(0,0,0,0.2); padding: 8px 12px; font-size: 14px; font-weight: 500; color: #3b82f6; text-align: center; white-space: nowrap;">
              ${branch.name}
              <div style="position: absolute; bottom: -8px; left: 50%; margin-left: -8px; width: 16px; height: 16px; background: white; border-right: 2px solid #3b82f6; border-bottom: 2px solid #3b82f6; transform: rotate(45deg);"></div>
            </div>
          `,
          yAnchor: 1.0,
        });
        infowindow.setMap(mapInstance);
      }

      return {
        marker,
        branch,
        infowindow,
      };
    });

    setMarkers(newMarkers);
  }, [mapInstance, branches, selectedBranch, onSelectBranch]);

  return <div ref={mapRef} className="w-full h-full rounded-lg overflow-hidden"></div>;
}

export default function BranchesPage() {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(BRANCHES[0]);
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [filteredBranches, setFilteredBranches] = useState(BRANCHES);
  const [regions, setRegions] = useState(getRegions(BRANCHES));

  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [contentRef, contentInView] = useInView({ threshold: 0.1, triggerOnce: true });

  // 카카오맵 SDK 로드
  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=6def9f0f8353fd15a325c0f811061345&autoload=false`;

    script.onload = () => {
      console.log("카카오맵 스크립트 로드 완료");
      window.kakao.maps.load(() => {
        console.log("카카오맵 API 초기화 완료");
        setMapLoaded(true);
      });
    };

    script.onerror = (e) => {
      console.error("카카오맵 스크립트 로드 오류:", e);
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // 지역 필터링
  useEffect(() => {
    if (selectedRegion === "all") {
      setFilteredBranches(BRANCHES);
    } else {
      setFilteredBranches(BRANCHES.filter((branch) => branch.region === selectedRegion));
    }
  }, [selectedRegion]);

  // 선택된 지역이 변경되었을 때 첫 번째 지점으로 선택
  useEffect(() => {
    if (filteredBranches.length > 0) {
      setSelectedBranch(filteredBranches[0]);
    }
  }, [filteredBranches]);

  // 마운트 시 콘솔에 디버깅 정보 출력
  useEffect(() => {
    console.log("컴포넌트 마운트됨, 맵 로드 상태:", mapLoaded);
    console.log("window.kakao 객체 존재 여부:", !!window.kakao);

    return () => {
      console.log("컴포넌트 언마운트");
    };
  }, [mapLoaded]);

  return (
    <div className="min-h-screen bg-white">
      {/* 히어로 섹션 */}
      <motion.div
        ref={heroRef}
        initial={{ opacity: 0 }}
        animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1 }}
        className="w-full h-[70vh] relative overflow-hidden"
      >
        <Image
          src="/branches_main.jpg"
          fill
          style={{ objectFit: "cover" }}
          alt="시너지그룹 지점안내"
          className="brightness-75"
        />

        {/* 어두운 오버레이와 애니메이션 배경 */}
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0.3 }}
            animate={
              heroInView
                ? {
                    opacity: [0.3, 0.5, 0.3],
                    scale: [1, 1.1, 1],
                  }
                : {}
            }
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"
          />
          <motion.div
            initial={{ opacity: 0.1 }}
            animate={
              heroInView
                ? {
                    opacity: [0.1, 0.3, 0.1],
                    scale: [1, 1.2, 1],
                  }
                : {}
            }
            transition={{
              duration: 12,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1,
            }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.2),transparent_50%)]"
          />

          {/* 콘텐츠 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={heroInView ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="space-y-6 max-w-3xl relative z-10"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={heroInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="w-20 h-1 bg-[#90ccef] mx-auto rounded-full"
              />

              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={heroInView ? { y: 0, opacity: 1 } : {}}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-4xl md:text-5xl font-bold text-white"
              >
                전국 지점 안내
              </motion.h1>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={heroInView ? { y: 0, opacity: 1 } : {}}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="text-xl text-blue-100"
              >
                시너지그룹의 전국 네트워크
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={heroInView ? { opacity: 1 } : {}}
                transition={{ delay: 1, duration: 0.8 }}
                className="text-lg text-blue-200 font-light"
              >
                언제나 가까운 곳에서 최상의 서비스를 제공합니다
              </motion.p>

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={heroInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="w-20 h-1 bg-[#90ccef] mx-auto rounded-full"
              />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* 메인 콘텐츠 */}
      <motion.div
        ref={contentRef}
        variants={sectionVariants}
        initial="hidden"
        animate={contentInView ? "visible" : "hidden"}
        className="container mx-auto px-4 py-12"
      >
        {/* 지역 필터 */}
        <div className="flex flex-wrap gap-2 mb-8">
          {regions.map((region) => (
            <Button
              key={region.id}
              variant={selectedRegion === region.id ? "default" : "outline"}
              onClick={() => setSelectedRegion(region.id)}
              className="rounded-full"
            >
              {region.name} ({region.count})
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 지점 목록 */}
          <div className="lg:col-span-1 space-y-4 h-[600px] overflow-y-auto pr-4">
            {filteredBranches.map((branch) => (
              <Card
                key={branch.id}
                className={`cursor-pointer transition-all duration-300 ${
                  selectedBranch?.id === branch.id
                    ? "border-blue-400 shadow-md"
                    : "hover:shadow-md border-transparent"
                }`}
                onClick={() => setSelectedBranch(branch)}
              >
                <CardContent className="p-4">
                  <h3 className="text-lg font-bold text-blue-700">{branch.name}</h3>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-500 mr-1" />
                    {branch.address}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <Phone className="w-3.5 h-3.5 text-gray-500 mr-1" />
                    {branch.phone}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 지도 및 상세 정보 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 카카오 지도 */}
            <motion.div
              variants={mapVariants}
              className="w-full h-[400px] rounded-lg shadow-md overflow-hidden bg-gray-100"
            >
              {mapLoaded ? (
                <KakaoMap
                  branches={filteredBranches}
                  selectedBranch={selectedBranch}
                  onSelectBranch={setSelectedBranch}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
                  <div className="animate-pulse text-gray-500 mb-2">지도를 불러오는 중...</div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => {
                      // 수동으로 카카오맵 로드 시도
                      if (window.kakao && window.kakao.maps) {
                        window.kakao.maps.load(() => {
                          console.log("수동 로드 시도: 카카오맵 API 초기화 완료");
                          setMapLoaded(true);
                        });
                      } else {
                        console.error("수동 로드 실패: window.kakao 객체가 없음");
                        alert("카카오맵 API 로드에 실패했습니다. 페이지를 새로고침해 주세요.");
                      }
                    }}
                  >
                    지도 수동 로드 시도
                  </Button>
                </div>
              )}
            </motion.div>

            {/* 선택된 지점 상세 정보 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-md overflow-hidden p-6 space-y-4"
            >
              <h2 className="text-2xl font-bold text-blue-700">{selectedBranch.name}</h2>
              <p className="text-gray-700">{selectedBranch.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-blue-500 mr-2 mt-0.5" />
                    <div>
                      <div className="font-semibold text-sm">주소</div>
                      <div className="text-gray-700">{selectedBranch.address}</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Phone className="w-5 h-5 text-blue-500 mr-2 mt-0.5" />
                    <div>
                      <div className="font-semibold text-sm">전화번호</div>
                      <div className="text-gray-700">{selectedBranch.phone}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start">
                    <Mail className="w-5 h-5 text-blue-500 mr-2 mt-0.5" />
                    <div>
                      <div className="font-semibold text-sm">이메일</div>
                      <div className="text-gray-700">{selectedBranch.email}</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-blue-500 mr-2 mt-0.5" />
                    <div>
                      <div className="font-semibold text-sm">영업시간</div>
                      <div className="text-gray-700">{selectedBranch.hours}</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
