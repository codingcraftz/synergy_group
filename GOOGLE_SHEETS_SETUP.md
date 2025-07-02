# 구글 폼 + 스프레드시트 연동 가이드

## 1단계: 구글 폼 생성

### 1.1 구글 폼 만들기

1. [Google Forms](https://forms.google.com) 접속
2. 새 양식 만들기
3. 제목: "신입교육 후기 작성"

### 1.2 질문 추가 (순서대로)

1. **교육명** (단답형) - 필수
2. **강사명** (단답형) - 필수
3. **교육일자** (날짜) - 필수
4. **시작시간** (단답형) - 예: 10시
5. **종료시간** (단답형) - 예: 12시
6. **작성자명** (단답형) - 필수
7. **만족도** (객관식 - 1점~5점) - 필수
   - 1점 (매우 불만족)
   - 2점 (불만족)
   - 3점 (보통)
   - 4점 (만족)
   - 5점 (매우 만족)
8. **교육 후기** (장문형) - 필수
9. **핵심 학습내용** (장문형) - 선택
10. **공개여부** (객관식) - 필수
    - 공개
    - 비공개

## 2단계: 스프레드시트 연결

### 2.1 응답을 스프레드시트로 수집

1. 구글 폼에서 "응답" 탭 클릭
2. "스프레드시트에서 응답 보기" 아이콘 클릭
3. "새 스프레드시트 만들기" 선택
4. 스프레드시트 이름: "교육후기\_데이터"

### 2.2 스프레드시트 공개 설정

1. 생성된 스프레드시트에서 "공유" 버튼 클릭
2. "링크가 있는 모든 사용자" 선택
3. "뷰어" 권한으로 설정
4. "완료" 클릭

### 2.3 스프레드시트 ID 확인

- URL에서 ID 복사: `https://docs.google.com/spreadsheets/d/[이_부분이_ID]/edit`
- 예: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

## 3단계: 웹사이트 연동

### 3.1 코드 수정

`src/app/training-reviews/page.jsx` 파일에서:

```javascript
// 실제 스프레드시트 ID로 교체
const GOOGLE_SHEET_ID = "여기에_실제_스프레드시트_ID_입력";
```

### 3.2 구글 폼 링크 수정

```javascript
// 실제 구글 폼 URL로 교체
onClick={() => window.open('https://forms.google.com/d/실제폼ID/viewform', '_blank')}
```

## 4단계: 고급 설정 (선택사항)

### 4.1 실시간 데이터 가져오기

현재는 샘플 데이터를 사용하고 있습니다. 실제 스프레드시트에서 데이터를 가져오려면:

```javascript
const fetchReviews = async () => {
  try {
    setLoading(true);
    setError(null);

    // 구글 스프레드시트 CSV 가져오기
    const response = await fetch(GOOGLE_SHEET_URL);
    const csvText = await response.text();
    const parsedData = parseCSV(csvText);

    setReviews(parsedData);
  } catch (error) {
    console.error("후기를 불러오는 중 오류가 발생했습니다:", error);
    setError("데이터를 불러오는 중 문제가 발생했습니다.");
  } finally {
    setLoading(false);
  }
};
```

### 4.2 CORS 문제 해결

만약 CORS 에러가 발생하면:

1. **Proxy 서버 사용**:

```javascript
const PROXY_URL = "https://api.allorigins.win/raw?url=";
const response = await fetch(PROXY_URL + encodeURIComponent(GOOGLE_SHEET_URL));
```

2. **Google Apps Script 사용** (더 안정적):
   - 스프레드시트에서 "확장 프로그램" > "Apps Script" 열기
   - 다음 코드 작성:

```javascript
function doGet() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = sheet.getDataRange().getValues();

  // 헤더 제외하고 데이터만 가져오기
  const headers = data[0];
  const rows = data.slice(1);

  const result = rows
    .map((row) => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    })
    .filter((item) => item["공개여부"] === "공개"); // 공개된 것만 필터링

  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(
    ContentService.MimeType.JSON
  );
}
```

3. **배포하기**:
   - "배포" > "새 배포"
   - "유형" 선택 > "웹앱"
   - "실행 권한": 나
   - "액세스 권한": 모든 사용자
   - "배포" 클릭
   - 배포된 URL을 웹사이트에서 사용

## 5단계: 테스트

1. 구글 폼에서 테스트 데이터 입력
2. 스프레드시트에 데이터가 저장되는지 확인
3. 웹사이트에서 데이터가 표시되는지 확인

## 장점

✅ **관리 용이성**: 스프레드시트에서 직접 데이터 수정 가능  
✅ **비용 효율성**: 무료로 사용 가능  
✅ **실시간 업데이트**: 폼 제출 즉시 반영  
✅ **백업 자동화**: 구글 드라이브 자동 백업  
✅ **협업 가능**: 여러 관리자가 동시 편집 가능

## 주의사항

⚠️ **공개 범위**: 스프레드시트 공개 시 개인정보 노출 주의  
⚠️ **CORS 제한**: 브라우저 CORS 정책으로 직접 접근 제한될 수 있음  
⚠️ **API 제한**: Google Sheets API 호출 제한 (일일 100회 무료)  
⚠️ **실시간성**: CSV 방식은 약간의 지연 있을 수 있음

## 문의사항

설정 중 문제가 발생하면 개발팀에 문의하세요.
