"use client";

import React from "react";
import Image from "next/image";

export default function CeoMessage() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center py-16 px-6 lg:px-8 bg-gray-50 text-gray-900">
      {/* CEO 이미지 섹션 */}
      <div className="w-full max-w-4xl flex flex-col items-center text-center mb-12 space-y-4">
        <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden shadow-lg">
          <Image
            src="/ceo_image.jpg" // 실제 CEO 이미지 경로로 변경
            alt="CEO Image"
            layout="fill"
            objectFit="cover"
            objectPosition="top" // 이미지의 상단을 중심으로 보여줌
            className="rounded-full"
          />
        </div>
        <h1 className="text-3xl font-bold text-gray-800">CEO 인사말</h1>
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">
          리더님의 꿈을 실현시켜 드리는 시너지그룹!
        </h2>
      </div>
      {/* 인사말 본문 섹션 */}
      <div className="w-full max-w-3xl space-y-6 text-lg leading-relaxed text-gray-800">
        <p>
          시너지그룹 주식회사(이하 &apos;시너지그룹&apos;이라고만 합니다)는 창립
          이래 &quot;리더님의 꿈을 이루는 삶&quot;을 위해 복합 금융 서비스를
          제공해오며 많은 리더 님들과 함께 성장해왔습니다.
        </p>

        <p>
          저희의 첫 번째 미션은 여러분 사업의 불편함을 대신 해소시켜 드리는
          것입니다. 각자 사업에서는 최고의 전문가인 여러분들조차도 법무, 세무,
          노무, 행정 등 모든 영역을 완벽하게 커버하기란 매우 어려운 일이므로,
          믿을만한 파트너가 사업에만 오롯이 집중할 수 있도록 이를 대신해 줄 수
          있다면 사업의 효율성은 크게 늘어날 것입니다.
        </p>

        <p>
          두 번째 미션은 리더님 사업이 어려움에 직면했을 때 의지할 만한 언덕이
          되어드리는 것입니다. 사업상 발생하는 미수금의 해결부터 운전자금,
          시설자금, 정책자금, 금융권 대출, 소상공인 대출, 법인 대출까지
          신용정보회사는 물론 각종 대부까지 원스톱으로 연결하며 빠르고 만족할
          만한 솔루션을 제공해 드립니다.
        </p>

        <p>
          마지막 미션은 리더님의 사업이 앞으로 백년대계를 세울 수 있도록 현
          상태를 정확히 진단하고 향후 더 발전할 수 있는 모델을 만들어 드리는 데
          기여하는 것입니다. 기본적인 광고&홍보&마케팅부터 종합적인
          경영컨설팅까지 리더님의 신념과 가치, 그리고 철학이 더욱 세상에 빛날 수
          있도록 세심하게 지원해 드립니다.
        </p>

        <p>
          시너지그룹은 과거에 쌓아온 역량과 경험을 지렛대로 삼아, 현 위치에
          안주하지 않고 새로운 트렌드와 정책에 늘 모든 감각을 기민하게 세우며
          언제나 리더님과 함께 성장하는 평생 사업 파트너가 되겠습니다.
        </p>

        <p>
          리더님의 가정과 사업에 늘 평화와 번영이 함께하길 기원하며 어제보다 더
          나은 오늘, 오늘보다 더 나은 내일을 만들어가기 위해 최선을
          다하겠습니다.
        </p>

        <p className="text-right mt-6">감사합니다.</p>
      </div>
    </div>
  );
}
