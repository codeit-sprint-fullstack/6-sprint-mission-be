"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "PandaMarket API Docs",
            version: "1.0.0",
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
            schemas: {
                // 예시: User, Product, Comment 등 스키마 정의
                User: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        email: { type: "string", format: "email" },
                        nickname: { type: "string" },
                        images: {
                            type: "array",
                            items: { type: "string", format: "uri" }, // 이미지 URL이니까 format: uri
                            description: "이미지 URL 목록",
                        },
                        createdAt: { type: "string", format: "date-time" },
                    },
                },
                // 추가 스키마 정의 가능
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["./src/controllers/*.js"], // 주석 있는 파일 위치로 정확히 지정
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
exports.default = swaggerSpec;
//# sourceMappingURL=swagger.js.map