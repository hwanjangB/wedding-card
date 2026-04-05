# 배포 전 Security Checklist

## 1. Firebase 보안 규칙 ✅ (적용 완료)

Firestore > 규칙 탭에서 아래 규칙 적용:
- 방명록: 읽기/쓰기 허용, 수정/삭제 불가
- RSVP: 쓰기만 허용, 읽기/수정/삭제 불가

## 2. 환경변수 & API 키

- [ ] `.env` 파일이 `.gitignore`에 포함되어 있는지 확인
- [ ] Firebase config는 프론트엔드에 노출되어도 보안상 OK (보안 규칙이 보호)
- [ ] 카카오 JavaScript 키 → 플랫폼 도메인 제한이 설정되어 있는지 확인
  - 허용 도메인: 배포 URL만 (localhost 제거)
- [ ] 네이버 지도 API 키 → 등록된 도메인에서만 동작하도록 설정

## 3. Firebase Admin 키 (데이터 다운로드용)

- [ ] `serviceAccountKey.json`은 절대 git에 올리지 않기
- [ ] `.gitignore`에 `serviceAccountKey.json` 포함 확인
- [ ] 이 키는 로컬에만 보관

## 4. 배포 도메인 설정

- [ ] 카카오 개발자 콘솔 > JavaScript SDK 도메인 → `https://<username>.github.io` 추가
- [ ] 카카오 개발자 콘솔 > 제품 링크 관리 > 웹 도메인 → 배포 URL 추가
- [ ] 네이버 클라우드 > 네이버 지도 > 허용 도메인 → 배포 URL 추가
- [ ] `localhost:5173` 도메인은 배포 후 제거 (개발용이므로)

## 5. 개인정보 보호

- [ ] `data.json`에 실제 전화번호/계좌번호 입력 시 git public repo에 올라가는 점 인지
  - 방법 A: private repo 사용
  - 방법 B: `data.json`을 `.gitignore`에 추가하고 별도 관리
- [ ] OG 이미지(미리보기)에 민감 정보 없는지 확인

## 6. Firestore 테스트 모드 만료

- [ ] 테스트 모드는 30일 후 자동 만료 → 보안 규칙이 적용되어 있으면 문제 없음
- [ ] Firebase 콘솔에서 "규칙" 탭의 경고 메시지가 사라졌는지 확인

## 7. GitHub Pages 배포 시

- [ ] `vite.config.ts`에 `base` 경로 설정 (repo 이름에 맞게)
- [ ] HTTPS 활성화 확인 (GitHub Pages 기본 지원)
- [ ] 커스텀 도메인 사용 시 CNAME 설정

## 8. 최종 테스트

- [ ] 모바일(iPhone/Android)에서 실제 접속 테스트
- [ ] 카카오톡 공유 → 미리보기 이미지/제목 확인
- [ ] 길찾기 버튼 (카카오맵/네이버/티맵) 동작 확인
- [ ] 방명록 작성 → Firebase에 저장되는지 확인
- [ ] RSVP 제출 → Firebase에 저장되는지 확인
- [ ] 계좌번호 복사 동작 확인
- [ ] Google/Apple 캘린더 추가 동작 확인
- [ ] export 스크립트로 데이터 다운로드 테스트
