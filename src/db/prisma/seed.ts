import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 기존 데이터 삭제 (선택사항)
  await prisma.article.deleteMany({});

  // 기본 게시글 시드 데이터
  const baseArticleSeedData = [
    {
      title: "프로그래밍 입문자를 위한 추천 언어",
      content:
        "프로그래밍을 처음 시작하는 분들에게 JavaScript를 추천합니다. 웹 개발에 활용도가 높고, 시각적인 결과물을 바로 확인할 수 있어 학습 동기 부여에 좋습니다.",
      likes: 15,
    },
    {
      title: "효과적인 알고리즘 공부법",
      content:
        "알고리즘 공부를 시작하기 전에 기본적인 자료구조에 대한 이해가 필요합니다. 배열, 링크드 리스트, 스택, 큐, 트리, 그래프 등의 개념을 먼저 학습하는 것이 좋습니다.",
      likes: 42,
    },
    {
      title: "리액트 vs 뷰: 어떤 프레임워크를 선택해야 할까?",
      content:
        "리액트와 뷰는 각각의 장단점이 있습니다. 리액트는 생태계가 넓고 커뮤니티가 활발하며, 뷰는 학습 곡선이 낮고 직관적인 문법을 가지고 있습니다. 프로젝트의 요구사항과 팀의 경험에 따라 선택하는 것이 좋습니다.",
      likes: 28,
    },
    {
      title: "백엔드 개발자가 알아야 할 데이터베이스 최적화 기법",
      content:
        "데이터베이스 성능 최적화를 위해 인덱싱, 쿼리 최적화, 캐싱 등의 기법을 활용할 수 있습니다. 특히 자주 사용되는 쿼리에 대한 인덱스 설정은 성능 향상에 큰 도움이 됩니다.",
      likes: 35,
    },
    {
      title: "깃과 깃허브 사용법 완벽 가이드",
      content:
        "버전 관리 시스템인 깃을 효과적으로 사용하는 방법과 깃허브를 통한 협업 방식에 대해 알아봅시다. 브랜치 전략, 풀 리퀘스트, 코드 리뷰 등의 개념과 실전 사용법을 다룹니다.",
      likes: 51,
    },
    {
      title: "프론트엔드 개발자를 위한 성능 최적화 팁",
      content:
        "웹 페이지 로딩 속도를 향상시키기 위한 다양한 기법들이 있습니다. 이미지 최적화, 코드 스플리팅, 레이지 로딩, 메모이제이션 등의 기술을 적용하여 사용자 경험을 개선할 수 있습니다.",
      likes: 39,
    },
    {
      title: "클라우드 서비스 비교: AWS vs Azure vs GCP",
      content:
        "주요 클라우드 서비스 제공업체인 AWS, Azure, GCP의 특징과 장단점을 비교해봅니다. 각 서비스의 가격 정책, 제공 기능, 사용 편의성 등을 고려하여 프로젝트에 적합한 서비스를 선택하는 방법을 알아봅시다.",
      likes: 23,
    },
    {
      title: "노드JS와 익스프레스로 RESTful API 만들기",
      content:
        "Node.js와 Express 프레임워크를 사용하여 간단한 RESTful API를 구현하는 과정을 단계별로 설명합니다. 라우팅, 미들웨어, 오류 처리 등의 개념을 실습을 통해 배워봅시다.",
      likes: 47,
    },
    {
      title: "타입스크립트 시작하기: 자바스크립트 개발자를 위한 가이드",
      content:
        "자바스크립트에서 타입스크립트로 전환하는 방법과 이점에 대해 알아봅니다. 타입 정의, 인터페이스, 제네릭 등의 핵심 개념과 실전 활용법을 다룹니다.",
      likes: 31,
    },
    {
      title: "디자인 패턴과 실전 적용 사례",
      content:
        "소프트웨어 개발에서 자주 사용되는 디자인 패턴들과 그 실제 적용 사례에 대해 알아봅니다. 싱글톤, 팩토리, 옵저버, 전략 패턴 등의 개념과 활용 방법을 코드 예제와 함께 설명합니다.",
      likes: 18,
    },
  ];

  // 추가 제목과 내용 뱅크
  const additionalTitles = [
    "웹 개발자를 위한 필수 도구 모음",
    "프로그래밍 언어 트렌드 2025",
    "초보 개발자가 저지르는 흔한 실수 TOP 10",
    "컨테이너화와 쿠버네티스 입문",
    "프로그래밍 커리어 성장을 위한 조언",
    "머신러닝 기초부터 실전까지",
    "코드 리팩토링의 기술과 원칙",
    "서버리스 아키텍처의 장단점",
    "비동기 프로그래밍 마스터하기",
    "모바일 앱 개발 트렌드",
    "데브옵스 문화 도입하기",
    "클린 코드 작성법",
    "객체지향 설계의 핵심 원칙",
    "함수형 프로그래밍 실전 가이드",
    "마이크로서비스 아키텍처 설계",
  ];

  const additionalContents = [
    "개발 생산성을 높이기 위한 다양한 도구와 확장 프로그램을 소개합니다. 코드 에디터부터 버전 관리, CI/CD 도구까지 개발 워크플로우를 개선할 수 있는 방법을 알아봅시다.",
    "최근 기술 트렌드와 인기 있는 프로그래밍 언어의 동향을 분석합니다. 취업 시장에서 수요가 높은 기술 스택과 미래 유망한 언어에 대해 알아봅시다.",
    "처음 개발을 시작할 때 많은 개발자들이 저지르는 실수와 그 해결 방법에 대해 알아봅니다. 실제 사례를 통해 학습하고 더 나은 개발자가 되기 위한 팁을 제공합니다.",
    "도커와 쿠버네티스를 사용한 컨테이너화의 기초부터 실제 배포까지 단계별로 알아봅니다. 마이크로서비스 아키텍처에서의 활용 방법도 함께 다룹니다.",
    "주니어에서 시니어 개발자로 성장하기 위한 기술적, 비기술적 역량 개발 방법에 대해 알아봅니다. 성공적인 커리어 경로와 자기계발 방법을 공유합니다.",
    "인공지능과 머신러닝의 기본 개념부터 실제 모델 구현까지 단계별로 설명합니다. 파이썬과 주요 라이브러리를 활용한 실습 예제를 통해 학습합니다.",
    "가독성과 유지보수성을 높이는 코드 리팩토링 기법을 소개합니다. 기술 부채를 줄이고 더 나은 코드베이스를 구축하는 방법을 알아봅시다.",
    "AWS Lambda, Azure Functions 등의 서버리스 플랫폼 활용법과 서버리스 아키텍처의 장단점을 분석합니다. 적합한 사용 사례와 주의해야 할 점들을 알아봅시다.",
    "프로미스, async/await, 옵저버블 등 비동기 프로그래밍 패턴의 이해와 활용 방법을 다룹니다. 동시성 처리와 성능 최적화 기법도 함께 살펴봅니다.",
    "React Native, Flutter, Swift, Kotlin 등 다양한 모바일 앱 개발 프레임워크의 특징과 장단점을 비교합니다. 현재 업계 트렌드와 미래 전망을 살펴봅니다.",
    "개발과 운영의 통합을 통한 효율적인 소프트웨어 개발 문화 구축 방법을 알아봅니다. CI/CD 파이프라인 구축과 자동화 도구 활용법을 소개합니다.",
    "가독성 높고 유지보수하기 쉬운 코드를 작성하기 위한 원칙과 방법론을 다룹니다. 실제 코드 예제를 통해 개선 방법을 살펴봅시다.",
    "SOLID 원칙, DRY, KISS 등 객체지향 설계의 핵심 원칙들을 실제 코드 예제와 함께 살펴봅니다. 아키텍처 패턴과의 연계 방법도 알아봅시다.",
    "함수형 프로그래밍의 핵심 개념과 장점을 소개합니다. 순수 함수, 불변성, 고차 함수 등의 개념과 실제 프로젝트에서의 활용법을 다룹니다.",
    "대규모 애플리케이션을 위한 마이크로서비스 아키텍처 설계 방법론을 살펴봅니다. 서비스 분리, API 게이트웨이, 서비스 발견 등의 핵심 개념을 다룹니다.",
  ];

  // 100개의 시드 데이터 생성
  const articleSeedData = [];

  // 기본 10개 데이터 추가
  articleSeedData.push(...baseArticleSeedData);

  // 나머지 90개 데이터 생성
  for (let i = 0; i < 90; i++) {
    // 기본 데이터 또는 추가 데이터에서 랜덤하게 선택
    let title, content;

    if (Math.random() > 0.5 && additionalTitles.length > 0) {
      // 추가 데이터에서 선택하고 사용한 항목 제거
      const titleIndex = Math.floor(Math.random() * additionalTitles.length);
      title = `${additionalTitles[titleIndex]} ${i + 11}`;
      content = additionalContents[titleIndex % additionalContents.length];
    } else {
      // 기본 데이터에서 변형
      const baseIndex = Math.floor(Math.random() * baseArticleSeedData.length);
      title = `${baseArticleSeedData[baseIndex].title} - 파트 ${i + 11}`;
      content = `${baseArticleSeedData[baseIndex].content} 이 게시글은 시리즈의 일부로, 더 깊이 있는 내용을 다룹니다.`;
    }

    // 좋아요 수는 0~100 사이의 랜덤값
    const likes = Math.floor(Math.random() * 101);

    articleSeedData.push({
      title,
      content,
      likes,
    });
  }

  // 시드 데이터 입력
  console.log(`총 ${articleSeedData.length}개의 게시글을 추가합니다...`);

  for (const articleData of articleSeedData) {
    await prisma.article.create({
      data: articleData,
    });
  }

  console.log(
    `게시글 시드 데이터 ${articleSeedData.length}개가 성공적으로 추가되었습니다.`
  );
}

main()
  .catch((e) => {
    console.error("시드 데이터 추가 중 오류가 발생했습니다:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
