"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const jwtStrategy_1 = __importDefault(require("../middlewares/passport/jwtStrategy"));
passport_1.default.use("access-token", jwtStrategy_1.default.accessTokenStrategy);
passport_1.default.use("refresh-token", jwtStrategy_1.default.refreshTokenStrategy);
exports.default = passport_1.default;
//# sourceMappingURL=passport.js.map