"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin, Phone, Clock, Mail, ExternalLink, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useInView } from "react-intersection-observer";

// 지점 데이터 업데이트
const BRANCHES = [
  {
    id: 1,
    name: "컴패니언 서울(송파)",
    category: "컴패니언",
    region: "서울",
    address: "서울시 송파구 위례서로 252, 유원플러스 빌딩 2F 203호",
    phone: "010-2286-9876",
    manager: "김윤성",
    email: "companion_songpa@synergygroup.co.kr",
    hours: "평일 09:00 - 18:00 (주말 및 공휴일 휴무)",
    description: "컴패니언 송파 지점은 송파 지역 고객들에게 편리한 서비스를 제공합니다.",
    lat: 37.486938507406705,
    lng: 127.1424511118465,
  },
  {
    id: 2,
    name: "컴패니언 서울(서초)",
    category: "컴패니언",
    region: "서울",
    address: "서울시 서초구 방배로19길 31, 5층(방배동, 서진빌딩)",
    phone: "010-6274-0009",
    manager: "안인선",
    email: "companion_seocho@synergygroup.co.kr",
    hours: "평일 09:00 - 18:00 (주말 및 공휴일 휴무)",
    description: "컴패니언 서초 지점은 서초 지역 고객들에게 최상의 서비스를 제공합니다.",
    lat: 37.48470410656068,
    lng: 126.99344213942159,
  },
  {
    id: 3,
    name: "컴패니언 대전(신탄진)",
    category: "컴패니언",
    region: "대전",
    address: "대전 대덕구 신탄진로218번길 5",
    phone: "010-5552-5585",
    manager: "김유진",
    email: "companion_daejeon@synergygroup.co.kr",
    hours: "평일 09:00 - 18:00 (주말 및 공휴일 휴무)",
    description: "컴패니언 대전 지점은 대전 지역 고객들을 위한 특화된 서비스를 제공합니다.",
    lat: 36.39994541571387,
    lng: 127.42350343984674,
  },
  {
    id: 4,
    name: "컴패니언 제주",
    category: "컴패니언",
    region: "제주",
    address: "제주특별자치도 제주시 중앙로 302 더스프링 8층",
    phone: "010-7339-0269",
    manager: "박진심",
    email: "companion_jeju@synergygroup.co.kr",
    hours: "평일 09:00 - 18:00 (주말 및 공휴일 휴무)",
    description:
      "제주 지역에 위치한 컴패니언 지점으로, 제주 고객들에게 편리한 서비스를 제공합니다.",
    lat: 33.493841004892325,
    lng: 126.5341254686552,
  },
  {
    id: 5,
    name: "컴패니언 거제(고현)",
    category: "컴패니언",
    region: "경남",
    address: "경남 거제시 거제중앙로31길 8, 3층(곤현동, 한영빌딩)",
    phone: "010-7407-6664",
    manager: "옥승묵",
    email: "companion_geoje@synergygroup.co.kr",
    hours: "평일 09:00 - 18:00 (주말 및 공휴일 휴무)",
    description: "거제 지역의 핵심 지점으로, 남부권 고객들에게 편리한 서비스를 제공합니다.",
    lat: 34.89066799459297,
    lng: 128.6210976495174,
  },
  {
    id: 6,
    name: "컴패니언 하동(진교)",
    category: "컴패니언",
    region: "경남",
    address: "경남 하동군 진교면 민다리길 62-4",
    phone: "010-5050-2208",
    manager: "이혜지",
    email: "companion_hadong@synergygroup.co.kr",
    hours: "평일 09:00 - 18:00 (주말 및 공휴일 휴무)",
    description:
      "하동 지역에 위치한 컴패니언 지점으로, 지역 고객들에게 맞춤형 서비스를 제공합니다.",
    lat: 35.02732389486516,
    lng: 127.90365493690106,
  },
  {
    id: 7,
    name: "컴패니언 부산(센텀)",
    category: "컴패니언",
    region: "부산",
    address: "부산광역시 해운대구 재송동 1209외 2필지 센텀아이에이스타워 4층 1호",
    phone: "010-4856-0915",
    manager: "이효림",
    email: "companion_busan@synergygroup.co.kr",
    hours: "평일 09:00 - 18:00 (주말 및 공휴일 휴무)",
    description:
      "부산 센텀 지역에 위치한 지점으로, 최신 시설과 경험 많은 직원들이 서비스를 제공합니다.",
    lat: 35.176619853577925,
    lng: 129.12543728473867,
  },
  {
    id: 8,
    name: "컴패니언 김해(장유)",
    category: "컴패니언",
    region: "경남",
    address: "경남 김해시 번화1로 44번길 23, 202호",
    phone: "010-8963-7209",
    manager: "노정연",
    email: "companion_gimhae@synergygroup.co.kr",
    hours: "평일 09:00 - 18:00 (주말 및 공휴일 휴무)",
    description: "김해 장유 지역의 고객들을 위한 컴패니언 지점입니다.",
    lat: 35.194799040832606,
    lng: 128.80539911529743,
  },
  {
    id: 9,
    name: "컴패니언 양산1",
    category: "컴패니언",
    region: "경남",
    address: "경남 양산시 물금읍 증산역로 163, 405호(가촌리, 재승프라자)",
    phone: "010-9871-0444",
    manager: "박진단",
    email: "companion_yangsan1@synergygroup.co.kr",
    hours: "평일 09:00 - 18:00 (주말 및 공휴일 휴무)",
    description: "양산 지역의 첫 번째 컴패니언 지점입니다.",
    lat: 35.309473082576716,
    lng: 129.0077243021707,
  },
  {
    id: 10,
    name: "컴패니언 양산2",
    category: "컴패니언",
    region: "경남",
    address: "경남 양산시 물금읍 증산역로 163, 308호(가촌리, 재승프라자)",
    phone: "010-9871-0444",
    manager: "박진단",
    email: "companion_yangsan2@synergygroup.co.kr",
    hours: "평일 09:00 - 18:00 (주말 및 공휴일 휴무)",
    description: "양산 지역의 두 번째 컴패니언 지점입니다.",
    lat: 35.309473082576716,
    lng: 129.0077243021707,
  },
  {
    id: 11,
    name: "컴패니언 양산3",
    category: "컴패니언",
    region: "경남",
    address: "경남 양산시 물금읍 청운로 354, 아이시티504호",
    phone: "010-4569-2739",
    manager: "임순양",
    email: "companion_yangsan3@synergygroup.co.kr",
    hours: "평일 09:00 - 18:00 (주말 및 공휴일 휴무)",
    description: "양산 지역의 세 번째 컴패니언 지점입니다.",
    lat: 35.32718890491046,
    lng: 129.01683826173849,
  },
  {
    id: 12,
    name: "컴패니언 일산(보험왕)",
    category: "컴패니언",
    region: "경기",
    address: "경기도 고양시 덕양구 원흥동 632-1, 736호",
    phone: "010-2800-4883",
    manager: "진교정",
    email: "companion_ilsan@synergygroup.co.kr",
    hours: "평일 09:00 - 18:00 (주말 및 공휴일 휴무)",
    description: "일산 지역에 위치한 컴패니언 보험왕 지점입니다.",
    lat: 37.64836290974986,
    lng: 126.87323259931269,
  },
  {
    id: 13,
    name: "그랑프리 광명",
    category: "그랑프리",
    region: "경기",
    address: "경기도 광명시 일직로 43, C동 915호(일직동, GIDC)",
    phone: "010-6667-5192",
    manager: "경명구",
    email: "grandprix_gwangmyeong@synergygroup.co.kr",
    hours: "평일 09:00 - 18:00 (주말 및 공휴일 휴무)",
    description: "광명 지역에 위치한 그랑프리 지점입니다.",
    lat: 37.42274603400484,
    lng: 126.88685722511745,
  },
  {
    id: 14,
    name: "그랑프리 광주",
    category: "그랑프리",
    region: "광주",
    address: "광주 서구 상무중앙로 9, 10층 1003호 (치평동, 동양빌딩)",
    phone: "010-4765-1247",
    manager: "백건",
    email: "grandprix_gwangju@synergygroup.co.kr",
    hours: "평일 09:00 - 18:00 (주말 및 공휴일 휴무)",
    description: "광주 지역의 그랑프리 지점으로, 고객들에게 전문적인 서비스를 제공합니다.",
    lat: 35.14771266163222,
    lng: 126.8479048054425,
  },
  {
    id: 15,
    name: "그랑프리 하남",
    category: "그랑프리",
    region: "경기",
    address: "경기도 하남시 미사대로 510, 아이에스비즈타워 701호",
    phone: "010-2335-8975",
    manager: "윤길준",
    email: "grandprix_hanam@synergygroup.co.kr",
    hours: "평일 09:00 - 18:00 (주말 및 공휴일 휴무)",
    description: "하남 지역에 위치한 그랑프리 지점입니다.",
    lat: 37.55951072746874,
    lng: 127.2032872565013,
  },
  {
    id: 16,
    name: "그랑프리 춘천",
    category: "그랑프리",
    region: "강원",
    address: "강원 춘천시 공지로 267-1 2층",
    phone: "010-8245-0377",
    manager: "강성무",
    email: "grandprix_chuncheon@synergygroup.co.kr",
    hours: "평일 09:00 - 18:00 (주말 및 공휴일 휴무)",
    description: "춘천 지역에 위치한 그랑프리 지점으로, 강원 지역 고객들에게 서비스를 제공합니다.",
    lat: 37.86546743506793,
    lng: 127.73476069903982,
  },
  {
    id: 17,
    name: "한자산 광명",
    category: "한자산",
    region: "경기",
    address: "경기도 광명시 일직로 72 광명무역센터 A동 3층",
    phone: "010-5058-3994",
    manager: "홍유민",
    email: "hanasset_gwangmyeong@synergygroup.co.kr",
    hours: "평일 09:00 - 18:00 (주말 및 공휴일 휴무)",
    description: "광명 지역에 위치한 한자산 지점입니다.",
    lat: 37.419995633173926,
    lng: 126.88918852757172,
  },
  {
    id: 18,
    name: "한자산 시흥",
    category: "한자산",
    region: "경기",
    address: "경기도 시흥시 솔고개길 36-5 3층",
    phone: "010-5058-3994",
    manager: "홍유민",
    email: "hanasset_siheung@synergygroup.co.kr",
    hours: "평일 09:00 - 18:00 (주말 및 공휴일 휴무)",
    description: "시흥 지역에 위치한 한자산 지점입니다.",
    lat: 37.38529166137603,
    lng: 126.86234842494767,
  },
];

// 지점별 그룹화 함수 수정 - 카테고리 필터 제거
const getRegions = (branches) => {
  // 지역별 지점 수 계산
  const regionCounts = branches.reduce((acc, branch) => {
    acc[branch.region] = (acc[branch.region] || 0) + 1;
    return acc;
  }, {});

  const total = branches.length;

  // 지역 필터만 구성 (카테고리 필터 제거)
  const filters = [
    { id: "all", name: "전체 지점", count: total, type: "all" },
    { id: "서울", name: "서울", count: regionCounts["서울"] || 0, type: "region" },
    { id: "경기", name: "경기", count: regionCounts["경기"] || 0, type: "region" },
    { id: "경남", name: "경남", count: regionCounts["경남"] || 0, type: "region" },
    { id: "부산", name: "부산", count: regionCounts["부산"] || 0, type: "region" },
    { id: "대전", name: "대전", count: regionCounts["대전"] || 0, type: "region" },
    { id: "제주", name: "제주", count: regionCounts["제주"] || 0, type: "region" },
    { id: "광주", name: "광주", count: regionCounts["광주"] || 0, type: "region" },
    { id: "강원", name: "강원", count: regionCounts["강원"] || 0, type: "region" },
  ];

  return filters.filter((item) => item.count > 0);
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
function KakaoMap({ branches, selectedBranch, onSelectBranch, userLocation }) {
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [userMarker, setUserMarker] = useState(null);

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

  // 사용자 위치 표시
  useEffect(() => {
    if (!mapInstance || !userLocation) return;

    // 기존 사용자 마커 제거
    if (userMarker) {
      userMarker.setMap(null);
    }

    // 사용자 위치 마커 생성
    const position = new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng);

    // 사용자 위치 마커 이미지 설정
    const userMarkerImage = new window.kakao.maps.MarkerImage(
      "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
      new window.kakao.maps.Size(24, 35),
      { offset: new window.kakao.maps.Point(12, 35) }
    );

    const marker = new window.kakao.maps.Marker({
      position,
      map: mapInstance,
      image: userMarkerImage,
      zIndex: 10,
    });

    // 사용자 위치 정보창
    const infoContent = `
      <div style="padding:5px;font-size:12px;text-align:center;">
        내 위치
      </div>
    `;

    const infowindow = new window.kakao.maps.InfoWindow({
      content: infoContent,
      removable: true,
    });

    // 마커 클릭 시 정보창 표시
    window.kakao.maps.event.addListener(marker, "click", function () {
      infowindow.open(mapInstance, marker);
    });

    setUserMarker(marker);

    // 지도 범위 재설정 (모든 마커와 사용자 위치 포함)
    if (branches.length > 0) {
      const bounds = new window.kakao.maps.LatLngBounds();
      bounds.extend(position); // 사용자 위치

      // 지점 위치들 추가
      branches.forEach((branch) => {
        bounds.extend(new window.kakao.maps.LatLng(branch.lat, branch.lng));
      });

      mapInstance.setBounds(bounds, 100); // 여백 추가
    }
  }, [mapInstance, userLocation]);

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

  // 사용자 위치와 선택된 지점 사이의 경로 표시 (거리 선으로 연결)
  useEffect(() => {
    if (!mapInstance || !userLocation || !selectedBranch) return;

    // 기존 경로 제거 (이전에 생성된 선이 있으면 제거)
    const existingLine = document.getElementById("distanceLine");
    if (existingLine) {
      existingLine.parentNode.removeChild(existingLine);
    }

    // 경로 좌표 설정
    const path = [
      new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng),
      new window.kakao.maps.LatLng(selectedBranch.lat, selectedBranch.lng),
    ];

    // 선 객체 생성
    const polyline = new window.kakao.maps.Polyline({
      path: path,
      strokeWeight: 3,
      strokeColor: "#5B8FF9",
      strokeOpacity: 0.7,
      strokeStyle: "dashed",
    });

    // 선을 지도에 표시
    polyline.setMap(mapInstance);

    // 경로 객체를 저장하기 위한 DOM 요소 생성 (제거 용도)
    const lineElement = document.createElement("div");
    lineElement.id = "distanceLine";
    lineElement.style.display = "none";
    document.body.appendChild(lineElement);

    return () => {
      polyline.setMap(null);
      if (document.getElementById("distanceLine")) {
        document.getElementById("distanceLine").remove();
      }
    };
  }, [mapInstance, userLocation, selectedBranch]);

  return <div ref={mapRef} className="w-full h-full rounded-lg overflow-hidden"></div>;
}

export default function BranchesPage() {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(BRANCHES[0]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [filterType, setFilterType] = useState("all"); // all, category, region
  const [filteredBranches, setFilteredBranches] = useState(BRANCHES);
  const [regions, setRegions] = useState(getRegions(BRANCHES));
  const [userLocation, setUserLocation] = useState(null);
  const [branchesWithDistance, setBranchesWithDistance] = useState([]);
  const [sortByDistance, setSortByDistance] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");

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

  // 필터 적용
  useEffect(() => {
    let result = [];

    if (selectedFilter === "all") {
      result = BRANCHES;
    } else {
      if (filterType === "category") {
        result = BRANCHES.filter((branch) => branch.category === selectedFilter);
      } else if (filterType === "region") {
        result = BRANCHES.filter((branch) => branch.region === selectedFilter);
      }
    }

    // 거리순 정렬 적용
    if (sortByDistance && userLocation) {
      result = [...result].sort((a, b) => {
        const distanceA = calculateDistance(userLocation.lat, userLocation.lng, a.lat, a.lng);
        const distanceB = calculateDistance(userLocation.lat, userLocation.lng, b.lat, b.lng);
        return distanceA - distanceB;
      });
    }

    setFilteredBranches(result);
  }, [selectedFilter, filterType, sortByDistance, userLocation]);

  // 사용자 위치 기반 거리 계산
  useEffect(() => {
    if (userLocation && filteredBranches.length > 0) {
      const withDistance = filteredBranches.map((branch) => {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          branch.lat,
          branch.lng
        );
        return { ...branch, distance };
      });
      setBranchesWithDistance(withDistance);
    } else {
      setBranchesWithDistance(filteredBranches);
    }
  }, [filteredBranches, userLocation]);

  // 사용자 위치 찾기
  const findUserLocation = () => {
    setIsLoadingLocation(true);
    setLocationError("");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error("위치 정보를 가져오는데 실패했습니다:", error);
          setLocationError("위치 정보를 가져오는데 실패했습니다. 위치 접근 권한을 확인해주세요.");
          setIsLoadingLocation(false);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      setLocationError("브라우저가 위치 정보 기능을 지원하지 않습니다.");
      setIsLoadingLocation(false);
    }
  };

  // 두 지점 간의 거리 계산 (하버사인 공식)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // 지구 반경 (km)
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  // 길찾기 열기
  const openDirections = () => {
    if (!selectedBranch) return;

    // 카카오맵 길찾기 URL 생성
    const { lat, lng, name, address } = selectedBranch;
    const encodedName = encodeURIComponent(name);
    const encodedAddress = encodeURIComponent(address);

    // 카카오맵 길찾기 URL (모바일과 데스크탑 모두 지원)
    const kakaoMapUrl = `https://map.kakao.com/link/to/${encodedName},${lat},${lng}`;

    // 새 창에서 열기
    window.open(kakaoMapUrl, "_blank");
  };

  // 지점 정보 카드 수정
  const BranchCard = ({ branch, isSelected, onClick, distance }) => (
    <Card
      key={branch.id}
      className={`cursor-pointer transition-all duration-300 ${
        isSelected ? "border-blue-400 shadow-md" : "hover:shadow-md border-transparent"
      }`}
      onClick={onClick}
    >
      <CardContent className="p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-bold text-blue-700">{branch.name}</h3>
        <div className="flex items-start text-xs sm:text-sm text-gray-600 mt-1">
          <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-500 mr-1 mt-0.5" />
          <span className="line-clamp-2">{branch.address}</span>
        </div>
        <div className="flex items-center text-xs sm:text-sm text-gray-600 mt-1">
          <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-500 mr-1" />
          {branch.manager} ({branch.phone})
        </div>
        {distance !== undefined && (
          <div className="text-xs text-blue-600 mt-1 font-medium">
            현재 위치에서 약 {distance.toFixed(1)}km
          </div>
        )}
      </CardContent>
    </Card>
  );

  // 필터 변경 핸들러
  const handleFilterChange = (filterId, type) => {
    setSelectedFilter(filterId);
    setFilterType(type);
  };

  // 선택된 필터가 변경되었을 때 첫 번째 지점으로 선택
  useEffect(() => {
    if (filteredBranches.length > 0) {
      setSelectedBranch(filteredBranches[0]);
    }
  }, [filteredBranches]);

  return (
    <div className="min-h-screen bg-white">
      {/* 히어로 섹션 - 모바일 최적화 */}
      <motion.div
        ref={heroRef}
        initial={{ opacity: 0 }}
        animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1 }}
        className="w-full h-[50vh] sm:h-[60vh] md:h-[70vh] relative overflow-hidden"
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

          {/* 콘텐츠 - 모바일 최적화 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={heroInView ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="space-y-4 sm:space-y-6 max-w-3xl relative z-10"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={heroInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="w-16 sm:w-20 h-1 bg-[#90ccef] mx-auto rounded-full"
              />

              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={heroInView ? { y: 0, opacity: 1 } : {}}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-white"
              >
                전국 지점 안내
              </motion.h1>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={heroInView ? { y: 0, opacity: 1 } : {}}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="text-lg sm:text-xl text-blue-100"
              >
                시너지그룹의 전국 네트워크
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={heroInView ? { opacity: 1 } : {}}
                transition={{ delay: 1, duration: 0.8 }}
                className="text-base sm:text-lg text-blue-200 font-light"
              >
                언제나 가까운 곳에서 최상의 서비스를 제공합니다
              </motion.p>

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={heroInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="w-16 sm:w-20 h-1 bg-[#90ccef] mx-auto rounded-full"
              />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* 메인 콘텐츠 - 모바일 최적화 */}
      <motion.div
        ref={contentRef}
        variants={sectionVariants}
        initial="hidden"
        animate={contentInView ? "visible" : "hidden"}
        className="container mx-auto px-4 py-8 sm:py-12"
      >
        {/* 필터 버튼 - 스크롤 가능한 컨테이너로 변경 */}
        <div className="flex overflow-x-auto pb-4 mb-4 sm:mb-8 no-scrollbar">
          <div className="flex gap-2">
            {regions.map((region) => (
              <Button
                key={region.id}
                variant={selectedFilter === region.id ? "default" : "outline"}
                onClick={() => handleFilterChange(region.id, region.type)}
                className="rounded-full whitespace-nowrap text-xs sm:text-sm py-1 h-8 sm:h-10"
              >
                {region.name} ({region.count})
              </Button>
            ))}
          </div>
        </div>

        {/* 사용자 위치 버튼 및 정렬 옵션 */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Button
            onClick={findUserLocation}
            disabled={isLoadingLocation}
            variant="outline"
            className="flex items-center gap-1.5 text-xs sm:text-sm"
          >
            {isLoadingLocation ? (
              <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
            ) : (
              <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            )}
            내 위치에서 가까운 지점 찾기
          </Button>

          {userLocation && (
            <Button
              onClick={() => setSortByDistance(!sortByDistance)}
              variant={sortByDistance ? "default" : "outline"}
              className="text-xs sm:text-sm"
            >
              거리순 정렬 {sortByDistance ? "끄기" : "켜기"}
            </Button>
          )}
        </div>

        {/* 위치 오류 메시지 */}
        {locationError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
            {locationError}
          </div>
        )}

        {/* 모바일에서는 지도를 먼저 표시하고 그 다음에 지점 목록 표시 */}
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 sm:gap-8">
          {/* 지도 및 상세 정보 - 모바일에서는 전체 너비로 표시 */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6 order-1 lg:order-2">
            {/* 카카오 지도 */}
            <motion.div
              variants={mapVariants}
              className="w-full h-[250px] sm:h-[350px] md:h-[400px] rounded-lg shadow-md overflow-hidden bg-gray-100"
            >
              {mapLoaded ? (
                <KakaoMap
                  branches={filteredBranches}
                  selectedBranch={selectedBranch}
                  onSelectBranch={setSelectedBranch}
                  userLocation={userLocation}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
                  <div className="animate-pulse text-gray-500 mb-2 text-sm sm:text-base">
                    지도를 불러오는 중...
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 text-xs sm:text-sm"
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
            {selectedBranch && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-lg shadow-md overflow-hidden p-4 sm:p-6 space-y-3 sm:space-y-4"
              >
                <h2 className="text-xl sm:text-2xl font-bold text-blue-700">
                  {selectedBranch.name}
                </h2>
                <p className="text-sm sm:text-base text-gray-700">{selectedBranch.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4">
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 mr-2 mt-0.5" />
                      <div>
                        <div className="font-semibold text-xs sm:text-sm">주소</div>
                        <div className="text-xs sm:text-sm text-gray-700">
                          {selectedBranch.address}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 mr-2 mt-0.5" />
                      <div>
                        <div className="font-semibold text-xs sm:text-sm">담당자/연락처</div>
                        <div className="text-xs sm:text-sm text-gray-700">
                          {selectedBranch.manager} ({selectedBranch.phone})
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 mr-2 mt-0.5" />
                      <div>
                        <div className="font-semibold text-xs sm:text-sm">영업시간</div>
                        <div className="text-xs sm:text-sm text-gray-700">
                          {selectedBranch.hours}
                        </div>
                      </div>
                    </div>

                    {userLocation && selectedBranch.distance !== undefined && (
                      <div className="flex items-start">
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 mr-2 mt-0.5" />
                        <div>
                          <div className="font-semibold text-xs sm:text-sm">현재 위치에서 거리</div>
                          <div className="text-xs sm:text-sm text-gray-700">
                            약 {selectedBranch.distance.toFixed(1)}km
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 길찾기 버튼 */}
                <Button
                  onClick={openDirections}
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <MapPin className="w-4 h-4 mr-2" /> 길찾기
                </Button>
              </motion.div>
            )}
          </div>

          {/* 지점 목록 - 모바일에서는 아래에 표시 */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3">지점 목록</h3>
            <div className="space-y-3 h-[300px] lg:h-[600px] overflow-y-auto pr-2 sm:pr-4">
              {branchesWithDistance.length > 0 ? (
                branchesWithDistance.map((branch) => (
                  <BranchCard
                    key={branch.id}
                    branch={branch}
                    isSelected={selectedBranch?.id === branch.id}
                    onClick={() => setSelectedBranch(branch)}
                    distance={branch.distance}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 text-sm sm:text-base">
                  해당 필터에 맞는 지점이 없습니다.
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

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
