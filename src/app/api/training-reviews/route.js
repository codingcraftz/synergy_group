import { NextResponse } from "next/server";

const GOOGLE_SHEET_ID = process.env.NEXT_PUBLIC_TRAINING_SHEET_ID;
const GOOGLE_SHEET_URL = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/export?format=csv&gid=945107559`;

// 프록시 서버를 통한 접근 시도
const PROXY_URLS = [
  `https://api.allorigins.win/raw?url=${encodeURIComponent(GOOGLE_SHEET_URL)}`,
  `https://cors-anywhere.herokuapp.com/${GOOGLE_SHEET_URL}`,
  GOOGLE_SHEET_URL, // 직접 접근
];

// CSV 라인 파싱 함수 (따옴표 처리)
const parseCSVLine = (line) => {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
};

// CSV 파싱 함수 (멀티라인 텍스트 지원)
const parseCSV = (csvText) => {
  const rows = [];
  let currentRow = [];
  let currentField = "";
  let inQuotes = false;
  let i = 0;

  while (i < csvText.length) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // 연속된 따옴표는 이스케이프된 따옴표
        currentField += '"';
        i += 2;
        continue;
      } else {
        // 따옴표 모드 토글
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      // 필드 구분자
      currentRow.push(currentField.trim());
      currentField = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      // 행 구분자 (따옴표 밖에서만)
      if (currentField || currentRow.length > 0) {
        currentRow.push(currentField.trim());
        if (currentRow.some((field) => field.length > 0)) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentField = "";
      }
      // \r\n 처리
      if (char === "\r" && nextChar === "\n") {
        i++;
      }
    } else {
      // 일반 문자 (따옴표 안의 줄바꿈 포함)
      currentField += char;
    }

    i++;
  }

  // 마지막 필드와 행 처리
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some((field) => field.length > 0)) {
      rows.push(currentRow);
    }
  }

  // 빈 행 제거 및 헤더 제거
  const validRows = rows.filter(
    (row) => row.length > 0 && row.some((field) => field.trim().length > 0)
  );

  if (validRows.length <= 1) {
    return [];
  }

  // 헤더 제거 (첫 번째 줄)
  const dataRows = validRows.slice(1);

  return dataRows
    .map((values, index) => {
      if (values.length < 9) {
        return null; // 데이터가 불완전한 경우 제외
      }

      // 타임스탬프 파싱 (구글 시트 형식: "2025. 6. 24 오전 8:01:11")
      const parseTimestamp = (timestampStr) => {
        if (!timestampStr) return new Date().toISOString();
        try {
          // "2025. 6. 24 오전 8:01:11" 형식을 파싱
          const cleaned = timestampStr.replace(/\s+/g, " ").trim();

          // 오전/오후 처리
          let dateTimeStr = cleaned;
          if (cleaned.includes("오전") || cleaned.includes("오후")) {
            const isAM = cleaned.includes("오전");
            const parts = cleaned.split(isAM ? "오전" : "오후");
            const datePart = parts[0].trim(); // "2025. 6. 24"
            const timePart = parts[1].trim(); // "8:01:11"

            // 날짜 부분 변환: "2025. 6. 24" -> "2025-06-24"
            const dateFormatted = datePart
              .replace(/\s/g, "")
              .replace(/\./g, "-")
              .split("-")
              .map((part, i) => (i > 0 ? part.padStart(2, "0") : part))
              .join("-");

            // 시간 부분 변환
            let [hours, minutes, seconds] = timePart.split(":");
            hours = parseInt(hours);
            if (!isAM && hours !== 12) hours += 12;
            if (isAM && hours === 12) hours = 0;

            const timeFormatted = `${hours.toString().padStart(2, "0")}:${minutes}:${seconds}`;
            dateTimeStr = `${dateFormatted}T${timeFormatted}+09:00`;
          }

          const date = new Date(dateTimeStr);
          return date.toISOString();
        } catch (e) {
          console.error("타임스탬프 파싱 오류:", e, timestampStr);
          return new Date().toISOString();
        }
      };

      // 교육일자 파싱 (구글 시트 형식: "2025. 6. 17")
      const parseDate = (dateStr) => {
        if (!dateStr) return new Date().toISOString().split("T")[0];
        try {
          // "2025. 6. 17" 형식을 "2025-06-17" 형식으로 변환
          const cleaned = dateStr.replace(/\s/g, "").replace(/\./g, "-");
          const parts = cleaned.split("-");
          if (parts.length >= 3) {
            const year = parts[0];
            const month = parts[1].padStart(2, "0");
            const day = parts[2].padStart(2, "0");
            return `${year}-${month}-${day}`;
          }
        } catch (e) {
          console.error("날짜 파싱 오류:", e);
        }
        return new Date().toISOString().split("T")[0];
      };

      return {
        id: index + 1,
        timestamp: values[0] || "",
        reviewer_branch: values[1] || "",
        reviewer_name: values[2] || "",
        training_title: values[3] || "",
        instructor_name: values[4] || "",
        training_date: parseDate(values[5]),
        training_time: values[6] || "",
        rating: parseInt(values[7]) || 5,
        content: values[8] || "",
        created_at: parseTimestamp(values[0]),
      };
    })
    .filter((review) => review && review.training_title && review.content);
};

// 여러 URL로 시도하는 함수
const fetchWithFallback = async () => {
  let lastError;

  for (let i = 0; i < PROXY_URLS.length; i++) {
    const url = PROXY_URLS[i];
    try {
      console.log(`시도 ${i + 1}: ${url}`);

      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });

      console.log(`응답 상태: ${response.status}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      console.log(`응답 길이: ${text.length} characters`);
      console.log(`응답 시작 부분: ${text.substring(0, 200)}`);

      // HTML 응답인지 확인
      if (text.includes("<html>") || text.includes("<!DOCTYPE")) {
        throw new Error("HTML 응답을 받았습니다. CSV가 아닙니다.");
      }

      return text;
    } catch (error) {
      console.error(`URL ${i + 1} 실패:`, error.message);
      lastError = error;
      continue;
    }
  }

  throw lastError;
};

export async function GET() {
  try {
    if (!GOOGLE_SHEET_ID) {
      return NextResponse.json(
        {
          error: "구글 시트 ID가 설정되지 않았습니다.",
          debug: { sheetId: GOOGLE_SHEET_ID },
        },
        { status: 500 }
      );
    }

    console.log("구글 시트 ID:", GOOGLE_SHEET_ID);
    console.log("시도할 URL들:", PROXY_URLS);

    const csvText = await fetchWithFallback();
    const parsedData = parseCSV(csvText);

    console.log("파싱된 리뷰 개수:", parsedData.length);

    return NextResponse.json({
      success: true,
      data: parsedData,
      count: parsedData.length,
      debug: {
        sheetId: GOOGLE_SHEET_ID,
        csvLength: csvText.length,
      },
    });
  } catch (error) {
    console.error("API 오류:", error);

    // 에러 시 샘플 데이터 반환
    const sampleData = [
      {
        id: 1,
        training_title: "보장분석 기초교육",
        instructor_name: "김유리 팀장",
        training_date: "2025-06-20",
        training_time: "10:00 - 12:00",
        reviewer_name: "이헌기",
        reviewer_branch: "벨류메이커스지점",
        content:
          "한장으로 하는 보장분석 교육이 정말 유익했습니다.\n\n고객에게 쉽게 설명할 수 있는 방법을 배워서 실무에 바로 적용할 수 있을 것 같습니다.\n\n김유리 팀장님의 설명이 이해하기 쉬웠고, 실제 사례를 들어주셔서 더욱 도움이 되었습니다.\n\n앞으로도 이런 실무 중심의 교육이 많이 있었으면 좋겠습니다.",
        rating: 5,
        created_at: "2025-06-20T12:30:00Z",
      },
      {
        id: 2,
        training_title: "신입사원 기본교육",
        instructor_name: "박민수 과장",
        training_date: "2025-06-21",
        training_time: "14:00 - 16:00",
        reviewer_name: "김신입",
        reviewer_branch: "강남지점",
        content:
          "신입사원으로서 꼭 필요한 기본 지식들을 체계적으로 배울 수 있었습니다.\n\n특히 좋았던 점:\n1. 보험 상품에 대한 체계적인 설명\n2. 고객 상담 시 필요한 기본 매너\n3. 실무에 바로 적용 가능한 스킬\n\n덕분에 업무에 대한 자신감이 생겼습니다.",
        rating: 4,
        created_at: "2025-06-21T16:30:00Z",
      },
      {
        id: 3,
        training_title: "고객 상담 스킬 향상",
        instructor_name: "이영희 부장",
        training_date: "2025-06-22",
        training_time: "09:00 - 11:00",
        reviewer_name: "최베테랑",
        reviewer_branch: "서초지점",
        content:
          "경력이 있음에도 불구하고 새로운 상담 기법들을 배울 수 있어서 좋았습니다.\n\n인상 깊었던 내용:\n• 어려운 고객 응대 방법\n• 실제 상황별 대응 전략\n• 고객 심리 파악 기법\n\n실습 위주의 교육이라 바로 현장에서 활용할 수 있을 것 같습니다.",
        rating: 5,
        created_at: "2025-06-22T11:30:00Z",
      },
      {
        id: 4,
        training_title: "디지털 보험 영업 전략",
        instructor_name: "정디지털 차장",
        training_date: "2025-06-23",
        training_time: "15:00 - 17:00",
        reviewer_name: "온라인",
        reviewer_branch: "디지털지점",
        content:
          "요즘 트렌드에 맞는 디지털 영업 방법을 배울 수 있어서 매우 유익했습니다.\n\n주요 내용:\n- SNS 활용한 고객 발굴\n- 온라인 상담 스킬\n- 디지털 도구 활용법\n- 비대면 계약 프로세스\n\n특히 실제 성공 사례를 공유해주셔서 더욱 도움이 되었습니다.\n\n시대에 뒤떨어지지 않으려면 꼭 들어야 할 교육인 것 같습니다!",
        rating: 5,
        created_at: "2025-06-23T17:30:00Z",
      },
    ];

    return NextResponse.json({
      success: false,
      error: error.message,
      data: sampleData,
      count: sampleData.length,
      debug: {
        sheetId: GOOGLE_SHEET_ID,
        attemptedUrls: PROXY_URLS,
        errorDetails: error.toString(),
      },
    });
  }
}
