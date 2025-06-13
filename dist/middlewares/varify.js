"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_prisma_js_1 = __importDefault(require("../config/client.prisma.js"));
//잘못된 요청을 보낸 경우 400 Bad request 에러를 발생
function throwBadRequestError() {
    const error = new Error("Bad Request, 필수 정보가 누락되었습니다.");
    error.code = 400;
    throw error;
}
//정보가 없는 경우 404 Not Found 에러를 발생
function throwNotFoundError() {
    const error = new Error("Not Found, 상품 정보를 찾을 수 없습니다.");
    error.code = 404;
    throw error;
}
//상품 등록 req에 필수 정보의 여부 확인
function requestStructure(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, description, price, tags, images } = req.body;
        if (!name || !description || !price || !tags || !images) {
            throwBadRequestError();
        }
        next();
    });
}
//회원가입 req에 필수 정보의 여부 확인
function signUpRequestStructure(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, nickname, password } = req.body;
        if (!email || !nickname || !password) {
            throwBadRequestError();
        }
        next();
    });
}
//회원가입 사용 중인 이메일인지 체크
function checkExistedEmail(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingUser = yield client_prisma_js_1.default.user.findUnique({
            where: { email: req.body.email },
        });
        if (existingUser) {
            const error = new Error("이미 사용 중인 이메일입니다.");
            error.code = 409;
            throw error;
        }
        next();
    });
}
exports.default = {
    requestStructure,
    throwNotFoundError,
    signUpRequestStructure,
    checkExistedEmail,
};
//# sourceMappingURL=varify.js.map