# my-link 🔗 (Toss Design System Edition)

> Next.js 16, React 19, Tailwind CSS 및 **토스 디자인 시스템(TDS)**을 기반으로 제작된 개인 프로필 & 링크 허브

---

## ✨ 소개 (Overview)

**my-link**는 컴공 대학생이자 바이브 코더인 **이지성**의 개인 링크 트리 및 프로젝트 쇼케이스 웹 허브입니다.  
절제된 무채색 화이트 캔버스, 단일 토스 블루(`blue-500: #3182F6`) 액센트, 둥근 모서리 곡률(14~24px), 그리고 친근한 **해요체** 어조를 갖춘 **토스 디자인 시스템(TDS)** 가이드라인([design.md](file:///d:/coding_class/my-link/design.md))을 충실히 반영하여 화면을 전면 구성했습니다.

## 🎨 TDS 디자인 시스템 특징 (Design Highlights)

- **Pure Canvas & Single Accent**:
  - `grey-50 (#F9FAFB)` 캔버스 위에 `white` 카드와 1px `grey-200 (#E5E8EB)` 헤어라인 보더 적용
  - 화면당 단 하나의 중요한 1차 액션(Primary CTA)에만 토스 블루(`blue-500`) 배정
- **TDS ListRow 컴포넌트**:
  - 44px 아이콘 컨테이너 + 타이틀/서브타이틀 + 우측 Chevron 화살표 슬롯 구조의 시그니처 리스트 로우
- **Pretendard Typography & 해요체**:
  - 본문 15px/16px (line-height 1.5) 가독성 중심 타이포그래피 및 `tabular-nums` 수치 분리
  - 일상적이고 친근한 대화형 존댓말인 **해요체**("-해요", "-있어요") 카피 통일
- **BottomCTA 고정 바**:
  - 화면 하단 56pt 고정 토스 블루 버튼 및 상단 보호 그라디언트(`white → transparent`)
- **TDS Toast 알림**:
  - `grey-900 (#191F28)` 표면 + `green-500` 원형 체크 아이콘의 미니멀 토스트 팝업

---

## 🛠 기술 스택 (Tech Stack)

- **Framework**: [Next.js](https://nextjs.org/) 16 (App Router with Turbopack)
- **Library**: React 19
- **Design System**: [Toss Design System](file:///d:/coding_class/my-link/design.md) (TDS)
- **Styling**: Tailwind CSS & Pretendard Variable
- **Icons**: Lucide React & Custom SVG
- **Language**: TypeScript

---

## 🚀 시작하기 (Getting Started)

### 1. 패키지 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인합니다.

### 3. 빌드 및 검사
```bash
npm run lint
npm run build
```

---

## 📄 라이센스 (License)

This project is licensed under the [MIT License](LICENSE).
