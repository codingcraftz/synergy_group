"use client";

import { useEffect } from "react";
import ChannelService from "@/utils/ChannelService";

export default function ChannelTalk() {
  useEffect(() => {
    // 채널톡 부트스트랩 - 위치 설정 추가
    ChannelService.boot({
      pluginKey: "7d7c8750-82c7-47f2-88f5-d3ffa1fc275e",
      // 왼쪽 상단으로 위치 변경
      mobilePosition: "left",
      desktopPosition: "left",
      customStyle: {
        // 기본 위치 조정 (픽셀 단위)
        bottom: "calc(80% - 15px)", // 하단에서 80% 위로 이동
        right: "auto", // 오른쪽 자동
      },
    });

    // 컴포넌트 언마운트 시 채널톡 종료
    return () => {
      ChannelService.shutdown();
    };
  }, []);

  // 이 컴포넌트는 UI를 렌더링하지 않음
  return null;
}
