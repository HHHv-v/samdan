# samdan

데스크탑에서 쓰는 개인용 할 일 앱입니다. 화면을 Weekly / Daily / Memo 3단으로 나눕니다.

## 기준 자료

- 디자인: `docs/design/` 폴더의 이미지 (1440px 기준)
- 동작과 데이터 구조: `docs/mvp.html`
- 디자인이 서로 다르면 **이미지를 따르고**, 동작이 다르면 **mvp.html을 따릅니다.**
- 이미지에서 알 수 없는 수치는 아래 "디자인 토큰"을 사용합니다.

## 스택

- React + TypeScript + Vite
- Tailwind CSS v4 (`@tailwindcss/vite`, 설정은 `src/index.css`의 `@theme`)
- Zustand + `persist` 미들웨어
- 패키지 매니저: **pnpm** (npm, yarn 명령어 사용 금지)
- 배포: Vercel

## 명령어

```bash
pnpm dev      # 개발 서버
pnpm build    # 타입 검사 + 빌드
pnpm lint     # ESLint
```

## 폴더 구조

```
src/
├─ types/        # Todo, Memo, BoardState
├─ utils/        # 날짜 계산 등 순수 함수
├─ store/        # Zustand 스토어
├─ hooks/        # useAutoHide 등 커스텀 훅
├─ components/
│  ├─ common/    # TodoItem, AddInput, CheckButton
│  ├─ weekly/
│  ├─ daily/     # DateCard, CarryOver
│  └─ memo/      # MemoTiles, MemoEditor
└─ App.tsx       # 헤더 + 3단 그리드
```

## 데이터

- localStorage 키: `todo-board-v1` (변경 금지, 기존 데이터와 호환 유지)
- 저장 구조는 `docs/mvp.html`의 `state`와 같게 유지합니다.

```ts
type Todo = {
  id: string;
  text: string;
  done: boolean;
  type: "daily" | "weekly";
  date: string | null; // daily: "YYYY-MM-DD"
  weekStart: string | null; // weekly: 해당 주 월요일 "YYYY-MM-DD"
  createdAt: number;
};

type Memo = {
  id: string;
  title: string;
  body: string;
  updatedAt: number;
};
```

- 날짜는 로컬 시간 기준 `YYYY-MM-DD` 문자열로 다룹니다. `toISOString()`은 UTC라서 사용하지 않습니다.
- 주의 시작은 월요일입니다.

## 기능

**Weekly**

- 주 단위 할 일 추가, 완료, 더블클릭 수정, 삭제
- 지난주 / 다음주 이동, 다른 주를 보고 있을 때 "이번 주" 버튼 표시
- 항목의 "오늘로" 버튼: 보고 있는 날짜의 Daily 항목으로 복사

**Daily**

- 날짜별 할 일 추가, 완료, 수정, 삭제, "내일로" 이동
- 이전 날 / 다음 날 이동, 다른 날을 보고 있을 때 "오늘" 버튼 표시
- 날짜 카드: 일, 요일, 년월, 진행률 바, 완료 수 / 전체 수
- 날짜 카드 원형 아이콘: 진행률 0% 🌱, 일부 🌿, 50% 이상 ☘️, 100% 🍀
- 오늘을 볼 때 지난 날짜의 미완료 항목이 있으면 "오늘로 가져오기" 표시
- 자정이 지나면 오늘 날짜로 자동 갱신

**Memo**

- 날짜와 무관하게 유지되는 메모 여러 개
- 상단 타일: 제목(없으면 본문 첫 줄), 수정 시각, 선택된 타일은 "수정 중" 표시
- 최근 수정 순 정렬, 많아지면 가로 스크롤
- 마지막 타일은 "새 메모" 버튼
- 제목과 본문 입력 시 자동 저장 (디바운스 400ms)
- 하단에 마지막 저장 시각과 "메모 삭제" 버튼 (삭제 전 확인)

**공통**

- 목록 정렬: 미완료 먼저, 그다음 생성순
- 항목의 보조 버튼(오늘로, 내일로, 삭제)은 호버 시에만 표시하고, 숨겨진 동안 공간을 차지하지 않음
- 헤더: 3초 동안 사용하지 않으면 접힘, 화면 맨 위로 마우스를 올리면 다시 표시, 호버 중이거나 모달이 열려 있으면 유지 (`useAutoHide` 훅)
- 백업 / 복원: 헤더 버튼, JSON 복사와 붙여넣기, 복원 전 확인

## 디자인 토큰

테마 색은 아래 세 값에서만 파생합니다. 다른 색을 새로 하드코딩하지 않습니다.

```css
@theme {
  --color-dark: #3d5f3e;
  --color-mid: #759c7f;
  --color-light: #e7efda;
}
```

<!-- 위 hex 값은 Figma의 실제 값으로 교체할 것 -->

- 더 진한 색(`deep`): `color-mix(in oklch, dark, black 38%)`
- 더 밝은 색(`pale`): `color-mix(in oklch, light, white 55%)`

**컬럼별 색 역할**

| 컬럼   | 배경  | 제목  | 항목 배경 | 항목 글자 |
| ------ | ----- | ----- | --------- | --------- |
| Weekly | dark  | light | light     | dark      |
| Daily  | mid   | deep  | dark      | light     |
| Memo   | light | dark  | mid       | pale      |

- 중간 색(mid) 배경 위에는 글자를 직접 올리지 않습니다. 대비가 부족하므로 제목은 deep, 항목은 dark 카드 안에 넣습니다.
- 선택된 메모 타일은 dark 배경 + light 글자입니다.

**형태**

- 입력창, 할 일 항목: 알약 모양 (완전 둥근 모서리)
- 날짜 카드: 모서리 20px
- 메모 타일: 약 88×86px, 모서리 16px
- 컬럼 제목: 30px, ExtraBold
- 헤더 높이: 60px
- 폰트: Noto Sans KR

## 코드 규칙

- `any` 사용 금지
- 컴포넌트 props는 `type`으로 정의
- 컴포넌트는 함수 선언 + default export
- 상태 변경은 불변성 유지 (`push` 대신 새 배열)
- Zustand에서 값을 꺼낼 때는 selector 사용
- 세 컬럼에서 공통으로 쓰는 컴포넌트는 색 역할을 props나 CSS 변수로 받아 재사용

## 작업 방식

- 한 번에 한 단계씩 진행합니다.
  1. 타입, 날짜 유틸, 디자인 토큰
  2. Zustand 스토어
  3. 레이아웃 (헤더 + 3단)
  4. 공통 컴포넌트
  5. Weekly → Daily → Memo
  6. 헤더 자동 숨김, 백업 / 복원
- 단계가 끝나면 `pnpm build`로 타입 에러가 없는지 확인합니다.
- 작업 후 변경 요약과 **새로 사용한 TypeScript 문법 설명**을 함께 알려 줍니다. (TypeScript 학습 중)
- 새 패키지 설치가 필요하면 먼저 이유를 설명하고 확인을 받습니다.
- 커밋 메시지 접두어: `feat`, `fix`, `style`, `refactor`, `chore`, `docs`
