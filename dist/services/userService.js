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
const userRepository_1 = __importDefault(require("../repositories/userRepository"));
const user_dto_1 = require("../dto/user.dto");
const errors_1 = require("../types/errors");
function getById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield userRepository_1.default.findById(id);
        if (!user)
            throw new errors_1.NotFoundError("사용자를 찾을 수 없습니다.");
        const parsed = user_dto_1.UserResponseSchema.safeParse(user);
        if (!parsed.success)
            throw new Error("DB에서 반환된 사용자 정보가 형식과 다릅니다.");
        return parsed.data;
    });
}
exports.default = {
    getById,
};
//# sourceMappingURL=userService.js.map