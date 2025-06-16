import { Express } from "express";

declare global {
    namespace Express{
        interface Request {
            // 속성 추가 영역 
        }
    }
}