import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;

// DBeaver 연결확인을 위해 나중에 seed.ts 만들어보고 npm run seed 실행 (Express 제대로 배포하기 3교시 영상 참고)
