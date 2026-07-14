# Safe Scope Frontend

생활안전지도와 VWorld 데이터를 한 화면에서 조회하는 React 지도 애플리케이션입니다. Bun, Vite, React, TypeScript, OpenLayers, Emotion을 사용합니다.

## 실행

```bash
bun install
bun run dev
```

프로덕션 빌드와 개별 검증 명령은 다음과 같습니다.

```bash
bun run typecheck
bun run lint
bun run test
bun run check:unused
bun run check:circular
bun run build
```

모든 검증은 `bun run check`로 한 번에 실행할 수 있습니다.

## 환경 변수

로컬 `.env`에 다음 Vite 공개 환경 변수 키가 필요합니다.

```dotenv
VITE_SAFE_MAP_API_TOKEN=
VITE_V_WORLD_API_TOKEN=
```

## 구조

```text
src/
├─ app/                   # 라우팅과 애플리케이션 조합
├─ pages/                 # 페이지 단위 컴포넌트
├─ features/map/
│  ├─ api/                # VWorld 검색 요청과 응답 검증
│  ├─ components/         # 검색, 레이어 메뉴, 지도 상태 UI
│  ├─ constants/          # 레이어 옵션과 지도 상수
│  ├─ hooks/              # 검색 상태와 OpenLayers 수명주기
│  ├─ layers/             # 지도 타일 레이어 생성 함수
│  ├─ model/              # 순수 도메인 로직과 단위 테스트
│  ├─ styles/             # 지도 화면 Emotion 스타일
│  └─ types/              # 지도 및 검색 도메인 타입
├─ shared/utils/          # 도메인에 종속되지 않은 유틸리티
├─ styles/                # 전역 스타일
└─ main.tsx               # 브라우저 진입점
```
