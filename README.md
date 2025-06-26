# 🐼 판다마켓 프로젝트

> _이 저장소는 판다마켓 프로젝트의 백엔드 코드를 관리하는 곳입니다. 프로젝트를 클론하여 개발 환경을 설정하고, 각 브랜치에서 해당 스프린트 미션을 수행해 주세요!_ 🛠️

## 소개

안녕하세요! 판다마켓 프로젝트에 오신 것을 환영합니다! 🥳  
판다마켓은 따뜻한 중고거래를 위한 커뮤니티 플랫폼이에요. 여러분은 이곳에서 상품을 등록하고, 다른 사용자들과 소통하며, 자유롭게 이야기를 나눌 수 있어요. 매주 스프린트 미션을 통해 기능을 하나씩 만들어 가며 성장해 나가는 여정을 함께해요. 🚀

![PandaMarket](https://github.com/user-attachments/assets/3784b99f-73c9-4349-a9a9-92b2a7563574)  
_위 이미지는 판다마켓의 대표 이미지입니다. 프로젝트가 진행됨에 따라 더 많은 이미지를 추가할 예정이에요!_ 📸

## 스프린트 미션이란? 🤔

스프린트 미션은 **하나의 개인 프로젝트를 길게 진행하면서, 그 과정에서 주기적으로 피드백을 받을 수 있는 시스템**이에요. 각 스프린트마다 배운 이론을 적용해 보고, **멘토님께 코드 리뷰를 받아가며 실력을 쑥쑥 키워갈 수 있는 중요한 개인 과제**랍니다. 💪

## 주요 기능 ✨

1. **상품 등록**: 내가 가진 물건을 올리고, 사진과 설명을 추가해 직접 판매할 수 있어요!
2. **문의 댓글**: 상품에 대한 궁금한 점이나 의견을 자유롭게 남길 수 있답니다. 📝
3. **자유게시판**: 다양한 주제로 친구들과 이야기를 나누고, 정보를 공유할 수 있는 공간이에요! 🗣️

## 프로젝트 브랜치 구조 🏗️

프로젝트는 단계별로 나뉘어 있고, 각 스프린트 미션에 맞는 브랜치가 있어요. 각 브랜치를 통해 체계적으로 개발하며 학습할 수 있어요. 🎯

### 브랜치 설명

1. **node (part1): 스프린트 미션 4의 BE 요구사항**

   - 백엔드 서버 설정과 간단한 API 구현을 위한 Express.js 프로젝트의 초기 세팅이 포함돼요.
   - **스프린트 미션 4**의 백엔드 내용이 포함돼 있어요.

2. **express (part2~4): 스프린트 미션 6 ~ 12의 BE 요구사항**
   - Express.js를 이용해 더 복잡한 백엔드 기능을 구현하는 미션입니다. 데이터베이스 연동, 인증 및 권한 관리 등 고급 API 설계가 포함됩니다.
   - **스프린트 미션 6부터 12까지**의 백엔드 내용이 들어 있어요.

> _스프린트 미션 내 프론트엔드 요구사항은 [프론트엔드 레포지토리](https://github.com/codeit-sprint-fullstack/6-Sprint-mission-FE)의 브랜치에서 관리해주세요_

본 프로젝트는 [코드잇](https://www.codeit.kr)의 소유이며, 교육 목적으로만 사용됩니다. © 2024 Codeit. All rights reserved.

## 이미지 업로드 시스템

### Presigned URL 방식 (클라이언트 직접 업로드)

이 프로젝트는 **Presigned URL**을 이용한 클라이언트 직접 업로드 방식을 사용합니다.

#### 장점

- 서버 부하 감소 (이미지 파일이 서버를 거치지 않음)
- 빠른 업로드 속도
- 확장성 향상
- 보안성 향상 (임시 URL, 5분 유효)

#### 업로드 플로우

1. **Presigned URL 요청**

   ```
   POST /articles/presigned-urls?access=public
   POST /products/presigned-urls?access=public
   POST /user/presigned-url?access=public
   ```

2. **클라이언트가 S3에 직접 업로드**

   - 생성된 `uploadUrl`로 PUT 요청
   - 5분 내에 업로드 완료 필요

3. **서버에 데이터 저장**
   - `fileUrl`을 포함한 데이터로 생성/수정 API 호출

#### Public vs Private 접근

- **Public**: 누구나 접근 가능한 이미지 (상품, 프로필 등)
- **Private**: 인증된 사용자만 접근 가능한 이미지 (임시 URL로 5분간 접근)

#### 사용 예시

```javascript
// 1. Presigned URL 생성
const response = await fetch("/articles/presigned-urls?access=public", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify([
    {
      filename: "image.jpg",
      contentType: "image/jpeg",
    },
  ]),
});
const [urlInfo] = await response.json();

// 2. S3에 직접 업로드
await fetch(urlInfo.uploadUrl, {
  method: "PUT",
  headers: {
    "Content-Type": "image/jpeg",
  },
  body: imageFile,
});

// 3. 서버에 데이터 저장
await fetch("/articles", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    title: "제목",
    content: "내용",
    images: [urlInfo.fileUrl],
  }),
});
```

### 엔드포인트

#### 게시글 (Articles)

- `POST /articles/presigned-urls` - 이미지 업로드용 Presigned URL 생성
- `POST /articles` - 게시글 생성
- `PATCH /articles/:id` - 게시글 수정

#### 상품 (Products)

- `POST /products/presigned-urls` - 이미지 업로드용 Presigned URL 생성
- `POST /products` - 상품 생성
- `PATCH /products/:id` - 상품 수정

#### 사용자 (Users)

- `POST /user/presigned-url` - 프로필 이미지 업로드용 Presigned URL 생성
- `PATCH /user/me` - 사용자 정보 수정

### 환경 변수

```
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_BUCKET_NAME=your_s3_bucket_name
```

## 설치 및 실행

```bash
npm install
npm run dev
```

## API 문서

Swagger UI를 통해 API 문서를 확인할 수 있습니다:

- 개발 환경: http://localhost:7777/api-docs
