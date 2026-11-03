# ReelsMotor 디자인·기능 QA

## 비교 대상과 증거

- 원본: `https://reelsmotor.com/create`, 허가된 화면 캡처. 사진 업로드 단계: `outputs/reelsmotor/source-photos-uploaded.png`; 완성 화면: `outputs/reelsmotor/source-ready.png`.
- 배포 구현: `https://bobaekimboae.github.io/reelsmotor/`. 업로드 단계 캡처: `outputs/reelsmotor/deployed-upload.png`; 완성 화면: `outputs/reelsmotor/deployed-ready-mobile.jpg`.
- 모바일 비교 입력: `outputs/reelsmotor/qa-mobile-comparison.jpg` (원본 화면과 배포 화면을 같은 비교 이미지에 배치, 375 × 844px 영역으로 정규화). 원본 캡처는 375px 너비, 배포 화면의 CSS 너비는 388px로 13px 차이가 있다.
- 실제 배포 화면은 Chrome 인앱 브라우저에서 열고 확인했다.

## 검증한 흐름

1. 배포 화면에서 테스트 사진 3장을 선택하고, 썸네일 3개가 표시되는 것을 확인.
2. Toyota Corolla, 2022년식, 30,000km, 자동, 휘발유, £12,000 차량 정보를 입력하고 다음 단계로 이동.
3. 스타일·전화번호·이메일을 입력하고 영상 생성을 실행.
4. 생성 완료 화면에서 영상 미리보기가 로드되고 재생됨: 12초, 720 × 1280, 브라우저 재생 상태 `readyState=4`.
5. `MP4 다운로드`를 눌러 `C:\Users\82108\Downloads\toyota-corolla.mp4` 파일을 저장했다. 파일 크기 1,675,869바이트이고 MP4 컨테이너의 `ftyp` 헤더를 확인했다.
6. 모바일 폭 388 × 844 CSS px에서 완성 화면의 헤더·영상·버튼 배치를 확인했다.
7. 화면에 나타난 오류나 생성 실패는 없었다. 인앱 브라우저에서 개발자 콘솔 오류 목록은 조회할 수 없었다.

## 시각 검토

검토한 P0/P1/P2 수정 사항은 없다. 원본의 검정 배경, 주황색 강조, 상단 브랜드 헤더, 단계 안내, 차량 사진 썸네일, 세로 영상 미리보기, 다운로드·게시·요금제 섹션 구조를 재현했고 전체 흐름의 문구를 한국어로 바꿨다. 영상 프레임에는 테스트 자동차 사진과 차량 정보 및 ReelsMotor 워터마크가 표시된다.

## 후속 개선 (P3)

- 데스크톱/모바일 캡처의 화면 폭과 높이를 완전히 일치시키고, 원본과 동일한 계정 상태에서 시각 비교를 보강.
- GitHub Pages 정적 버전에는 계정 로그인, 이메일 발송, 결제 및 소셜 계정 연결·자동 게시 기능이 연결되어 있지 않다. 이 범위는 README에 고지했다.

## 최종 결과

final result: passed
